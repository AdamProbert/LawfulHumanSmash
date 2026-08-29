import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import DesktopWarningBanner from "@/components/DesktopWarningBanner";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adam & Mady — July 10th, 2027",
  description:
    "You're invited to the wedding of Adam & Mady at Tall Johns House. July 10th, 2027.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌿</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={merriweather.variable}
    >
      <body className="bg-vine-pattern">
        <DesktopWarningBanner />
        {children}
      </body>
    </html>
  );
}
