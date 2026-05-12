/**
 * utils/extractText.ts
 *
 * Client-side text extraction for .pdf, .docx, and .pptx files.
 * Safe for Next.js — pdfjs-dist is lazy-imported inside the function
 * body so it never runs during SSR.
 *
 * Dependencies:
 *   npm install pdfjs-dist jszip mammoth
 */

import mammoth from "mammoth";
import JSZip from "jszip";

// ─── Public API ──────────────────────────────────────────────────────────────

export async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return extractFromPdf(file);
  if (ext === "docx") return extractFromDocx(file);
  if (ext === "pptx") return extractFromPptx(file);
  throw new Error(`Unsupported file type: .${ext}`);
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

async function extractFromPdf(file: File): Promise<string> {
  // Dynamic import keeps pdfjs-dist out of the SSR bundle entirely.
  // It will only be evaluated in the browser, where DOMMatrix exists.
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/ {2,}/g, " ")
      .trim();

    if (pageText) pageTexts.push(pageText);
  }

  return pageTexts.join("\n");
}

// ─── DOCX ────────────────────────────────────────────────────────────────────

async function extractFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// ─── PPTX ────────────────────────────────────────────────────────────────────

async function extractFromPptx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const n = (s: string) => parseInt(s.match(/\d+/)![0], 10);
      return n(a) - n(b);
    });

  const slideTexts = await Promise.all(
    slideFiles.map(async (name) => {
      const xml = await zip.files[name].async("string");

      const matches = [...xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)];

      return matches
        .map((m) =>
          m[1]
            .replace(/<[^>]+>/g, "")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .trim()
        )
        .filter(Boolean)
        .join(" ")
        .replace(/ {2,}/g, " ")
        .trim();
    })
  );

  return slideTexts
    .map((text, i) => `[Slide ${i + 1}]\n${text}`)
    .filter((s) => !s.endsWith("\n"))
    .join("\n\n");
}
