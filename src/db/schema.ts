import { pgTable, text, json, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const studyReviewers = pgTable('study_reviewers', {
  id: uuid('id').primaryKey().defaultRandom(),      // ✅ auto-generated UUID
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  field: varchar('field', { length: 255 }).notNull(),
  detailedReviewer: text('detailed_reviewer').notNull(),
  terminologies: json('terminologies').notNull(),
  essentialFacts: json('essential_facts').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});