// FileUploader.tsx
"use client";
import { extractText } from "@/lib/text-extractor";

export default function FileUploader() {
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await extractText(file);       // client-side extraction
    console.log(text) // send lean text to server
  }

  return (
    <input
      type="file"
      accept=".pdf,.docx,.pptx"
      onChange={handleChange}
    />
  );
}