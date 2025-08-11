import { HomeForm } from "@/components/home-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">GitHub README Generator</h1>
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Generate professional README files for your GitHub repositories using AI
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <HomeForm />
          </div>
        </div>
      </div>
    </div>
  )
}
