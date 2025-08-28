'use client';

import { TaskProvider } from "./TaskProvider";
import AuthProvider from "./providers/auth-provider";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </AuthProvider>
  );
}
