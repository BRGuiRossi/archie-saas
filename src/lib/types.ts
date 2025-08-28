import type { ExtractTasksFromDocumentOutput } from '@/ai/flows/extract-tasks-from-document';

export type Task = ExtractTasksFromDocumentOutput['tasks'][0];
