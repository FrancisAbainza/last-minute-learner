/* 'use server';

import { z } from 'zod';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';

const reviewerSchema = z
  .object({
    prompt: z.string().optional(),
    file: z
      .instanceof(File)
      .refine((file) => file.type === 'application/pdf', {
        message: 'Only PDF files are allowed',
      })
      .optional(),
  })
  .refine((data) => data.prompt || data.file, {
    message: 'Either prompt or file must be provided',
  });

export async function generateStudyReviewer(input: unknown) {
  const { prompt, file } = reviewerSchema.parse(input);

  // Extract text from PDF if provided
  let pdfText = '';
  if (file) {
    const { default: pdf } = await import('pdf-parse');
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);
    pdfText = data.text;
  }

  const content = [prompt, pdfText].filter(Boolean).join('\n\n');

  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      field: z.string(),
      detailedReviewer: z.string(),
      terminologies: z
        .array(z.object({ term: z.string(), definition: z.string() }))
        .min(10)
        .max(30),
      essentialFacts: z.array(z.string()).min(5).max(20),
    }),
    prompt: `You are a helpful study reviewer generator. Based on the content below, produce:
1. Title: An appropriate title for the topic
2. Description: A short description about the topic
3. Field: Field of study (e.g., Biology, Chemistry, etc.)
4. Detailed Reviewer: A comprehensive study reviewer based on the content. Use clean, readable formatting with:
   - Clear section headers
   - Bullet points for lists
   - Important terms highlighted
   - Natural organization that flows well
   Make it comprehensive enough to serve as a complete study guide that students would actually want to use.
5. Terminologies: An array of objects (term & definition, at least 10, max 30)
6. Essential Facts: An array of strings (at least 5, max 20)

Content: ${content}`,
  });

  return result.object;
}
 */