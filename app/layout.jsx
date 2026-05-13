import "./globals.css";
import { Toaster } from "sonner";
import SessionWrapper from "@/components/ui/SessionWrapper";


export const metadata = {
  title: "AI Recruiter",
  description:
    "AI-driven interview manager that simplifies scheduling, evaluation, and candidate tracking.",
  icons: {
    icon: "/logo.png", // your logo in /public
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en"   suppressHydrationWarning >
      <body className="antialiased" suppressHydrationWarning >
        <SessionWrapper>
          {children}
          <Toaster />
        </SessionWrapper>
      </body>
    </html>
  );
}
