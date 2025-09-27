// app/user/[username]/layout.tsx
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

interface UserLayoutProps {
  children: ReactNode;
  params: {
    username: string;
  };
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}

export const metadata = {
  title: "RoomieLoot - User Dashboard",
  description: "Split your finances, not your friendships",
};
