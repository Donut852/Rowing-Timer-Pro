'use server';
/**
 * @fileOverview Compares a team's rowing performance against world record times and generates a summary.
 *
 * - analyzePerformance - A function that handles the performance analysis process.
 * - AnalyzePerformanceInput - The input type for the analyzePerformance function.
 * - AnalyzePerformanceOutput - The return type for the analyzePerformance function.
 */

import {ai} from '@/ai/ai-instance';
import {getWorldBestTime} from '@/services/world-rowing';
import {z} from 'genkit';

const AnalyzePerformanceInputSchema = z.object({
  boatClass: z.string().describe('The boat class (e.g., M1x, W2-).'),
  totalTimeInSeconds: z.number().describe('The total time for the session in seconds.'),
});
export type AnalyzePerformanceInput = z.infer<typeof AnalyzePerformanceInputSchema>;

const AnalyzePerformanceOutputSchema = z.object({
  summary: z.string().describe('A summary comparing the team\'s performance to the world record time, including the percentage difference.'),
});
export type AnalyzePerformanceOutput = z.infer<typeof AnalyzePerformanceOutputSchema>;

export async function analyzePerformance(input: AnalyzePerformanceInput): Promise<AnalyzePerformanceOutput> {
  return analyzePerformanceFlow(input);
}

const analyzePerformancePrompt = ai.definePrompt({
  name: 'analyzePerformancePrompt',
  input: {
    schema: z.object({
      boatClass: z.string().describe('The boat class (e.g., M1x, W2-).'),
      totalTimeInSeconds: z.number().describe('The total time for the session in seconds.'),
      worldBestTimeInSeconds: z.number().describe('The world best time for the boat class in seconds.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary comparing the team\'s performance to the world record time, including the percentage difference.'),
    }),
  },
  prompt: `You are an experienced rowing coach providing insights on team performance.

Analyze the team's performance compared to the world record time for the specified boat class.

Boat Class: {{{boatClass}}}
Team's Total Time (seconds): {{{totalTimeInSeconds}}}
World Best Time (seconds): {{{worldBestTimeInSeconds}}}

Calculate the percentage difference between the team's time and the world record time.
Provide a concise summary of the team's performance, including the percentage difference from the world record.
`,
});

const analyzePerformanceFlow = ai.defineFlow<
  typeof AnalyzePerformanceInputSchema,
  typeof AnalyzePerformanceOutputSchema
>(
  {
    name: 'analyzePerformanceFlow',
    inputSchema: AnalyzePerformanceInputSchema,
    outputSchema: AnalyzePerformanceOutputSchema,
  },
  async input => {
    const worldBestTime = await getWorldBestTime(input.boatClass);
    const {output} = await analyzePerformancePrompt({
      ...input,
      worldBestTimeInSeconds: worldBestTime.timeInSeconds,
    });
    return output!;
  }
);
