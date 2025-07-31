# GitHub Repository to v0 Chat Bootstrapper

*A Next.js application that creates v0.dev chat instances from GitHub repositories*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tommasos-projects-bb9d6551/v0-v0-github-bootstrapper)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Bf8RAM3tv5J)

## Overview

This application provides a simple web interface to bootstrap new v0.dev chat instances from public GitHub repositories. Users can input a GitHub repository URL and branch, and the application will create a private v0 chat session initialized with that repository's code.

## Features

- **Repository Input**: Enter any public GitHub repository URL
- **Branch Selection**: Specify which branch to bootstrap from
- **Instant Chat Creation**: Creates a private v0 chat instance with one click
- **Preview Integration**: View the created chat directly in an embedded iframe
- **Copy & Share**: Easy copying of chat URLs for sharing
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## How It Works

1. **Enter Repository Details**: Provide a GitHub repository URL (e.g., `https://github.com/vercel/next.js`) and specify the branch
2. **Bootstrap Chat**: Click the "Bootstrap Chat" button to create a new v0 chat instance
3. **Access Your Chat**: Get a direct link to your private v0 chat session initialized with the repository code
4. **Start Developing**: Use the v0 chat to iterate on and improve the code from the repository

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with dark mode support
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel
- **API Integration**: v0-sdk for chat creation

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- A v0.dev API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd v0-github-bootstrapper
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env.local and add your v0 API key
V0_API_KEY=your_v0_api_key_here
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `V0_API_KEY` | Your v0.dev API key for creating chat instances | Yes |

## Deployment

The application is configured for easy deployment on Vercel:

1. Connect your repository to Vercel
2. Add the `V0_API_KEY` environment variable in your Vercel dashboard
3. Deploy

**Live Demo**: [https://vercel.com/tommasos-projects-bb9d6551/v0-v0-github-bootstrapper](https://vercel.com/tommasos-projects-bb9d6551/v0-v0-github-bootstrapper)

## Development

Continue building and improving this application on v0.dev:

**[https://v0.dev/chat/projects/Bf8RAM3tv5J](https://v0.dev/chat/projects/Bf8RAM3tv5J)**

## License

This project is private and not licensed for public use.
