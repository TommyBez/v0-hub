# v0 Chat Bootstrapper with Dub Short Links

A modern Next.js application that streamlines the process of bootstrapping v0 chats from GitHub repositories with automatic short link generation using Dub. Built with React 19, TypeScript, and a comprehensive UI component library.

## 🚀 Features

- **GitHub Repository Integration**: Bootstrap v0 chats from any public GitHub repository
- **Automatic Branch Detection**: Fetches and displays all available repository branches
- **Smart Link Shortening**: Generates clean, shareable short links using Dub API
- **One-Click Copying**: Easy clipboard integration for quick sharing
- **Modern UI/UX**: Beautiful, responsive interface built with shadcn/ui components
- **Dark Mode Support**: Built-in theme switching with next-themes
- **Analytics Ready**: Track link engagement through Dub's analytics dashboard

## 📋 Prerequisites

Before you begin, ensure you have:

1. **API Keys**:
   - v0 API key from [v0.dev](https://v0.dev)
   - Dub API key from [dub.co](https://dub.co)

2. **Development Environment**:
   - Node.js 18.0 or higher
   - pnpm package manager (recommended) or npm/yarn

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```env
   V0_API_KEY=your_v0_api_key_here
   DUB_API_KEY=your_dub_api_key_here
   ```

4. **Start the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💻 Usage

1. **Enter Repository URL**: Paste any public GitHub repository URL into the input field
2. **Select Branch**: Choose from the automatically populated branch dropdown
3. **Bootstrap Chat**: Click the "Bootstrap" button to create a v0 chat instance
4. **Share Short Link**: Copy the generated short link with one click

## 🔧 Technical Stack

### Core Technologies
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5
- **React**: Version 19 (latest)
- **Styling**: Tailwind CSS v4 with PostCSS

### Key Dependencies
- **v0-sdk**: Official v0 SDK for chat bootstrapping
- **dub**: Link shortening and analytics
- **@radix-ui**: Comprehensive UI primitives
- **lucide-react**: Modern icon library
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **sonner**: Toast notifications

### UI Components
The application leverages a full suite of shadcn/ui components including:
- Dialogs, Dropdowns, and Popovers
- Forms with validation
- Toasts and notifications
- Theme switching
- And many more...

## 🔍 Dub Integration Details

The application uses the [Dub TypeScript SDK](https://github.com/dubinc/dub-ts) for creating and managing short links.

### Features:
- **Automatic Link Generation**: Short links are created instantly after successful chat bootstrapping
- **Custom Domains**: Support for custom domains (if configured in your Dub account)
- **Link Analytics**: Track clicks, geographic data, and device information
- **Link Management**: Organize all your v0 chat links in the Dub dashboard

### Configuration:
The Dub integration gracefully degrades if no API key is provided. Without a `DUB_API_KEY`, the application will display the original v0 URLs instead of short links.

## 🐛 Troubleshooting

### Short links not being created
- Verify `DUB_API_KEY` is correctly set in `.env.local`
- Check browser console for specific Dub API errors
- Ensure your Dub account has available quota
- Confirm your Dub workspace is active

### v0 chat creation fails
- Confirm `V0_API_KEY` is valid and correctly set
- Ensure the GitHub repository is public
- Verify the selected branch exists and is accessible
- Check v0 service status at [v0.dev/status](https://v0.dev/status)

### Build or deployment issues
- Clear `.next` cache: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Ensure all environment variables are set in your deployment platform

## 📚 Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## 🔗 Learn More

- [v0 Documentation](https://v0.dev/docs) - Learn about v0 chat capabilities
- [Dub Documentation](https://dub.co/docs) - Explore link management features
- [Dub TypeScript SDK](https://dub.co/docs/sdks/typescript) - SDK reference
- [Next.js Documentation](https://nextjs.org/docs) - Framework documentation
- [shadcn/ui](https://ui.shadcn.com) - Component library documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Next.js, v0, and Dub
