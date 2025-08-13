# Readme-generator

Welcome to **Readme-generator**! 👋 An innovative, AI-powered tool designed to transform your GitHub repositories with professional, comprehensive README files in mere seconds. Say goodbye to manual documentation and hello to instant, high-quality project descriptions! 🚀

## ✨ Key Features

*   **⚡️ Lightning-Fast Generation**: Get a complete and well-structured README in just a few moments, powered by advanced AI.
*   **🧠 Intelligent Code Analysis**: Our AI intelligently analyzes your repository's structure and dependencies to create truly comprehensive documentation.
*   **💼 Professional & Best Practices**: Generated READMEs follow industry best practices, ensuring your project looks polished and is easy to understand.
*   **👀 Interactive Preview**: View a beautifully rendered preview of your README before you download it.
*   **📝 Markdown View**: Easily switch to the raw Markdown code to inspect or make minor tweaks.
*   **📋 One-Click Copy**: Instantly copy the generated Markdown content to your clipboard.
*   **💾 Direct Download**: Download your new `README.md` file with a single click, ready for your repository.
*   **📊 README Statistics**: Get quick insights into your generated documentation with character, line, and word counts.

## 🛠️ Technologies Used

**Readme-generator** is built with a powerful stack to deliver a seamless and efficient experience.

### Frontend
*   **Next.js**: A React framework for building fast web applications.
*   **React**: For building the user interface.
*   **Tailwind CSS**: A utility-first CSS framework for rapid styling.
*   **Framer Motion**: For smooth and engaging UI animations.
*   **Lucide React**: A collection of beautiful and customizable SVG icons.
*   **React Hot Toast**: For elegant and responsive notifications.
*   **React Markdown**: Renders Markdown content in React applications.
*   **Remark GFM & Remark Breaks**: Plugins for React Markdown to support GitHub Flavored Markdown and hard breaks.
*   **Zustand**: A small, fast, and scalable state-management solution.

### Backend
*   **Node.js**: Powers the server-side logic and API routes.
*   **Octokit**: The official GitHub API client for interacting with GitHub repositories.
*   **OpenAI API (Google Gemini)**: Leverages advanced AI models for intelligent README generation.
*   **Git**: Used for cloning repositories to analyze project structure.

## 🚀 Getting Started

Follow these steps to get your local copy of **Readme-generator** up and running.

### Prerequisites

Make sure you have Node.js and pnpm installed on your system.

*   Node.js (v18.0.0 or higher)
*   pnpm (v8.0.0 or higher)
*   Git

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/michael-020/Readme-generator.git
    cd Readme-generator
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root of the project and add the following:
    ```
    GITHUB_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
    GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```
    *   You can generate a GitHub Personal Access Token [here](https://github.com/settings/tokens). Ensure it has `repo` scope to clone private repositories (or leave it public if only public repos will be used).
    *   Obtain your Google Gemini API key from the Google AI Studio or Google Cloud Console.

### Running the Project

1.  **Start the development server**:
    ```bash
    pnpm dev
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

You're now ready to start generating amazing READMEs for your projects!