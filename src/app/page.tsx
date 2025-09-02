'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UploadCloud,
  Settings2,
  Rocket,
  BrainCircuit,
  Link as LinkIcon,
  Users,
  Zap,
  FileCheck2,
  TrendingUp,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        } else {
          reveals[i].classList.remove('active');
        }
      }
    };

    window.addEventListener('scroll', reveal);
    reveal(); 

    return () => window.removeEventListener('scroll', reveal);
  }, []);

  return (
    <div className="overflow-x-hidden bg-background text-foreground">
      <div className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
        <div className="hero-video-container">
          <video autoPlay loop muted playsInline className="hero-video">
            <source src="https://videos.pexels.com/video-files/853875/853875-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="hero-overlay"></div>
        </div>

        <header className="absolute top-0 left-0 right-0 p-6 z-20">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h1 className="text-2xl font-bold text-white font-headline">Archie AI</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-slate-300">
              <a href="#features" className="hover:text-white transition">Funcionalidades</a>
              <a href="#how-it-works" className="hover:text-white transition">Como Funciona</a>
              <a href="#pricing" className="hover:text-white transition">Preços</a>
            </nav>
            <div>
              <Link href="/login">
                <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-5 rounded-lg transition">Login</button>
              </Link>
            </div>
          </div>
        </header>

        <main className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4 font-headline">
            Transforme <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">Ideias</span> em Ação. <br className="hidden md:block" /> Instantaneamente.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Archie é o seu co-piloto de IA que converte qualquer documento de projeto num plano de ação completo no ClickUp, em segundos. Deixe o caos para trás e abrace a clareza.
          </p>
          <Link href="/login">
            <button className="cta-button text-white font-bold py-4 px-10 rounded-lg text-xl">
              Experimente a Magia - Grátis
            </button>
          </Link>
        </main>
      </div>

      <div className="container mx-auto px-6 py-20 md:py-32">
        <section id="how-it-works" className="text-center reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-headline">A magia em <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">3 Passos Simples</span></h2>
          <p className="text-lg text-slate-400 mb-16 max-w-2xl mx-auto">Do seu documento a um projeto no ClickUp, pronto para executar, em menos de um minuto.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glassmorphism-card p-8 rounded-2xl">
              <div className="bg-indigo-500/20 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-headline">1. Faça o Upload</h3>
              <p className="text-slate-400">Envie o seu briefing, plano de projeto ou até mesmo notas de reunião. O Archie lê e compreende o conteúdo.</p>
            </div>
            <div className="glassmorphism-card p-8 rounded-2xl">
              <div className="bg-indigo-500/20 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500">
                <Settings2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-headline">2. Configure</h3>
              <p className="text-slate-400">Defina a data de início e escolha a lista de destino no seu ClickUp. Simples assim.</p>
            </div>
            <div className="glassmorphism-card p-8 rounded-2xl">
              <div className="bg-indigo-500/20 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500">
                <Rocket className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-headline">3. Execute</h3>
              <p className="text-slate-400">Receba um plano de projeto completo, com tarefas, dependências e checklists, pronto para a sua equipa executar.</p>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-32 reveal">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-headline">
              O Fim do Trabalho Manual de Planeamento
            </h2>
            <p className="text-lg text-slate-400 mb-16">
              O Archie não é apenas uma ferramenta, é o seu novo estratega de projetos.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glassmorphism-card p-6 rounded-2xl flex items-start gap-4">
              <BrainCircuit className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Análise com IA da Google</h3>
                <p className="text-slate-400 mt-1">Potenciado pelo Gemini para uma compreensão profunda e contextual do seu projeto.</p>
              </div>
            </div>
            <div className="glassmorphism-card p-6 rounded-2xl flex items-start gap-4">
              <LinkIcon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Integração Profunda com ClickUp</h3>
                <p className="text-slate-400 mt-1">Cria tarefas, dependências, datas e checklists, aproveitando ao máximo as funcionalidades do ClickUp.</p>
              </div>
            </div>
            <div className="glassmorphism-card p-6 rounded-2xl flex items-start gap-4">
              <Users className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Planeamento Agile Inteligente</h3>
                <p className="text-slate-400 mt-1">Organiza as tarefas em sprints lógicos, prontos para a sua equipa começar a trabalhar.</p>
              </div>
            </div>
            <div className="glassmorphism-card p-6 rounded-2xl flex items-start gap-4">
              <Zap className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Velocidade Radical</h3>
                <p className="text-slate-400 mt-1">Converta horas de planeamento manual em segundos de processamento automático.</p>
              </div>
            </div>
            <div className="glassmorphism-card p-6 rounded-2xl flex items-start gap-4">
              <FileCheck2 className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Da Ambiguidade à Clareza</h3>
                <p className="text-slate-400 mt-1">Transforme documentos densos e complexos em planos de ação claros e organizados.</p>
              </div>
            </div>
            <div className="glassmorphism-card p-6 rounded-2xl flex items-start gap-4">
              <TrendingUp className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold">Foco no Que Importa</h3>
                <p className="text-slate-400 mt-1">Liberte a sua equipa do trabalho de configuração para que se possam focar na execução e na inovação.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 text-center reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-headline">Amado por Equipas de Alta Performance</h2>
          <p className="text-lg text-slate-400 mb-16 max-w-2xl mx-auto">Veja o que os nossos utilizadores dizem sobre a revolução nos seus fluxos de trabalho.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glassmorphism-card p-8 rounded-2xl">
              <Image src="https://picsum.photos/80/80?u=1" alt="Avatar" width={80} height={80} data-ai-hint="woman" className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary" />
              <p className="text-slate-300 mb-4">"O Archie eliminou o maior gargalo do nosso processo: o setup inicial de projetos. O que demorava horas, agora acontece em segundos. É inacreditável."</p>
              <h4 className="font-bold text-white">Ana Sousa</h4>
              <p className="text-sm text-slate-400">Scrum Master na InnovateTech</p>
            </div>
            <div className="glassmorphism-card p-8 rounded-2xl">
              <Image src="https://picsum.photos/80/80?u=2" alt="Avatar" width={80} height={80} data-ai-hint="man" className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary" />
              <p className="text-slate-300 mb-4">"Como gestor de produtos, a minha vida é traduzir ideias em planos. O Archie é a ferramenta que eu nem sabia que precisava. Um verdadeiro game-changer."</p>
              <h4 className="font-bold text-white">Ricardo Mendes</h4>
              <p className="text-sm text-slate-400">Product Manager na NextLevel</p>
            </div>
            <div className="glassmorphism-card p-8 rounded-2xl">
              <Image src="https://picsum.photos/80/80?u=3" alt="Avatar" width={80} height={80} data-ai-hint="woman smiling" className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary" />
              <p className="text-slate-300 mb-4">"A velocidade com que passamos de uma chamada de kickoff para um plano de sprints completo no ClickUp é simplesmente revolucionária. Recomendo a 100%."</p>
              <h4 className="font-bold text-white">Sofia Costa</h4>
              <p className="text-sm text-slate-400">Diretora de Operações na Velocity Digital</p>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 md:py-32 reveal">
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
               {/* Link de pagamento para o plano Free (geralmente leva ao login) */}
               <Link href="/login" className="w-full mt-8 py-3 px-6 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition block">Começar</Link>
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
              {/* ATUALIZE ESTE LINK COM O SEU LINK DE CHECKOUT */}
              <Link href="/login" className="cta-button w-full mt-8 py-3 px-6 rounded-lg font-semibold text-white transition block">Iniciar Teste Gratuito</Link>
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
               {/* ATUALIZE ESTE LINK COM O SEU LINK DE CHECKOUT */}
               <Link href="/login" className="w-full mt-8 py-3 px-6 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition block">Contactar Vendas</Link>
            </div>
          </div>
        </section>

        <section className="text-center py-20 md:py-32 reveal">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-headline">Pronto para Revolucionar o seu Planeamento?</h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">Comece a usar o Archie gratuitamente hoje mesmo e transforme a sua forma de trabalhar.</p>
           <Link href="/login">
            <button className="cta-button text-white font-bold py-4 px-10 rounded-lg text-xl">
              Crie o seu Primeiro Projeto Agora
            </button>
          </Link>
        </section>
      </div>

      <footer className="bg-gray-900/50 border-t border-gray-800">
        <div className="container mx-auto px-6 py-8 text-center text-slate-400">
          <p>&copy; 2025 Archie AI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
