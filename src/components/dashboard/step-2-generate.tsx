
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { CheckCircle, PartyPopper, XCircle, Calendar, ListTodo, Hash } from 'lucide-react';
import axios from 'axios';
import { format } from "date-fns";
import { LoadingProgress } from './loading-progress';
import Image from 'next/image';

const formSchema = z.object({
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  listId: z.string().min(1, "ClickUp List ID is required."),
});
type ProjectConfig = z.infer<typeof formSchema>;

interface Step2GenerateProps {
  documentText: string;
  fileSize: number; // in bytes
  user: User;
  backendUrl: string;
  onReset: () => void;
}

type ResultState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  taskCount?: number;
}

export function Step2Generate({ documentText, fileSize, user, backendUrl, onReset }: Step2GenerateProps) {
  const [result, setResult] = useState<ResultState>({ status: 'idle', message: '' });
  const [projectConfig, setProjectConfig] = useState<ProjectConfig | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listId: '',
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (result.status === 'loading') {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Project generation is in progress.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [result.status]);


  const onSubmit = async (config: ProjectConfig) => {
    if (!user) {
      setResult({ status: 'error', message: 'User not authenticated. Please log in again.' });
      return;
    }
    
    setProjectConfig(config);
    setResult({ status: 'loading', message: 'Generating project...' });

    try {
      const idToken = await user.getIdToken(true);
      
      const response = await axios.post(
          `${backendUrl}/generateProject`,
          {
              documentText: documentText,
              startDate: config.startDate?.toISOString().split('T')[0], // Format as YYYY-MM-DD
              listId: config.listId,
          },
          {
              headers: {
                  Authorization: `Bearer ${idToken}`,
              },
              withCredentials: true,
          }
      );

      if (response.data.status === 'success') {
          const message = response.data.message || "Project generated successfully.";
          const taskCount = parseInt(message.match(/\d+/)?.[0] || '0', 10);
          setResult({ status: 'success', message, taskCount });
      } else {
          setResult({ status: 'error', message: response.data.error || "An unknown error occurred." });
      }

    } catch (error: any) {
        console.error("Generation failed:", error);
        const errorMessage = error.response?.data?.error || error.message || "An unknown error occurred.";
        setResult({ status: 'error', message: errorMessage });
    }
  };
  
  if (result.status === 'loading') {
    return <LoadingProgress fileSize={fileSize} />;
  }

  if (result.status === 'success') {
    return (
      <div className="text-center max-w-2xl mx-auto">
        <PartyPopper className="h-24 w-24 text-accent animate-bounce mx-auto mb-6" />
        <h2 className="text-3xl font-bold font-headline mb-2">Project Generated Successfully!</h2>
        <p className="text-muted-foreground mb-8">{result.message}</p>
        <Card className="text-left">
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
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
                  <span>{result.taskCount || 0}</span>
              </div>
          </CardContent>
        </Card>
        <a href="https://clickup.com/" target="_blank" rel="noopener noreferrer" className="inline-block mt-6">
            <Image src="/clickup-logo.svg" alt="ClickUp Logo" width={120} height={40} />
        </a>
        <Button onClick={onReset} className="mt-4 w-full max-w-xs">
          Create Another Project
        </Button>
      </div>
    );
  }

  if (result.status === 'error') {
     return (
      <div className="text-center max-w-2xl mx-auto">
        <XCircle className="h-24 w-24 text-destructive mx-auto mb-6" />
        <h2 className="text-3xl font-bold font-headline mb-2">Generation Failed</h2>
        <p className="text-muted-foreground mb-8">{result.message}</p>
        <Button onClick={() => setResult({ status: 'idle', message: '' })} className="mt-8 w-full max-w-xs">
          Try Again
        </Button>
      </div>
    );
  }

  return (
      <div>
        <h2 className="text-2xl font-bold font-headline mb-2 text-center">Configure Your Project</h2>
        <p className="text-muted-foreground mb-6 text-center">Set up your ClickUp integration and project details.</p>
        
        <Card className="max-w-md mx-auto">
          <CardHeader>
             <CardTitle className="text-lg font-headline">Project Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                   <Button type="button" variant='secondary' className="w-full cursor-default">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      ClickUp Connected
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Project Start Date</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} className="w-full"/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="listId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ClickUp List ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 901801234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={onReset} className="w-full">Back</Button>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Generate Project</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
  );
}
