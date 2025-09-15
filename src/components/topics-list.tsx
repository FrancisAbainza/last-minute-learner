"use client"

import { Calendar, MoreVertical, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock topic data
const mockTopics = [
  {
    id: 1,
    title: "Advanced Calculus Notes",
    description: "Comprehensive study materials covering derivatives, integrals, and limits",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Biology Chapter 12",
    description: "Cell division, mitosis, and meiosis study guide",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    title: "History Essay Review",
    description: "World War II causes and consequences analysis",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    title: "Physics Formulas",
    description: "Essential formulas for mechanics and thermodynamics",
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    title: "Chemistry Lab Report",
    description: "Organic chemistry reactions and mechanisms",
    createdAt: "2024-01-11",
  },
  {
    id: 6,
    title: "Literature Analysis",
    description: "Shakespeare's Hamlet character development study",
    createdAt: "2024-01-10",
  },
]

export function TopicsList() {
  const handleDelete = (id: number) => {
    // Handle delete logic here
    console.log("Delete topic:", id)
  }

  const handleStudy = (id: number) => {
    // Handle study logic here
    console.log("Study topic:", id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Your Topics</h2>
        <span className="text-sm text-muted-foreground">{mockTopics.length} topics</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTopics.map((topic) => (
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
                <Button size="sm" onClick={() => handleStudy(topic.id)} className="h-8">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Study
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
