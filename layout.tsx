import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المؤرخ الذكي | من حفظ الأحداث إلى تفسيرها",
  description: "منصة لتدريب التفكير التاريخي السببي",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}