// "use client";

// import type { ReactNode } from "react";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { TaskProvider } from "../components/TaskProvider";

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <TaskProvider>
//           {children}
//         </TaskProvider>
//       </body>
//     </html>
//   );
// }
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "../components/TaskProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Auth provider for NextAuth */}
        <SessionProvider>
          {/* Your task provider */}
          <TaskProvider>
            {children}
          </TaskProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
