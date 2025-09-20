'use server'

import { db } from '@/db/db'
import { studyReviewers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getReviewerById(id: string) {
  const reviewer = await db
    .select()
    .from(studyReviewers)
    .where(eq(studyReviewers.id, id))
    .limit(1)

  // drizzle returns an array, so pick the first item
  return reviewer[0] ?? null
}