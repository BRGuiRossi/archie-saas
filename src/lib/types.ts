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
}
