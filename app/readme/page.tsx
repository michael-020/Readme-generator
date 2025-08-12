import { ReadmeDisplay } from "@/components/readme-display"
import { Suspense } from "react"

export default function ReadmePage() {
  return (
    <div 
      className="min-h-screen max-w-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-8 overflow-hidden"
      style={{ backgroundImage: `url('/gradii-image.png')` }}
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="relative">
              {/* Enhanced loading spinner */}
              <div className="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-700 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              {/* Pulsing dots */}
              <div className="flex items-center justify-center gap-1 mt-6">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Loading README
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Preparing your generated documentation...
              </p>
            </div>
          </div>
        }
      >
        <ReadmeDisplay />
      </Suspense>
    </div>
  )
}