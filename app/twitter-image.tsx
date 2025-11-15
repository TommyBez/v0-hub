import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'
export const alt = 'v0hub - v0 GitHub Bootstrapper'
export const size = {
  width: 1200,
  height: 600,
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
        padding: '50px',
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
          borderRadius: '36px',
          padding: '60px 80px',
          boxShadow: '0 20px 60px rgba(135, 114, 232, 0.15)',
          position: 'relative',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: 100,
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
            fontSize: 32,
            color: '#3d3757',
            textAlign: 'center',
            maxWidth: '700px',
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
            marginTop: '40px',
            backgroundColor: '#f4f2fa',
            padding: '14px 28px',
            borderRadius: '18px',
            fontSize: 22,
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
          bottom: 35,
          right: 35,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#8772e8',
            display: 'flex',
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#a295f0',
            display: 'flex',
          }}
        />
        <div
          style={{
            width: 10,
            height: 10,
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
