// app/user/[username]/layout.js
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function UserLayout({ children, params }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-900`}>
        <main>{children}</main>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Budget Battle Royale - User Dashboard',
  description: 'Compete with friends and master your budget',
}