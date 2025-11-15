import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'
export const alt = 'v0hub - v0 GitHub Bootstrapper'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ebe9f3',
        backgroundImage: 'linear-gradient(to bottom right, #ebe9f3 0%, #d8d4ea 100%)',
        padding: '60px',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          opacity: 0.1,
          backgroundImage: `
            repeating-linear-gradient(0deg, #8772e8 0px, #8772e8 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, #8772e8 0px, #8772e8 1px, transparent 1px, transparent 40px)
          `,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: '40px',
          padding: '80px 100px',
          boxShadow: '0 20px 60px rgba(135, 114, 232, 0.15)',
          position: 'relative',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8772e8 0%, #a295f0 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.05em',
              display: 'flex',
            }}
          >
            v0Hub
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 36,
            color: '#3d3757',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          Bootstrap a v0 chat from a GitHub repository
        </div>

        {/* Accent badge */}
        <div
          style={{
            display: 'flex',
            marginTop: '48px',
            backgroundColor: '#f4f2fa',
            padding: '16px 32px',
            borderRadius: '20px',
            fontSize: 24,
            color: '#8772e8',
            fontWeight: 600,
          }}
        >
          ✨ Connect GitHub → Generate v0 Chat
        </div>
      </div>

      {/* Bottom decoration */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#8772e8',
            display: 'flex',
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#a295f0',
            display: 'flex',
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#bbb3f6',
            display: 'flex',
          }}
        />
      </div>
    </div>,
    {
      ...size,
    }
  )
}
