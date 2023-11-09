import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talkative",
  description: "A Realtime chat application built using Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body>
        <Providers>
          {/* <div className="container max-w-7xl mx-auto h-full pt-12"> */}
            <Toaster richColors />
            {children}
          {/* </div> */}
        </Providers>
      </body>
    </html>
  );
}
