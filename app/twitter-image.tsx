import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'v0hub - Bootstrap v0 chat from GitHub repositories'
export const size = {
  width: 1200,
  height: 600,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 32,
          background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -120,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.08)',
            filter: 'blur(60px)',
          }}
        />

        {/* Main content - more compact for Twitter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '60px',
            width: '100%',
            maxWidth: '1100px',
          }}
        >
          {/* Left side - Text content */}
          <div
            style={{
              flex: 1,
              paddingRight: '60px',
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '100px',
                marginBottom: '24px',
                fontSize: '16px',
                color: '#e2e8f0',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginRight: '6px' }}
              >
                <path
                  d="M12 2L13.09 8.26L19 7L15.45 11.82L21 16L14.5 16L12 22L9.5 16L3 16L8.55 11.82L5 7L10.91 8.26L12 2Z"
                  fill="#8b5cf6"
                />
              </svg>
              Powered by v0 sdk
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 900,
                lineHeight: 1.1,
                color: 'white',
                marginBottom: '20px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Work on any
              <span style={{ display: 'block', color: '#8b5cf6' }}>
                GitHub repo
              </span>
              with v0 agent
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '20px',
                color: '#94a3b8',
                lineHeight: 1.4,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Bootstrap a v0 chat from any public GitHub repository.
            </p>
          </div>

          {/* Right side - Form preview */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '400px',
              padding: '28px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* GitHub icon */}
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#8b5cf6">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: '14px',
                color: '#e2e8f0',
                marginBottom: '8px',
                fontWeight: 500,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              GitHub Repository URL
            </div>

            {/* Input field preview */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '6px',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
                color: '#64748b',
                fontSize: '14px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              github.com/vercel/next.js
            </div>

            {/* Button preview */}
            <div
              style={{
                background: '#8b5cf6',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
            >
              Create v0 chat →
            </div>
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}