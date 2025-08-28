// extract-tasks-from-document.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow to extract tasks, subtasks, and dependencies from a .docx document.
 *
 * - extractTasksFromDocument - A function that extracts tasks from a document.
 * - ExtractTasksFromDocumentInput - The input type for the extractTasksFromDocument function.
 * - ExtractTasksFromDocumentOutput - The return type for the extractTasksFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import mammoth from 'mammoth';

const ExtractTasksFromDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A .docx document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTasksFromDocumentInput = z.infer<typeof ExtractTasksFromDocumentInputSchema>;

const ExtractTasksFromDocumentOutputSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string().describe('The name of the task.'),
      description: z.string().describe('A detailed description of the task.'),
      subtasks: z.array(
        z.object({
          name: z.string().describe('The name of the subtask.'),
          description: z.string().describe('A detailed description of the subtask.'),
        })
      ).optional(),
      dependencies: z.array(z.string()).optional().describe('List of task names that this task depends on'),
    })
  ).describe('A list of tasks extracted from the document, with subtasks and dependencies.'),
});
export type ExtractTasksFromDocumentOutput = z.infer<typeof ExtractTasksFromDocumentOutputSchema>;

export async function extractTasksFromDocument(input: ExtractTasksFromDocumentInput): Promise<ExtractTasksFromDocumentOutput> {
  return extractTasksFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTasksFromDocumentPrompt',
  input: {schema: ExtractTasksFromDocumentInputSchema},
  output: {schema: ExtractTasksFromDocumentOutputSchema},
  prompt: `You are an expert project manager tasked with extracting tasks, subtasks, and dependencies from a document. The document will be passed to you as text.

Analyze the document and identify key project tasks, subtasks, and any dependencies between them. Return a JSON array of tasks. Each task should have a name, a description, an optional array of subtasks (each with a name and description), and an optional array of dependencies (which are the names of other tasks in the document).

Here is the document:

{{docxText}}`,
});

const extractTasksFromDocumentFlow = ai.defineFlow(
  {
    name: 'extractTasksFromDocumentFlow',
    inputSchema: ExtractTasksFromDocumentInputSchema,
    outputSchema: ExtractTasksFromDocumentOutputSchema,
  },
  async input => {
    // Convert the data URI to a buffer
    const base64Data = input.documentDataUri.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Use mammoth to extract the text from the DOCX file
    const result = await mammoth.extractRawText({
      buffer: buffer,
    });

    const docxText = result.value;

    const {output} = await prompt({
      ...input,
      docxText,
    });
    return output!;
  }
);
