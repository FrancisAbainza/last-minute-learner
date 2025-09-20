"use server";
import { db } from '@/db/db';
import { studyReviewers } from '@/db/schema';
import { desc, eq, InferInsertModel } from 'drizzle-orm';

export async function insertReviewer(data: InferInsertModel<typeof studyReviewers>) {
  await db.insert(studyReviewers).values(data);
}

export async function getStudyReviewers(userId: string) {
  const reviewers = await db
    .select()
    .from(studyReviewers)
    .where(eq(studyReviewers.userId, userId))
    .orderBy(desc(studyReviewers.createdAt));

  return reviewers
}

export async function deleteReviewerById(id: string) {
  await db
    .delete(studyReviewers)
    .where(eq(studyReviewers.id, id));
}