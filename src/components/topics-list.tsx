"use client"

import { Calendar, MoreVertical, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteReviewerById } from "@/app/dashboard/action"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Props = {
  topics: {
    id: string,
    title: string,
    description: string,
    createdAt: string,
  }[]
}

export default function TopicsList({ topics }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    await deleteReviewerById(id);
    toast.success("Topic successfully deleted.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Your Topics</h2>
        <span className="text-sm text-muted-foreground">{topics.length} topic{topics.length > 1 ? "s" : ""}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2 mb-1">{topic.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{topic.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(topic.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(topic.createdAt).toLocaleDateString()}
                </div>
                <Link href={`dashboard/topic/${topic.id}`}>
                  <Button size="sm" className="h-8">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Study
                  </Button>
                </Link>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
