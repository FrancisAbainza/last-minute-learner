"use server";
import { gateway, generateText, Output, NoObjectGeneratedError } from 'ai';
import { ReviewerOutput, reviewerSchema } from '@/schemas/reviewer-schema';

const model = gateway('gpt-4o-mini');

const REVIEWER_PROMPT =
  `You are a helpful study reviewer generator. ` +
  `Based on the content provided, produce:\n` +
  `1. Title: An appropriate title for the topic\n` +
  `2. Description: A short description about the topic\n` +
  `3. Field: Field of study (e.g., Biology, Chemistry, etc.)\n` +
  `4. Reviewer: An object containing:\n` +
  `   - Detailed Reviewer: A comprehensive study reviewer based on the content. ` +
  `Use clean, readable formatting with clear section headers, ` +
  `bullet points for lists, important terms highlighted, ` +
  `and natural organization that flows well. ` +
  `Make it comprehensive enough to serve as a complete study guide that students would actually want to use.\n` +
  `   - Terminologies: An array of objects (term & definition, at least 10, max 30)\n` +
  `   - Essential Facts: An array of strings (at least 5, max 20)\n` +
  `5. Flashcards: An array of objects (front & back, at least 10, max 30). ` +
  `The front should contain a question or prompt, and the back should contain the answer or explanation. ` +
  `Focus on key concepts, definitions, and important facts from the content.\n` +
  `6. Quiz: An array of quiz questions (at least 10, max 20). Each question must have exactly 4 choices and 1 correct answer. ` +
  `The correct answer must match one of the 4 choices exactly. ` +
  `Cover a range of difficulty levels and topics from the content.`;

export const generateReviewer = async (content: string): Promise<ReviewerOutput> => {
  try {
    const { output } = await generateText({
      model,
      output: Output.object({ schema: reviewerSchema }),
      messages: [
        { role: 'system', content: REVIEWER_PROMPT },
        { role: 'user', content },
      ],
    });

    return output;
  } catch (err) {
    if (NoObjectGeneratedError.isInstance(err)) {
      console.error('Failed to generate structured output:', err.text);
      throw new Error('Could not generate a valid reviewer from the provided content.');
    }
    throw err;
  }
};