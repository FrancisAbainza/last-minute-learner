import z from "zod";

export const reviewerSchema = z.object({
  title: z.string().describe('An appropriate title for the study topic'),
  description: z.string().describe('A short description about the study topic'),
  field: z.string().describe('Field of study (e.g., Biology, Chemistry, Physics)'),
  reviewer: z.object({
    detailedReviewer: z.string().describe('A comprehensive study reviewer with clear section headers, bullet points, and highlighted terms'),
    terminologies: z
      .array(z.object({
        term: z.string().describe('The terminology term'),
        definition: z.string().describe('The definition of the term'),
      }))
      .describe('An array of key terms and definitions (10-30 items)'),
    essentialFacts: z.array(z.string()).describe('An array of important facts to remember (5-20 items)'),
  }).describe('An object containing the detailed reviewer, terminologies, and essential facts'),
  flashcards: z
    .array(z.object({
      front: z.string().describe('The question or prompt on the front of the flashcard'),
      back: z.string().describe('The answer or explanation on the back of the flashcard'),
    }))
    .describe('An array of flashcards for active recall practice (10-30 items)'),
  quiz: z
    .array(z.object({
      question: z.string().describe('The quiz question'),
      choices: z.array(z.string()).length(4).describe('Exactly 4 answer choices'),
      answer: z.string().describe('The correct answer, must match one of the choices exactly'),
    }))
    .describe('An array of quiz questions with 4 choices and 1 correct answer (10-20 items)'),
});

export type ReviewerOutput = z.infer<typeof reviewerSchema>;