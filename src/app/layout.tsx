import "./globals.css";
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Todo Admin Panel",
  description: "Admin page for managing todos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ❗️Pindahkan semua komponen Client ke dalam <body> */}
      <body suppressHydrationWarning={true}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
