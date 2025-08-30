'use server';

/**
 * @fileOverview A Genkit flow to create tasks in ClickUp.
 *
 * - createTasksInClickUp - A function that creates tasks in a ClickUp list.
 * - CreateTasksInClickUpInput - The input type for the createTasksInClickUp function.
 * - CreateTasksInClickUpOutput - The return type for the createTasksInClickUp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Task } from '@/lib/types';

const CreateTasksInClickUpInputSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      subtasks: z.array(z.object({ name: z.string(), description: z.string() })).optional(),
      dependencies: z.array(z.string()).optional(),
    })
  ),
  clickupAccessToken: z.string().optional(), // Make optional as we fetch it on the server
  listId: z.string(),
  startDate: z.date().optional(),
  userId: z.string(),
});
export type CreateTasksInClickUpInput = z.infer<typeof CreateTasksInClickUpInputSchema>;

const CreateTasksInClickUpOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  taskIds: z.array(z.string()).optional(),
});
export type CreateTasksInClickUpOutput = z.infer<typeof CreateTasksInClickUpOutputSchema>;


export async function createTasksInClickUp(input: CreateTasksInClickUpInput): Promise<CreateTasksInClickUpOutput> {
  return createTasksInClickUpFlow(input);
}


const createTasksInClickUpFlow = ai.defineFlow(
  {
    name: 'createTasksInClickUpFlow',
    inputSchema: CreateTasksInClickUpInputSchema,
    outputSchema: CreateTasksInClickUpOutputSchema,
  },
  async (input) => {
    try {
      // 1. Get the user's ClickUp access token from Firestore
      const userDocRef = doc(db, 'users', input.userId);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists() || !userDocSnap.data().clickupAccessToken) {
        return { success: false, error: 'ClickUp access token not found.' };
      }
      const accessToken = userDocSnap.data().clickupAccessToken;

      const createdTaskIds: { [key: string]: string } = {};
      const createdTasksData: string[] = [];

      // 2. Get Team ID
      const teamResponse = await axios.get('https://api.clickup.com/api/v2/team', {
        headers: { Authorization: accessToken },
      });
      const teamId = teamResponse.data.teams[0].id;


      // 3. Create tasks in ClickUp without dependencies first
      for (const task of input.tasks) {
        const response = await axios.post(
          `https://api.clickup.com/api/v2/list/${input.listId}/task`,
          {
            name: task.name,
            description: task.description,
            // Add other fields like start_date if available
            start_date: input.startDate ? input.startDate.getTime() : undefined,
          },
          {
            headers: {
              Authorization: accessToken,
              'Content-Type': 'application/json',
            },
          }
        );
        const newTaskId = response.data.id;
        createdTaskIds[task.name] = newTaskId;
        createdTasksData.push(newTaskId)

        // Create subtasks if they exist
        if (task.subtasks) {
            for (const subtask of task.subtasks) {
                 await axios.post(
                    `https://api.clickup.com/api/v2/list/${input.listId}/task`,
                    {
                        name: subtask.name,
                        description: subtask.description,
                        parent: newTaskId,
                    },
                    {
                        headers: {
                            Authorization: accessToken,
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }
        }
      }

      // 4. Add dependencies now that all tasks have IDs
       for (const task of input.tasks) {
           if (task.dependencies && task.dependencies.length > 0) {
               const taskId = createdTaskIds[task.name];
               for (const depName of task.dependencies) {
                   const dependsOnId = createdTaskIds[depName];
                   if (taskId && dependsOnId) {
                       await axios.post(
                           `https://api.clickup.com/api/v2/task/${taskId}/dependency`,
                           {
                               depends_on: dependsOnId,
                           },
                           {
                               headers: {
                                   Authorization: accessToken,
                                   'Content-Type': 'application/json',
                               },
                           }
                       );
                   }
               }
           }
       }

      return { success: true, message: 'Tasks created successfully.', taskIds: createdTasksData };
    } catch (error: any) {
      console.error('Error creating tasks in ClickUp:', error.response?.data || error.message);
      return { success: false, error: 'Failed to create tasks in ClickUp.' };
    }
  }
);
