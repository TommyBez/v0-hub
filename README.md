# v0hub - Instant v0 Chats from GitHub Repos

v0hub is a powerful Next.js application that instantly creates v0 chats from any public GitHub repository link. Simply paste a repo URL, select a branch, and get a v0 chat ready to explore and discuss the codebase - all with automatic short link generation for easy sharing.

## 🚀 Core Feature

**Instant v0 Chat Creation**: Transform any public GitHub repository into an interactive v0 chat session in seconds. v0hub bridges the gap between code repositories and AI-powered code discussions, making it effortless to:
- Explore codebases with AI assistance
- Get instant code explanations
- Discuss implementation details
- Share development sessions with colleagues

## ✨ Key Features

- **One-Click Chat Generation**: Paste a GitHub repo URL and instantly create a v0 chat
- **Smart Branch Selection**: Automatically fetches and displays all available branches
- **Instant Short Links**: Get shareable short links powered by Dub
- **Zero Configuration**: Works with any public GitHub repository
- **Lightning Fast**: Optimized for speed with parallel API calls
- **Beautiful UI**: Modern, responsive interface built with shadcn/ui
- **Dark Mode**: Seamless theme switching for comfortable viewing
- **Link Analytics**: Track engagement on shared chat sessions

## 📋 Prerequisites

Before using v0hub, ensure you have:

1. **API Keys**:
   - v0 API key from [v0.dev](https://v0.dev)
   - Dub API key from [dub.co](https://dub.co) (optional, for short links)

2. **Development Environment** (for self-hosting):
   - Node.js 18.0 or higher
   - pnpm package manager (recommended) or npm/yarn

## 🛠️ Installation

1. **Clone v0hub**:
   ```bash
   git clone <v0hub-repo-url>
   cd v0hub
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```env
   V0_API_KEY=your_v0_api_key_here
   DUB_API_KEY=your_dub_api_key_here  # Optional
   ```

4. **Start v0hub**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💻 How v0hub Works

1. **Paste Repository URL**: Enter any public GitHub repository URL
2. **Select Branch**: Choose the branch you want to explore
3. **Create Chat**: Click "Bootstrap" to instantly generate a v0 chat
4. **Share**: Copy the short link to share the chat session

That's it! v0hub handles all the complexity of creating v0 chats, making it as simple as sharing a link.

## 🔧 Technical Stack

v0hub is built with modern web technologies for optimal performance and developer experience:

### Core Technologies
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5
- **React**: Version 19 (latest)
- **Styling**: Tailwind CSS v4 with PostCSS

### Key Integrations
- **v0-sdk**: Official SDK for v0 chat creation
- **dub**: Enterprise-grade link shortening
- **@radix-ui**: Accessible UI primitives
- **lucide-react**: Beautiful icons
- **react-hook-form**: Performant forms
- **zod**: Type-safe validation
- **sonner**: Elegant notifications

## 🔗 Short Link Integration

v0hub automatically generates short, memorable links for every v0 chat created:

- **Instant Generation**: Short links are created simultaneously with chat sessions
- **Professional URLs**: Share clean links instead of long v0 URLs
- **Analytics Dashboard**: Track clicks and engagement in Dub
- **Graceful Fallback**: Works without Dub API key (shows original URLs)

## 🐛 Troubleshooting

### v0 chat creation issues
- Verify your `V0_API_KEY` is valid
- Ensure the GitHub repository is public
- Check that the selected branch exists
- Confirm v0 service status at [v0.dev/status](https://v0.dev/status)

### Short link issues
- Confirm `DUB_API_KEY` is set correctly (if using)
- Check Dub account quota
- Verify workspace is active

### General issues
- Clear cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Check all environment variables are set

## 📚 Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## 🚀 Deployment

v0hub can be deployed to any platform that supports Next.js:

- **Vercel**: One-click deploy with automatic builds
- **Netlify**: Full Next.js support
- **Railway**: Simple deployment with environment variables
- **Self-hosted**: Use `pnpm build` and `pnpm start`

Remember to set your environment variables in your deployment platform.

## 🔗 Resources

- [v0 Documentation](https://v0.dev/docs) - Learn about v0's capabilities
- [Dub Documentation](https://dub.co/docs) - Link management features
- [Next.js Documentation](https://nextjs.org/docs) - Framework reference
- [shadcn/ui](https://ui.shadcn.com) - Component documentation

## 🤝 Contributing

We welcome contributions to v0hub! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

v0hub is licensed under the MIT License - see the LICENSE file for details.

---

**v0hub** - Instantly turn any GitHub repo into an AI-powered chat session. Built with ❤️ using Next.js, v0, and Dub.
