'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';

interface LoadingProgressProps {
  fileSize: number; // in bytes
}

const steps = [
  { progress: 3, label: 'Carregando documento' },
  { progress: 15, label: 'Analisando documento' },
  { progress: 22, label: 'Criando tarefas' },
  { progress: 35, label: 'Criando checklists' },
  { progress: 40, label: 'Criando tags' },
  { progress: 55, label: 'Estimando o tempo das atividades' },
  { progress: 75, label: 'Analisando relações de dependencias e bloqueios' },
  { progress: 100, label: 'Criando relações' },
];

export function LoadingProgress({ fileSize }: LoadingProgressProps) {
  const [progress, setProgress] = useState(0);
  
  // Rule of three: 6MB (6 * 1024 * 1024 bytes) = 120 seconds
  const estimatedTimeInSeconds = (fileSize / (6 * 1024 * 1024)) * 120;
  const totalDuration = Math.max(estimatedTimeInSeconds, 5) * 1000; // Minimum 5 seconds
  const [timeLeft, setTimeLeft] = useState(Math.ceil(totalDuration / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    const timerInterval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
        clearInterval(interval);
        clearInterval(timerInterval)
    };
  }, [totalDuration]);

  const currentStepLabel = steps.find(step => progress <= step.progress)?.label || 'Finalizando...';
  
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold font-headline mb-4">Gerando o seu Projeto...</h2>
      <p className="text-muted-foreground mb-8">
        Isto pode demorar um pouco. Sinta-se à vontade para pegar um café enquanto a nossa IA faz a sua magia.
      </p>

      <div className="w-full bg-secondary rounded-full h-4 mb-4 overflow-hidden border border-border">
        <motion.div
          className="bg-primary h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <div className="flex justify-between items-center mb-10">
        <p className="text-sm font-semibold text-primary">{currentStepLabel}</p>
        <p className="text-sm text-muted-foreground font-mono">Tempo estimado: ~{timeLeft}s</p>
      </div>

      <div className="space-y-3 text-left">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 text-muted-foreground"
            initial={{ opacity: 0.5, y: 10 }}
            animate={{ opacity: progress >= step.progress ? 1 : 0.5, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <AnimatePresence>
                {progress >= step.progress ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <CheckCircle className="text-green-500" />
                  </motion.div>
                ) : (
                  <Loader className="animate-spin text-primary" />
                )}
              </AnimatePresence>
            </div>
            <span className={progress >= step.progress ? 'text-foreground' : ''}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
