'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Assuming you have this file
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import type { Task } from '@/lib/types'; // Assuming you have this file
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
import { ExternalLink, Loader, CheckCircle, XCircle } from 'lucide-react';

// This is a placeholder for the mammoth library. You'd import it in a real project.
declare global {
    interface Window { mammoth: any; }
}

// Define a schema for the configuration data
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
  const [result, setResult] = useState({ status: "", message: "" });
  const router = useRouter();

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

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  const handleConnectClickUp = () => {
      if (user) {
          window.location.href = `https://generateproject-742708145888.us-central1.run.app/clickup/auth?uid=${user.uid}`;
      } else {
          alert("You must be logged in.");
      }
  };

  const steps = ['Upload Document', 'Configure Project', 'Generate'];

  // This function now receives the file and handles parsing here
  const handleFileUploaded = async (file: File) => {
    try {
        // In a real app, you'd show a loading state here
        const arrayBuffer = await file.arrayBuffer();
        
        // --- This is a simplified parsing logic ---
        // You would replace this with your actual parsing logic to extract tasks
        const textResult = await window.mammoth.extractRawText({ arrayBuffer });
        const parsedText = textResult.value;
        const parsedTasks: Task[] = parsedText.split('\n').filter(line => line.trim() !== '').map(line => ({ name: line, description: 'Generated from document.' }));
        // --- End of simplified parsing logic ---

        setDocumentText(parsedText); // Store the raw text
        setTasks(parsedTasks);
        setCurrentStep(1);
    } catch (error) {
        console.error("Failed to parse document:", error);
        alert("Could not read the document. Please ensure it's a valid .docx file.");
    }
  };

  const handleConfigured = async (config: ProjectConfig) => {
    if (!user || !documentText) {
        alert("An error occurred. Please start over.");
        handleReset();
        return;
    }

    setProjectConfig(config);
    setCurrentStep(2);

    try {
        const idToken = await user.getIdToken();
        const response = await fetch('https://generateproject-742708145888.us-central1.run.app', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentText: documentText,
                startDate: config.startDate?.toISOString().split('T')[0],
                listId: config.listId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate project.');
        }

        const data = await response.json();
        setResult({ status: "success", message: data.message });

    } catch (error: any) {
        console.error("Generation failed:", error);
        setResult({ status: "error", message: error.message });
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setTasks(null);
    setDocumentText(null);
    setProjectConfig(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // The prop for Step1Upload is now onFileUploaded
        return <Step1Upload onFileUploaded={handleFileUploaded} />;
      case 1:
        return tasks && <Step2Configure tasks={tasks} onConfigured={handleConfigured} onReset={handleReset} />;
      case 2:
        return <Step3Result onReset={handleReset} projectConfig={projectConfig} tasks={tasks} result={result} />;
      default:
        return <Step1Upload onFileUploaded={handleFileUploaded} />;
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
                    <Button onClick={handleConnectClickUp} size="lg" className="bg-purple-600 hover:bg-purple-700">
                        Connect to ClickUp
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </CardContent>
              </Card>
            )}
        </div>
      </main>
    </div>
  );
}
