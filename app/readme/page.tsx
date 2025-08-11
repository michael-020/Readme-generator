import { ReadmeDisplay } from "@/components/readme-display"
import { Suspense } from "react"

export default function ReadmePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <ReadmeDisplay />
      </Suspense>
    </div>
  )
}
