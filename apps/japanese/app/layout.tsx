import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "一年到日语 N1 学习系统",
  description: "从五十音到 N1 的 12 个月日语学习计划，含讲解、练习题与答案。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
