'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { CheckCircle, Link2, GitMerge } from 'lucide-react';
import { Label } from '../ui/label';

interface Step2ConfigureProps {
  tasks: Task[];
  onConfigured: (data: z.infer<typeof formSchema>) => void;
  onReset: () => void;
}

const formSchema = z.object({
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  listId: z.string().min(1, "ClickUp List ID is required."),
  apiKey: z.string().optional(),
});

export function Step2Configure({ tasks, onConfigured, onReset }: Step2ConfigureProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listId: '',
      apiKey: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onConfigured(data);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h2 className="text-2xl font-bold font-headline mb-2">Configure Your Project</h2>
        <p className="text-muted-foreground mb-6">Set up your ClickUp integration and project details.</p>
        
        <Card>
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
      <div>
        <h2 className="text-2xl font-bold font-headline mb-2">Extracted Tasks</h2>
        <p className="text-muted-foreground mb-6">Review the tasks AI has identified from your document.</p>
        <Accordion type="single" collapsible className="w-full max-h-[60vh] overflow-y-auto pr-4">
          {tasks.map((task, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="font-semibold text-left">{task.name}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-4">{task.description}</p>
                {task.subtasks && task.subtasks.length > 0 && (
                   <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Subtasks:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {task.subtasks.map((sub, i) => <li key={i}>{sub.name}</li>)}
                    </ul>
                   </div>
                )}
                {task.dependencies && task.dependencies.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><GitMerge size={16}/> Dependencies:</h4>
                     <div className="flex flex-wrap gap-2">
                       {task.dependencies.map((dep, i) => <Badge variant="secondary" key={i}>{dep}</Badge>)}
                     </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
