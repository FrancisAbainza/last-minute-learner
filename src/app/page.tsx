import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Zap, FileText, Upload, ArrowRight, FileUp, Type, Sparkles } from "lucide-react"
import Image from "next/image"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import Link from "next/link"
import { RedirectOnSignedIn } from "@/components/redirect-on-signed-in"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      <RedirectOnSignedIn to="/dashboard" />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Accelerate Your
                  <span className="text-primary"> Study Sessions</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                  Organize your learning, reduce stress, and boost productivity with our intelligent study companion.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="text-lg px-8">
                      Start Learning Today
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button size="lg" className="text-lg px-8">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                    Watch Demo
                  </Button>
                </SignedIn>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/images/hero.png"
                  alt="Student studying with organized materials and digital tools"
                  width={1000}
                  height={1000}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute inset-20 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">
              Turn Any Content Into <span className="text-primary">Study Materials</span>
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Upload PDFs or describe any topic, and our AI instantly creates personalized study tools tailored to your
              learning style.
            </p>
          </div>

          {/* Visual Flow Diagram */}
          <div className="max-w-6xl mx-auto">
            {/* Input Sources */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="relative">
                <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <FileUp className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Upload PDF Files</h3>
                    <p className="text-foreground/80">
                      Drag and drop textbooks, lecture notes, research papers, or any PDF document
                    </p>
                    <div className="flex justify-center gap-2 pt-2">
                      <div className="w-8 h-10 bg-red-500/20 rounded border border-red-500/30 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="w-8 h-10 bg-blue-500/20 rounded border border-blue-500/30 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="w-8 h-10 bg-green-500/20 rounded border border-green-500/30 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <Card className="border-2 border-dashed border-accent/30 hover:border-accent/60 transition-colors">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                      <Type className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold">Describe Any Topic</h3>
                    <p className="text-foreground/80">
                      Simply type what you want to study - from &quot;photosynthesis&quot; to &quot;calculus derivatives&quot;
                    </p>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm text-left font-mono">
                      <span className="text-muted-foreground">{">"}</span> Explain quantum mechanics basics...
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Arrow Down */}
            <div className="flex justify-center mb-12">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <ArrowRight className="h-8 w-8 text-muted-foreground rotate-90" />
                <span className="text-sm font-medium text-muted-foreground">AI Processing</span>
              </div>
            </div>

            {/* Output Results */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto border border-blue-500/20">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Smart Reviewers</h3>
                  <p className="text-muted-foreground text-sm">
                    Comprehensive study guides with detailed reviewer, terminologies, and essential facts.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-xs">
                    <div className="space-y-1">
                      <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-full"></div>
                      <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-3/4"></div>
                      <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center mx-auto border border-green-500/20">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Interactive Quizzes</h3>
                  <p className="text-muted-foreground text-sm">
                    Practice questions with multiple choice, true/false, and short answers
                  </p>
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-green-500"></div>
                      <div className="h-1 bg-green-200 dark:bg-green-800 rounded flex-1"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-green-300"></div>
                      <div className="h-1 bg-green-200 dark:bg-green-800 rounded flex-1"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mx-auto border border-purple-500/20">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Digital Flashcards</h3>
                  <p className="text-muted-foreground text-sm">
                    Spaced repetition flashcard decks for optimal memory retention
                  </p>
                  <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3">
                    <div className="w-full h-12 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-800 dark:to-purple-700 rounded border border-purple-300 dark:border-purple-600 flex items-center justify-center text-xs font-medium text-purple-900 dark:text-purple-100">
                      Flashcard Preview
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Process Steps */}
            <div className="mt-16 border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-semibold">How It Works</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border border-primary/30">
                      <span className="text-lg font-bold text-white">1</span>
                    </div>
                    <Upload className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold mb-2">Upload Content</h4>
                      <p className="text-muted-foreground text-sm">
                        Drop your PDFs or describe your topic in plain English
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center border border-accent/30">
                      <span className="text-lg font-bold text-white">2</span>
                    </div>
                    <Sparkles className="h-8 w-8 text-accent" />
                    <div>
                      <h4 className="font-semibold mb-2">AI Analysis</h4>
                      <p className="text-muted-foreground text-sm">
                        Our AI processes and understands your content instantly
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border border-primary/30">
                      <span className="text-lg font-bold text-white">3</span>
                    </div>
                    <Brain className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold mb-2">Study Materials</h4>
                      <p className="text-muted-foreground text-sm">
                        Get personalized quizzes, flashcards, and review guides
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Owl with a graduation hat"
                  width={50}
                  height={50}
                  className="w-12 h-12"
                  priority
                />
                <span className="ml-2 text-lg font-bold">LastMinuteLearner</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering students to achieve their academic goals through intelligent study tools and personalized
                learning experiences.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    AI Study Tools
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    PDF Converter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Flashcards
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Quizzes
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} LastMinuteLearner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
