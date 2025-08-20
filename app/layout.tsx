"use client";

import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "../components/taskProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
