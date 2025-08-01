#!/usr/bin/env tsx

import { Dub } from "dub"
import dotenv from "dotenv"
import path from "path"

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env.local") })

async function testDubIntegration() {
  console.log("🧪 Testing Dub Integration...")
  
  // Check if API key is set
  if (!process.env.DUB_API_KEY) {
    console.error("❌ DUB_API_KEY is not set in .env.local")
    process.exit(1)
  }

  try {
    // Initialize Dub client
    const dub = new Dub({
      token: process.env.DUB_API_KEY,
    })

    // Test creating a short link
    console.log("📝 Creating test short link...")
    
    const linkData: any = {
      url: "https://github.com/vercel/next.js",
      title: "Test v0 Chat Link",
      tags: ["v0-chat", "test"],
      metadata: {
        test: true,
        createdAt: new Date().toISOString()
      }
    }

    // Add custom domain if configured
    if (process.env.DUB_CUSTOM_DOMAIN) {
      linkData.domain = process.env.DUB_CUSTOM_DOMAIN
      console.log(`🌐 Using custom domain: ${process.env.DUB_CUSTOM_DOMAIN}`)
    }

    const link = await dub.links.create(linkData)

    console.log("✅ Short link created successfully!")
    console.log("🔗 Short URL:", link.shortLink)
    console.log("📊 Link ID:", link.id)
    console.log("🏷️  Tags:", link.tags)
    
    // Optional: Delete the test link
    console.log("\n🗑️  Cleaning up test link...")
    await dub.links.delete(link.id)
    console.log("✅ Test link deleted")
    
    console.log("\n🎉 Dub integration is working correctly!")
    
  } catch (error) {
    console.error("❌ Error testing Dub integration:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
    }
    process.exit(1)
  }
}

// Run the test
testDubIntegration()