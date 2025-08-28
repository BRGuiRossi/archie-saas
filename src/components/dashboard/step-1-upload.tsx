'use client';

import { useState } from 'react';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import { extractTasksFromDocument } from '@/ai/flows/extract-tasks-from-document';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Step1UploadProps {
  onDocParsed: (tasks: Task[]) => void;
}

export function Step1Upload({ onDocParsed }: Step1UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a .docx file.',
      });
      return;
    }
    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target?.result as string;
      try {
        const result = await extractTasksFromDocument({ documentDataUri: dataUri });
        if (result.tasks && result.tasks.length > 0) {
          toast({
            title: 'Success!',
            description: `Found ${result.tasks.length} tasks in your document.`,
          });
          onDocParsed(result.tasks);
        } else {
          toast({
            variant: 'destructive',
            title: 'No Tasks Found',
            description: 'The AI could not identify any tasks in your document. Please try another file.',
          });
          setFileName(null);
        }
      } catch (err) {
        console.error(err);
        toast({
          variant: 'destructive',
          title: 'Parsing Failed',
          description: 'An error occurred while parsing the document. Please try again.',
        });
        setFileName(null);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold font-headline mb-2">Upload Your Project Document</h2>
      <p className="text-muted-foreground mb-8">Drag and drop your .docx file to get started.</p>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-colors duration-200",
          isDragging ? "border-primary bg-accent/10" : "border-border hover:border-primary/50"
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".docx"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          disabled={isLoading}
        />
        {isLoading ? (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="font-semibold">Analyzing Document...</p>
            <p className="text-sm text-muted-foreground">{fileName}</p>
          </>
        ) : fileName ? (
          <>
            <FileText className="h-12 w-12 text-primary mb-4" />
            <p className="font-semibold">{fileName}</p>
             <label
              htmlFor="file-upload"
              className="mt-2 text-sm text-primary underline cursor-pointer"
            >
              Choose a different file
            </label>
          </>
        ) : (
          <>
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-semibold">Drag & drop your file here</p>
            <p className="text-sm text-muted-foreground mt-1">or</p>
            <label
              htmlFor="file-upload"
              className="mt-2 text-sm text-primary underline cursor-pointer"
            >
              browse files
            </label>
          </>
        )}
      </div>
    </div>
  );
}
