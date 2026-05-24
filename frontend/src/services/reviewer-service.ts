"use server";

import { ReviewerData } from "@/schemas/reviewer-schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";
const SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET ?? "";

export async function fetchReviewers(): Promise<ReviewerData[]> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const serviceHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-User-Id": userId,
    "X-Service-Secret": SERVICE_SECRET,
  };

  const res = await fetch(`${BACKEND_URL}/reviewers`, { headers: serviceHeaders });
  if (!res.ok) return [];
  return res.json();
}