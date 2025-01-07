import type { Metadata } from 'next'
import '../styles/cyberpunk.css'

export const metadata: Metadata = {
  title: 'AXION Chatbot',
  description: 'Cyberpunk-themed AI Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
