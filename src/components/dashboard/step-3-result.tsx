'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, PartyPopper, Calendar, ListTodo, Hash } from 'lucide-react';
import type { Task } from '@/lib/types';
import { format } from "date-fns"

interface Step3ResultProps {
  onReset: () => void;
  projectConfig: { startDate?: Date; listId: string; } | null;
  tasks: Task[] | null;
}

export function Step3Result({ onReset, projectConfig, tasks }: Step3ResultProps) {
  return (
    <div className="text-center max-w-2xl mx-auto">
       <div className="flex justify-center mb-6">
        <PartyPopper className="h-24 w-24 text-accent animate-bounce" />
       </div>
      <h2 className="text-3xl font-bold font-headline mb-2">Project Generated Successfully!</h2>
      <p className="text-muted-foreground mb-8">Your tasks have been mapped and are ready in ClickUp.</p>
      
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
      
      <Button onClick={onReset} className="mt-8 w-full max-w-xs">
        Create Another Project
      </Button>
    </div>
  );
}
