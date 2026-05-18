import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NETIFY Admin",
  description: "Admin panel for NETIFY",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <AdminLayoutWrapper>
            {children}
          </AdminLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
