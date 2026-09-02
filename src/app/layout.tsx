import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { DM_Mono, Rubik } from "next/font/google";
import { Toaster } from "sonner";
import "../styles/globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Pomodoro",
    default: "Aplikasi Manajemen Waktu",
  },
  description: "Aplikasi Manajemen Waktu",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", rubik.variable, dmMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
