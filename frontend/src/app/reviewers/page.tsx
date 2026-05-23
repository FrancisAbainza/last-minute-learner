import { ChatUpload } from "@/components/chat-upload"

export default function ReviewersPage() {
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

      </div>
    </div>
  )
}
