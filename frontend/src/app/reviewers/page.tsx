import { ChatUpload } from "@/components/chat-upload"
import ReviewersList from "@/components/reviewers-list"

export default function ReviewersPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8 lg:px-8 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Upload PDFs and manage your reviewers</p>
        </div>

        {/* Chat Upload Component */}
        <ChatUpload />

        <ReviewersList />
      </div>
    </div>
  )
}
