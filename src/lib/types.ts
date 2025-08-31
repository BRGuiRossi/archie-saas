import type { ExtractTasksFromDocumentOutput } from '@/ai/flows/extract-tasks-from-document';

// This type is based on the Genkit flow output.
export type ExtractedTask = ExtractTasksFromDocumentOutput['tasks'][0];

// This type represents the structure your Python backend's Gemini prompt creates.
// Keeping it aligned ensures frontend-backend compatibility.
export interface Task {
    task_id: string;
    name: string;
    startDate: string;
    dueDate: string;
    timeEstimateHours: number;
    dependencies: string[];
    description: string;
    checklist: string[];
    tags: string[];
    // The ExtractedTask from the frontend flow might have subtasks,
    // which can be mapped to the checklist for the backend.
    subtasks?: { name: string; description: string }[];
}
