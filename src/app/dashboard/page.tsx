
'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore"; 
import { Logo } from '@/components/logo';
import { Stepper } from '@/components/dashboard/stepper';
import { Step1Upload, type Step1Output } from '@/components/dashboard/step-1-upload';
import { Step2Generate } from '@/components/dashboard/step-2-generate';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, LifeBuoy, LogOut, Settings, Star } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Data, setStep1Data] = useState<Step1Output | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClickUpConnected, setIsClickUpConnected] = useState(false);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const backendUrl = 'https://generateprojectx-742708145888.southamerica-east1.run.app';
  
  useEffect(() => {
    const checkUserStatus = async (currentUser: User) => {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsClickUpConnected(!!userData.clickupAccessToken);
            setSubscriptionPlan(userData.subscriptionPlan || 'free'); 
        } else {
            setIsClickUpConnected(false);
            setSubscriptionPlan('free');
        }
      } catch (error) {
        console.error("Error checking Firestore:", error);
        setIsClickUpConnected(false);
        setSubscriptionPlan('free');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        
        const searchParams = new URLSearchParams(window.location.search);
        const clickupStatus = searchParams.get('clickup_status');
        const stripeStatus = searchParams.get('stripe');

        if (clickupStatus) {
            toast({
                title: clickupStatus === 'success' ? 'ClickUp Connected!' : 'ClickUp Connection Failed',
                description: clickupStatus === 'success' ? 'Your account is now connected to ClickUp.' : 'Could not connect to ClickUp. Please try again.',
                variant: clickupStatus === 'success' ? 'default' : 'destructive',
            });
            router.replace('/dashboard', undefined);
        }
        
        if (stripeStatus) {
            toast({
                title: stripeStatus === 'success' ? "Pagamento Bem-Sucedido!" : "Pagamento Cancelado",
                description: stripeStatus === 'success' ? "A sua subscrição foi ativada." : "O processo de pagamento foi cancelado.",
                variant: stripeStatus === 'success' ? 'default' : 'destructive',
            });
            router.replace('/dashboard', undefined); 
        }

        checkUserStatus(user);

      } else {
        router.push('/login');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, toast]);
  
  const handleManageSubscription = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Erro de Autenticação", description: "Precisa de estar autenticado." });
        return;
    }
    setIsManagingSubscription(true);
    try {
        const idToken = await user.getIdToken(true);
        const response = await axios.post(
            `${backendUrl}/create-portal-session`, 
            {},
            { 
                headers: { 
                    Authorization: `Bearer ${idToken}` 
                } 
            }
        );
        if (response.data.url) {
            window.location.href = response.data.url;
        }
    } catch (error) {
        console.error("Erro ao criar sessão do portal:", error);
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível abrir o portal do cliente. Por favor, tente novamente." });
    } finally {
        setIsManagingSubscription(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  const clickUpAuthUrl = user ? `${backendUrl}/clickup/auth?uid=${user.uid}` : '#';

  const steps = ['Upload Document', 'Generate Project'];

  const handleDocParsed = (data: Step1Output) => {
    setStep1Data(data);
    setCurrentStep(1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setStep1Data(null);
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <p>A carregar...</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1Upload onDocParsed={handleDocParsed} />;
      case 1:
        return user && step1Data && <Step2Generate documentText={step1Data.text} fileSize={step1Data.size} user={user} backendUrl={backendUrl} onReset={handleReset} />;
      default:
        return <Step1Upload onDocParsed={handleDocParsed} />;
    }
  }
  
  const planName = subscriptionPlan ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1) : 'Free';

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <Logo />
        <div className="ml-auto flex items-center gap-4">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL || 'https://picsum.photos/32/32'} alt={user?.displayName || 'User'} />
                            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem disabled>
                        <Star className="mr-2 h-4 w-4" />
                        <span>{planName} Plan</span>
                     </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleManageSubscription} disabled={isManagingSubscription}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{isManagingSubscription ? 'Redirecionando...' : 'Gerir Subscrição'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Suporte</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto w-full max-w-4xl mt-8">
            {isManagingSubscription ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center">
                 <p className="text-lg">A redirecionar para o portal do cliente...</p>
              </div>
            ) : isClickUpConnected ? (
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
