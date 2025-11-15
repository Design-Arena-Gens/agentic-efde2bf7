import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo List",
  description: "Stay organized with a simple and intuitive todo list."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
