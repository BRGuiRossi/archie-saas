import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
<nav aria-label="Progress">
  <ol role="list" className="flex items-center">
    {steps.map((step, stepIdx) => (
      <li key={step} className={cn('relative', { 'pr-32 sm:pr-32': stepIdx !== steps.length - 1 })}>
        {stepIdx < currentStep ? (
          // Completed Step
          <>
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="h-0.5 w-full bg-primary" />
            </div>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            {/* FIX: Aligned the label to the center of the w-8 icon */}
            <div className="absolute top-10 left-4 -translate-x-1/2 w-max text-center">
              <span className="text-sm font-medium text-primary">{step}</span>
            </div>
          </>
        ) : stepIdx === currentStep ? (
          // Current Step
          <>
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="h-0.5 w-full bg-border" />
            </div>
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background"
              aria-current="step"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
            </div>
            {/* FIX: Aligned the label to the center of the w-8 icon */}
            <div className="absolute top-10 left-4 -translate-x-1/2 w-max text-center">
              <span className="text-sm font-medium text-primary">{step}</span>
            </div>
          </>
        ) : (
          // Upcoming Step
          <>
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="h-0.5 w-full bg-border" />
            </div>
            <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background">
              <span
                className="h-2.5 w-2.5 rounded-full bg-transparent"
                aria-hidden="true"
              />
            </div>
            {/* FIX: Aligned the label to the center of the w-8 icon */}
            <div className="absolute top-10 left-4 -translate-x-1/2 w-max text-center">
              <span className="text-sm font-medium text-muted-foreground">{step}</span>
            </div>
          </>
        )}
      </li>
    ))}
  </ol>
</nav>
  );
}
