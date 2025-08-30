'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore"; 
import type { Task } from '@/lib/types';
import { Logo } from '@/components/logo';
import { Stepper } from '@/components/dashboard/stepper';
import { Step1Upload } from '@/components/dashboard/step-1-upload';
import { Step2Configure } from '@/components/dashboard/step-2-configure';
import { Step3Result } from '@/components/dashboard/step-3-result';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const formSchema = z.object({
  startDate: z.date().optional(),
  listId: z.string(),
});
type ProjectConfig = z.infer<typeof formSchema>;

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClickUpConnected, setIsClickUpConnected] = useState(false);
  const [result, setResult] = useState<{ status: string, message: string } | null>(null);
  const router = useRouter();

  const clientId = process.env.NEXT_PUBLIC_CLICKUP_CLIENT_ID;
  const redirectUri = 'https://studio--archieai-a3yqp.us-central1.hosted.app/api/clickup/callback';
  const state = user?.uid;
  // This URL must be constructed carefully.
  const clickUpAuthUrl = `https://app.clickup.com/api?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

  useEffect(() => {
    const checkClickUpConnection = async (currentUser: User) => {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().clickupAccessToken) {
          setIsClickUpConnected(true);
        } else {
          setIsClickUpConnected(false);
        }
      } catch (error) {
        console.error("Error checking Firestore:", error);
        setIsClickUpConnected(false);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        checkClickUpConnection(user);
      } else {
        router.push('/login');
        setLoading(false);
      }
    });

    // Check for query params on mount
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get('success');
    if (success === 'true') {
        // Find a better way to check connection status
        setIsClickUpConnected(true);
    }


    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const steps = ['Upload Document', 'Configure Project', 'Generate'];

  const handleDocParsed = (parsedTasks: Task[], docText: string) => {
    setTasks(parsedTasks);
    setDocumentText(docText);
    setCurrentStep(1);
  };

  const handleConfigured = async (config: ProjectConfig) => {
    if (!user || tasks === null) {
        alert("An error occurred. Please start over.");
        handleReset();
        return;
    }

    setProjectConfig(config);
    setCurrentStep(2);

    // This is where you would call your backend to generate the project in ClickUp
    // For now, we'll simulate a successful response.
    try {
        // In a real app, you would make a fetch call here to your backend endpoint.
        // For example:
        // const idToken = await user.getIdToken();
        // const response = await fetch('/api/generate-project', { 
        //   method: 'POST',
        //   headers: { 
        //     'Authorization': `Bearer ${idToken}`,
        //     'Content-Type': 'application/json' 
        //   },
        //   body: JSON.stringify({ config, tasks })
        // });
        // const data = await response.json();
        
        console.log("Simulating project generation with config:", config, "and tasks:", tasks);

        // Simulate success
        setResult({ status: "success", message: "Project generation initiated." });

    } catch (error: any) {
        console.error("Generation failed:", error);
        setResult({ status: "error", message: error.message || "An unknown error occurred." });
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setTasks(null);
    setDocumentText(null);
    setProjectConfig(null);
    setResult(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Upload onDocParsed={handleDocParsed} />;
      case 1:
        return tasks && <Step2Configure tasks={tasks} onConfigured={handleConfigured} onReset={handleReset} />;
      case 2:
        return result && <Step3Result onReset={handleReset} projectConfig={projectConfig} tasks={tasks} result={result} />;
      default:
        return <Step1Upload onDocParsed={handleDocParsed} />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <Logo />
        <div className="ml-auto flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user?.photoURL || 'https://picsum.photos/32/32'} alt={user?.displayName || 'User'} />
            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-4xl mt-8">
            {isClickUpConnected ? (
              <>
                <div className="mb-16 flex justify-center">
                  <Stepper currentStep={currentStep} steps={steps} />
                </div>
                <Card className="min-h-[50vh] flex items-center justify-center transition-all duration-300">
                  <CardContent className="p-8 w-full">
                      {renderStep()}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="min-h-[50vh] flex items-center justify-center transition-all duration-300">
                <CardContent className="p-8 w-full text-center">
                    <h2 className="text-2xl font-bold mb-2">Connect to ClickUp</h2>
                    <p className="text-gray-400 mb-6">Allow Archie to create tasks in your workspace to get started.</p>
                    <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                      <a href={clickUpAuthUrl} target="_blank" rel="noopener noreferrer">
                        Connect to ClickUp
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                </CardContent>
              </Card>
            )}
        </div>
      </main>
    </div>
  );
}
