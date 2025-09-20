
import { notFound, redirect } from "next/navigation";
import { getReviewerById } from "./action";
import TopicClient from "@/components/topic-client";
import { auth } from "@clerk/nextjs/server";
import { InferSelectModel } from "drizzle-orm";
import { studyReviewers } from "@/db/schema";


export default async function Topic({ params }: { params: Promise<{ topicId: string }> }) {
  const { userId } = await auth()
  const paramsValue = await params;
  const topic = await getReviewerById(paramsValue?.topicId) as InferSelectModel<typeof studyReviewers>;

  if (!userId) {
    redirect("/");
  }

  if (userId !== topic.userId) {
    return (
      <div>You do not own this topic. Nice Try ඞ.</div>
    );
  }

  if (!topic) {
    notFound();
  }

  return <TopicClient topic={{
    title: topic.title,
    description: topic.description,
    field: topic.field,
    detailedReviewer: topic.detailedReviewer,
    terminologies: topic.terminologies as { term: string; definition: string }[],
    essentialFacts: topic.essentialFacts as string[],
  }} />;
}