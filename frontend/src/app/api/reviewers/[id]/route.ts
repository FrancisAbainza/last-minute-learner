import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000"
const SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET ?? ""

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/")

  const res = await fetch(`${BACKEND_URL}/reviewers/${params.id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-Service-Secret": SERVICE_SECRET,
    }
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect("/")

  const res = await fetch(`${BACKEND_URL}/reviewers/${params.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-Service-Secret": SERVICE_SECRET,
    }
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status })
  return NextResponse.json(data)
}