import { ReadmeDisplay } from "@/components/readme-display"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

export default function ReadmePage() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url('/gradii-image.png')` }}
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-neutral-700 rounded-full animate-spin">
                <Loader2 />
              </div>
              <div className="flex items-center justify-center gap-1 mt-4 sm:mt-6">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce"></div>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 text-center max-w-sm">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                Loading README
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
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