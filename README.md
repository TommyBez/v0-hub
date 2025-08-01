# v0hub - Work on Any GitHub Codebase with v0 Agent

v0hub enables you to instantly work on any public GitHub repository using v0's powerful agent capabilities. Simply paste a repo URL and start coding with AI assistance - no setup, no cloning, just instant access to v0's codebase intelligence.

## 🚀 Core Value

**Work on Any Codebase Instantly**: v0hub transforms any public GitHub repository into an active development environment powered by v0's agent. This means you can:

- **Explore and understand** unfamiliar codebases with AI guidance
- **Make modifications** with v0 agent's code generation capabilities
- **Debug issues** by leveraging v0's understanding of the entire codebase
- **Learn from any project** by asking questions and getting contextual explanations
- **Prototype features** without local setup or environment configuration

## ✨ Key Features

- **Instant Access**: Work on any public GitHub repo without cloning or setup
- **Full v0 Agent Power**: Access all of v0's codebase analysis and generation capabilities
- **Branch Selection**: Choose any branch to work with the exact code version you need
- **Zero Configuration**: No environment setup, dependency installation, or build steps
- **Context-Aware AI**: v0 understands the entire repository structure and dependencies
- **Modern Interface**: Clean, intuitive UI for seamless interaction
- **Share Sessions**: Easy URL sharing to collaborate on code exploration

## 📋 Prerequisites

To use v0hub, you need:

1. **v0 API Key**: Get yours from [v0.dev](https://v0.dev) to access agent capabilities
2. **Dub API Key** (optional): From [dub.co](https://dub.co) for URL shortening

For self-hosting:
- Node.js 18.0 or higher
- pnpm (recommended) or npm/yarn

## 🛠️ Quick Start

1. **Clone v0hub**:
   ```bash
   git clone <v0hub-repo-url>
   cd v0hub
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up API key**:
   
   Create `.env.local`:
   ```env
   V0_API_KEY=your_v0_api_key_here
   DUB_API_KEY=your_dub_api_key_here  # Optional
   ```

4. **Launch v0hub**:
   ```bash
   pnpm dev
   ```

5. **Start working**:
   
   Open [http://localhost:3000](http://localhost:3000) and paste any GitHub repo URL

## 🔧 How It Works

1. **Paste Repository URL**: Any public GitHub repository
2. **Select Branch**: Choose the branch you want to work with
3. **Create v0 Session**: Click to initialize v0 agent with the codebase
4. **Start Working**: Use v0's full capabilities to explore, understand, and modify code

The v0 agent instantly indexes the repository, understands its structure, dependencies, and patterns, giving you intelligent assistance for any coding task.

## 🏗️ Built With

- **Next.js 15.2.4**: Modern React framework with App Router
- **TypeScript 5**: Type-safe development
- **v0-sdk**: Official v0 agent integration
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: Beautiful, accessible components
- **React 19**: Latest React features

## 🐛 Troubleshooting

### v0 agent access issues
- Verify your `V0_API_KEY` is valid and has appropriate permissions
- Ensure the GitHub repository is public
- Check v0 service status at [v0.dev/status](https://v0.dev/status)

### Repository loading problems
- Confirm the repository URL is correct and accessible
- Try a different branch if the default branch has issues
- Large repositories may take a moment to index

### General issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Verify all required environment variables are set

## 📚 Commands

```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # Code linting
```

## 🚀 Deploy

Deploy v0hub anywhere Next.js runs:

- **Vercel**: Recommended for easiest deployment
- **Netlify**: Full Next.js support
- **Railway**: Quick deployment with env vars
- **Self-hosted**: Build and run anywhere

Don't forget to set your `V0_API_KEY` in your deployment platform.

## 📖 Learn More

- [v0 Documentation](https://v0.dev/docs) - Understand v0 agent capabilities
- [v0hub GitHub](https://github.com/yourusername/v0hub) - Project repository
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation

## 🤝 Contributing

Help make v0hub better:
- Report bugs or request features via issues
- Submit PRs for improvements
- Share your use cases and feedback

## 📄 License

MIT License - see LICENSE file for details.

---

**v0hub** - Work on any GitHub codebase with the power of v0 agent. No setup, just start coding.
