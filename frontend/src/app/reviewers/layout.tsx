import { FloatingAIButton } from "@/components/floating-ai-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    {children}
    <FloatingAIButton />
    </>
  );
}