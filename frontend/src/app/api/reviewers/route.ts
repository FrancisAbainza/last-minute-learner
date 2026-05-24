import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.FLASK_API_URL ?? "http://localhost:5000"
const SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET ?? ""

export async function GET() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const res = await fetch(`${BACKEND_URL}/reviewers`, {
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-Service-Secret": SERVICE_SECRET,
    }
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });
  return NextResponse.json(data);
}