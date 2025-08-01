# v0 Chat Bootstrapper with Dub Short Links

This is a Next.js application that allows you to bootstrap v0 chats from GitHub repositories and automatically creates short links using Dub.

## Features

- Bootstrap v0 chats from any public GitHub repository
- Automatically fetch and select repository branches
- Generate short links for chat URLs using Dub
- Copy links to clipboard with one click
- Modern, responsive UI built with shadcn/ui

## Prerequisites

Before you begin, ensure you have:

1. A v0 account and API key (get it from [v0.dev](https://v0.dev))
2. A Dub account and API key (get it from [dub.co](https://dub.co))
3. Node.js 18+ installed
4. pnpm package manager (or npm/yarn)

## Setup

1. Clone this repository:
   \`\`\`bash
   git clone <your-repo-url>
   cd <your-repo-name>
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Create a `.env.local` file in the root directory and add your API keys:
   \`\`\`env
   V0_API_KEY=your_v0_api_key_here
   DUB_API_KEY=your_dub_api_key_here
   \`\`\`

4. Run the development server:
   \`\`\`bash
   pnpm dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Enter a GitHub Repository URL**: Paste any public GitHub repository URL
2. **Select a Branch**: The app automatically fetches available branches
3. **Bootstrap Chat**: Click the button to create a v0 chat instance
4. **Get Short Links**: The app automatically creates short links using Dub for easy sharing

## Dub Integration

The application uses the [Dub TypeScript SDK](https://github.com/dubinc/dub-ts) to create short links for generated v0 chats. When a chat is successfully created, short links are automatically generated for the chat URL, making them easier to share.

### Benefits of Using Dub

- **Cleaner URLs**: Share professional-looking short links instead of long v0 URLs
- **Analytics**: Track clicks and engagement on your v0 chat links in the Dub dashboard
- **Link Management**: Organize and manage all your v0 chat links in one place

## Configuration

The Dub integration only requires your API key. If the `DUB_API_KEY` is not set, the application will continue to work normally, displaying the original v0 URLs instead of short links.

## Troubleshooting

### Short links not being created

- Ensure your `DUB_API_KEY` is correctly set in `.env.local`
- Check the console logs for any Dub API errors
- Verify your Dub account has sufficient quota

### v0 chat creation fails

- Ensure your `V0_API_KEY` is correctly set
- Verify the GitHub repository is public
- Check that you have selected a valid branch

## Learn More

- [v0 Documentation](https://v0.dev/docs)
- [Dub Documentation](https://dub.co/docs)
- [Dub TypeScript SDK Guide](https://dub.co/docs/sdks/typescript)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
