# Dub Integration Guide

This guide explains how the Dub integration works in the v0 Chat Bootstrapper application.

## Overview

When you create a v0 chat from a GitHub repository, the application automatically generates short links using Dub. This provides:

- **Cleaner URLs**: Transform long v0 URLs into short, shareable links
- **Analytics**: Track how many times your v0 chats are accessed
- **Link Management**: View and manage all your links in the Dub dashboard

## How It Works

### 1. Chat Creation Flow

```
User enters GitHub URL → v0 creates chat → Dub creates short links → User gets shortened URLs
```

### 2. Generated Links

For each v0 chat, short links are created for both the chat URL and demo URL, though only the chat URL is displayed in the UI.

### 3. Simple Integration

The integration is intentionally kept simple - it only creates basic short links without any additional configuration or metadata.

## Configuration

### Required Setup

1. Get a Dub API key from [dub.co/settings/api-keys](https://dub.co/settings/api-keys)
2. Add it to your `.env.local` file:
   ```env
   DUB_API_KEY=your_dub_api_key_here
   ```

That's it! No additional configuration is needed.

## Testing the Integration

Run the test script to verify your Dub setup:

```bash
pnpm test-dub
```

This will:
1. Create a test short link
2. Display the generated URL
3. Clean up by deleting the test link
4. Confirm the integration is working

## Troubleshooting

### Short links not being created

1. **Check API Key**: Ensure `DUB_API_KEY` is set correctly in `.env.local`
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

## Analytics

View your link analytics in the Dub dashboard:

1. Go to [app.dub.co](https://app.dub.co)
2. View click counts, geographic data, and more for each link

## API Reference

For more information:
- [Dub API Documentation](https://dub.co/docs/api)
- [Dub TypeScript SDK](https://github.com/dubinc/dub-ts)

## Support

- **Dub Issues**: Contact support@dub.co
- **Integration Issues**: Open an issue in this repository