# v0hub

A Next.js application that creates v0 chat sessions from public GitHub repository URLs.

## What it does

v0hub lets you paste a GitHub repository URL and create a v0 chat session for that codebase. This allows you to use v0's capabilities to explore and work with the code.

## Requirements

- v0 API key from [v0.dev](https://v0.dev)
- Dub API key from [dub.co](https://dub.co) (optional, for URL shortening)
- Node.js 18+
- pnpm (or npm/yarn)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd v0hub
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create `.env.local`:
   ```env
   V0_API_KEY=your_v0_api_key
   DUB_API_KEY=your_dub_api_key  # Optional
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Enter a public GitHub repository URL
2. Select a branch
3. Click "Bootstrap" to create a v0 chat
4. The generated v0 chat URL will be displayed (shortened if Dub is configured)

## Tech Stack

- Next.js 15.2.4
- TypeScript
- React 19
- Tailwind CSS
- shadcn/ui components
- v0-sdk
- Dub SDK (optional)

## Scripts

```bash
pnpm dev      # Development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run linter
```

## Environment Variables

- `V0_API_KEY` - Required. Your v0 API key
- `DUB_API_KEY` - Optional. For URL shortening

## License

MIT
