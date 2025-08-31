'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore"; 
import { Logo } from '@/components/logo';
import { Stepper } from '@/components/dashboard/stepper';
import { Step1Upload } from '@/components/dashboard/step-1-upload';
import { Step2Generate } from '@/components/dashboard/step-2-generate';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import axios from 'axios';

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClickUpConnected, setIsClickUpConnected] = useState(false);
  const router = useRouter();

  const backendUrl = 'https://generateprojectx-742708145888.southamerica-east1.run.app';
  
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
        
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('clickup_status') === 'success') {
            setIsClickUpConnected(true);
            router.replace('/dashboard', undefined); 
            setLoading(false);
        } else if (searchParams.get('clickup_status') === 'error') {
            setIsClickUpConnected(false);
            router.replace('/dashboard', undefined);
            setLoading(false);
        }
        else {
            checkClickUpConnection(user);
        }

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
  
  const clickUpAuthUrl = user ? `${backendUrl}/clickup/auth?uid=${user.uid}` : '#';

  const steps = ['Upload Document', 'Generate Project'];

  const handleDocParsed = (docText: string) => {
    setDocumentText(docText);
    setCurrentStep(1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setDocumentText(null);
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Upload onDocParsed={handleDocParsed} />;
      case 1:
        return user && documentText && <Step2Generate documentText={documentText} user={user} backendUrl={backendUrl} onReset={handleReset} />;
      default:
        return <Step1Upload onDocParsed={handleDocParsed} />;
    }
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
                    <p className="text-muted-foreground mb-6">Allow Archie to create tasks in your workspace to get started.</p>
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90" disabled={!user}>
                      <a href={clickUpAuthUrl}>
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
