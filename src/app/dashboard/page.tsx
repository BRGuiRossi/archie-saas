'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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

// Define a schema for the configuration data to be passed to Step 3
const formSchema = z.object({
  startDate: z.date().optional(),
  listId: z.string(),
});
type ProjectConfig = z.infer<typeof formSchema>;

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const steps = ['Upload Document', 'Configure Project', 'Generate'];

  const handleDocParsed = (parsedTasks: Task[]) => {
    setTasks(parsedTasks);
    setCurrentStep(1);
  };

  const handleConfigured = (config: ProjectConfig) => {
    setProjectConfig(config);
    // Here you would typically make an API call to create the project in ClickUp.
    // For this demo, we'll just move to the success step.
    setCurrentStep(2);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setTasks(null);
    setProjectConfig(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Upload onDocParsed={handleDocParsed} />;
      case 1:
        return tasks && <Step2Configure tasks={tasks} onConfigured={handleConfigured} onReset={handleReset} />;
      case 2:
        return <Step3Result onReset={handleReset} projectConfig={projectConfig} tasks={tasks} />;
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
            <AvatarImage src={user?.photoURL || 'https://picsum.photos/32/32'} data-ai-hint="person" alt={user?.displayName || 'User'} />
            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
           <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-4xl mt-8">
            <div className="mb-16 flex justify-center">
              <Stepper currentStep={currentStep} steps={steps} />
            </div>

            <Card className="min-h-[50vh] flex items-center justify-center transition-all duration-300">
                <CardContent className="p-8 w-full">
                    {renderStep()}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
