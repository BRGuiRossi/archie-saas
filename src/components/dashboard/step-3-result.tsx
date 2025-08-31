'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, PartyPopper, Calendar, ListTodo, Hash, XCircle, Loader2 } from 'lucide-react';
import type { Task } from '@/lib/types';
import { format } from "date-fns"

interface Step3ResultProps {
  onReset: () => void;
  projectConfig: { startDate?: Date; listId: string; } | null;
  tasks: Task[] | null;
  result: { status: string; message: string; };
}

export function Step3Result({ onReset, projectConfig, tasks, result }: Step3ResultProps) {
  
  const renderContent = () => {
    switch (result.status) {
      case 'success':
        return (
          <>
            <div className="flex justify-center mb-6">
              <PartyPopper className="h-24 w-24 text-accent animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-2">Project Generated Successfully!</h2>
            <p className="text-muted-foreground mb-8">{result.message}</p>
            <Card className="text-left">
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
                <CardDescription>Here are the details of the project you just created.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">Start Date:</span>
                      <span>{projectConfig?.startDate ? format(projectConfig.startDate, "PPP") : 'Not set'}</span>
                  </div>
                   <div className="flex items-center gap-4">
                      <Hash className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">ClickUp List ID:</span>
                      <span>{projectConfig?.listId}</span>
                  </div>
                   <div className="flex items-center gap-4">
                      <ListTodo className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">Tasks Created:</span>
                      <span>{tasks?.length || 0}</span>
                  </div>
              </CardContent>
            </Card>
          </>
        );
      case 'error':
        return (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="h-24 w-24 text-destructive" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-2">Generation Failed</h2>
            <p className="text-muted-foreground mb-8">{result.message}</p>
          </>
        );
      default:
         return (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 className="h-24 w-24 text-primary animate-spin" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-2">Generating Project...</h2>
            <p className="text-muted-foreground mb-8">Please wait while we create your project in ClickUp.</p>
          </>
        );
    }
  }

  return (
    <div className="text-center max-w-2xl mx-auto">
      {renderContent()}
      <Button onClick={onReset} className="mt-8 w-full max-w-xs">
        {result.status === 'success' ? 'Create Another Project' : 'Try Again'}
      </Button>
    </div>
  );
}
