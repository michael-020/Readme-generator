import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: 'GitHub README Generator - AI-Powered Documentation',
  description: 'Generate professional README files for your GitHub repositories using advanced AI technology. Create comprehensive documentation in seconds.',
  generator: 'Next.js',
  keywords: ['GitHub', 'README', 'AI', 'Documentation', 'Generator', 'Markdown']
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .animate-shimmer {
            animation: shimmer 2s infinite;
          }

          * {
            scroll-behavior: smooth;
          }

          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgb(245 245 245);
          }

          ::-webkit-scrollbar-thumb {
            background: rgb(163 163 163);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgb(115 115 115);
          }

          @media (prefers-color-scheme: dark) {
            ::-webkit-scrollbar-track {
              background: rgb(23 23 23);
            }

            ::-webkit-scrollbar-thumb {
              background: rgb(64 64 64);
            }

            ::-webkit-scrollbar-thumb:hover {
              background: rgb(115 115 115);
            }
          }
        `}</style>
      </head>
      <body className="antialiased font-sans bg-neutral-950 text-white">
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </body>
    </html>
  )
}
