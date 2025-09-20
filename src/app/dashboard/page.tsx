import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ChatUpload } from "@/components/chat-upload"
import TopicsList from "@/components/topics-list"
import { getStudyReviewers } from "./action"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  const reviewers = await getStudyReviewers(userId);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Upload PDFs and manage your study topics</p>
        </div>

        {/* Chat Upload Component */}
        <ChatUpload />

        {/* Topics List Component */}
        <TopicsList topics={reviewers.map(reviewer => ({
          id: reviewer.id,
          title: reviewer.title,
          description: reviewer.description,
          createdAt: reviewer.createdAt.toLocaleDateString('en-US') ,
        }))} />
      </div>
    </div>
  )
}
