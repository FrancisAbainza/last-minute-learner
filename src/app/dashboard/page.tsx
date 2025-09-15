import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ChatUpload } from "@/components/chat-upload"
import { TopicsList } from "@/components/topics-list"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Upload PDFs and manage your study topics</p>
        </div>

        {/* Chat Upload Component */}
        <ChatUpload />

        {/* Topics List Component */}
        <TopicsList />
      </div>
    </div>
  )
}
