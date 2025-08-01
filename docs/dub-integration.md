# Dub Integration Guide

This guide explains how the Dub integration works in the v0 Chat Bootstrapper application.

## Overview

When you create a v0 chat from a GitHub repository, the application automatically generates short links using Dub. This provides several benefits:

- **Cleaner URLs**: Transform long v0 URLs into short, shareable links
- **Analytics**: Track how many times your v0 chats are accessed
- **Organization**: All generated links are tagged with "v0-chat" in your Dub dashboard
- **Metadata**: Links include repository and branch information for easy identification

## How It Works

### 1. Chat Creation Flow

```
User enters GitHub URL → v0 creates chat → Dub creates short links → User gets both URLs
```

### 2. Generated Links

For each v0 chat, two short links are created:

1. **Chat URL**: Direct link to the v0 chat interface
2. **Demo URL**: Link to the live demo/preview of the generated code

### 3. Link Metadata

Each short link includes:
- **Title**: Repository name and branch (e.g., "v0 Chat - vercel/next.js (main)")
- **Tags**: ["v0-chat"] for easy filtering in Dub dashboard
- **Metadata**: Repository URL, branch, chat ID, and creation timestamp

## Configuration

### Required Setup

1. Get a Dub API key from [dub.co/settings/api-keys](https://dub.co/settings/api-keys)
2. Add it to your `.env.local` file:
   ```env
   DUB_API_KEY=your_dub_api_key_here
   ```

### Optional Features

#### Custom Domain

If you have a Dub subscription, you can use a custom domain:

```env
DUB_CUSTOM_DOMAIN=short.yourdomain.com
```

#### Advanced Link Options

Modify `app/actions.ts` to add more link features:

```typescript
const link = await dub.links.create({
  url: longUrl,
  title: title,
  tags: ["v0-chat"],
  
  // Additional options:
  expiresAt: "2024-12-31", // Set expiration date
  password: "secret", // Password protect the link
  ios: "app://custom-url", // iOS app deep link
  android: "app://custom-url", // Android app deep link
  geo: {
    // Geographic targeting
    US: "https://us-version.com",
    GB: "https://uk-version.com"
  },
  device: {
    // Device targeting
    desktop: "https://desktop-version.com",
    mobile: "https://mobile-version.com"
  }
})
```

## Testing the Integration

Run the test script to verify your Dub setup:

```bash
pnpm test-dub
```

This will:
1. Create a test short link
2. Display the generated URL and metadata
3. Clean up by deleting the test link
4. Confirm the integration is working

## Troubleshooting

### Short links not being created

1. **Check API Key**: Ensure `DUB_API_KEY` is set correctly
2. **Verify Quota**: Check your Dub dashboard for remaining quota
3. **Review Logs**: Check server logs for specific error messages

### Rate Limits

Dub has rate limits based on your plan:
- Free: 100 links/month
- Pro: 5,000 links/month
- Business: 50,000 links/month

### Common Errors

| Error | Solution |
|-------|----------|
| "unauthorized" | Invalid API key - check your `.env.local` |
| "rate limit exceeded" | Upgrade your Dub plan or wait for quota reset |
| "domain not found" | Custom domain not configured in Dub dashboard |

## Analytics

View your v0 chat link analytics in the Dub dashboard:

1. Go to [app.dub.co](https://app.dub.co)
2. Filter by tag: "v0-chat"
3. View click counts, geographic data, and more

## Best Practices

1. **Use Descriptive Titles**: Include repository and branch names
2. **Add Metadata**: Track additional context like user IDs or session IDs
3. **Monitor Usage**: Regularly check analytics to understand engagement
4. **Clean Up Old Links**: Set expiration dates for temporary demos

## API Reference

For more advanced features, refer to:
- [Dub API Documentation](https://dub.co/docs/api)
- [Dub TypeScript SDK](https://github.com/dubinc/dub-ts)

## Support

- **Dub Issues**: Contact support@dub.co
- **Integration Issues**: Open an issue in this repository