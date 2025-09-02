'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore"; 
import { Logo } from '@/components/logo';
import { Stepper } from '@/components/dashboard/stepper';
import { Step1Upload } from '@/components/dashboard/step-1-upload';
import { Step2Generate } from '@/components/dashboard/step-2-generate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, Check, LifeBuoy, LogOut, Settings, Star } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

function PricingSection({ onSubscribe, isSubscribing }: { onSubscribe: (priceId: string) => void; isSubscribing: boolean; }) {
  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-headline">
          Planos para cada fase do seu crescimento
        </h2>
        <p className="text-lg text-slate-400 mb-16">
          Comece de graça e evolua à medida que a sua equipa cresce. Simples e transparente.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="glassmorphism-card rounded-xl p-8 flex flex-col text-center">
          <h3 className="text-2xl font-bold text-white">Free</h3>
          <p className="mt-4"><span className="text-4xl font-bold text-white">$0</span><span className="text-slate-400">/mês</span></p>
          <p className="mt-2 text-slate-400">Perfeito para equipas Agile a começar.</p>
          <ul className="mt-8 space-y-4 text-slate-300 flex-grow">
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>3 projetos por mês</span></li>
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Geração de templates Agile Scrum</span></li>
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Integração com o workspace do ClickUp</span></li>
          </ul>
           <Button variant="outline" className="w-full mt-8" disabled>Plano Atual</Button>
        </div>
        
        {/* Pro Plan */}
        <div className="glassmorphism-card rounded-xl p-8 flex flex-col text-center border-2 border-primary relative shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MAIS POPULAR</div>
          <h3 className="text-2xl font-bold text-white">Pro</h3>
          <p className="mt-4"><span className="text-4xl font-bold text-white">$5</span><span className="text-slate-400">/mês</span></p>
          <p className="mt-2 text-slate-400">Para equipas Agile em crescimento e Scrum masters.</p>
          <ul className="mt-8 space-y-4 text-slate-300 flex-grow">
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>50 projetos por mês</span></li>
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Templates avançados do framework Scrum</span></li>
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Sincronização com múltiplos workspaces</span></li>
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Suporte prioritário</span></li>
          </ul>
          <Button onClick={() => onSubscribe('price_1PKXq4Rp4yFR3c3g85c5P26C')} className="cta-button w-full mt-8 py-3 px-6 rounded-lg font-semibold text-white transition block" disabled={isSubscribing}>Iniciar Teste Gratuito</Button>
        </div>

        {/* Business Plan */}
        <div className="glassmorphism-card rounded-xl p-8 flex flex-col text-center">
          <h3 className="text-2xl font-bold text-white">Business</h3>
          <p className="mt-4"><span className="text-4xl font-bold text-white">$13</span><span className="text-slate-400">/mês</span></p>
          <p className="mt-2 text-slate-400">Para organizações Agile empresariais.</p>
          <ul className="mt-8 space-y-4 text-slate-300 flex-grow">
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Projetos ilimitados</span></li>
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Frameworks Enterprise Scrum & Kanban</span></li>
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Coordenação multi-equipa</span></li>
            <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /><span>Suporte dedicado</span></li>
          </ul>
           <Button onClick={() => onSubscribe('price_1PKXrARp4yFR3c3gC63xY62u')} className="w-full mt-8 py-3 px-6 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition block" disabled={isSubscribing}>Contactar Vendas</Button>
        </div>
      </div>
    </section>
  );
}

function ManageSubscriptionSection({ onManage, isManaging }: { onManage: () => void; isManaging: boolean; }) {
  return (
    <section id="manage-subscription" className="py-20 md:py-32">
      <div className="max-w-2xl mx-auto text-center">
         <Card className="glassmorphism-card">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">A sua Subscrição</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-400 mb-6">
                    Obrigado por ser um membro valioso. Pode gerir os detalhes da sua subscrição, visualizar faturas e atualizar as informações de pagamento no portal do cliente.
                </p>
                <Button onClick={onManage} className="cta-button w-full max-w-xs mt-4 py-3 px-6 rounded-lg font-semibold text-white transition block mx-auto" disabled={isManaging}>
                    <Settings className="w-4 h-4 mr-2" />
                    Gerir Subscrição
                </Button>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}


export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClickUpConnected, setIsClickUpConnected] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
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
            setIsClickUpConnected(clickupStatus === 'success');
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
  
  const handleSubscribe = async (priceId: string) => {
      if (!user) {
          toast({ variant: "destructive", title: "Erro de Autenticação", description: "Precisa de estar autenticado para subscrever." });
          return;
      }
      setIsSubscribing(true);
      try {
          const idToken = await user.getIdToken(true);
          const response = await axios.post(
              `${backendUrl}/create-checkout-session`,
              { priceId: priceId },
              {
                  headers: {
                      Authorization: `Bearer ${idToken}`,
                  },
              }
          );

          if (response.data.url) {
              window.location.href = response.data.url;
          } else {
              throw new Error("URL de checkout não recebida.");
          }
      } catch (error) {
          console.error("Erro ao criar sessão de checkout:", error);
          toast({ variant: "destructive", title: "Erro de Subscrição", description: "Não foi possível iniciar o processo de pagamento. Por favor, tente novamente." });
          setIsSubscribing(false);
      }
  };

  const handleManageSubscription = async () => {
    // This will eventually call the backend to create a Stripe Customer Portal session
    toast({ title: "A ser implementado", description: "A gestão de subscrições será implementada em breve." });
  };


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
  
  if (loading || (isSubscribing && subscriptionPlan !== 'free')) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <p>{isSubscribing ? 'A redirecionar para o pagamento...' : 'A carregar...'}</p>
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
                    <DropdownMenuItem onClick={handleManageSubscription}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Gerir Subscrição</span>
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
                <div className="mt-16">
                  {subscriptionPlan === 'free' ? (
                     <PricingSection onSubscribe={handleSubscribe} isSubscribing={isSubscribing}/>
                  ) : (
                     <ManageSubscriptionSection onManage={handleManageSubscription} isManaging={isSubscribing} />
                  )}
                </div>
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
