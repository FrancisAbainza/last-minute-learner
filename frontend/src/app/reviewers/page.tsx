import ReviewersList from "@/components/reviewers-list"

export default function ReviewersPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8 space-y-10">
        <ReviewersList />
      </div>
    </div>
  )
}
