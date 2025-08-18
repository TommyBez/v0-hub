import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Icon generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 4,
        }}
      >
        {/* Hub icon - interconnected nodes */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Center node */}
          <circle cx="12" cy="12" r="3" fill="white" />
          {/* Connected nodes */}
          <circle cx="12" cy="4" r="2" fill="white" />
          <circle cx="20" cy="12" r="2" fill="white" />
          <circle cx="12" cy="20" r="2" fill="white" />
          <circle cx="4" cy="12" r="2" fill="white" />
          {/* Connection lines */}
          <path d="M12 7V9" stroke="white" strokeWidth="1.5" />
          <path d="M15 12H17" stroke="white" strokeWidth="1.5" />
          <path d="M12 15V17" stroke="white" strokeWidth="1.5" />
          <path d="M7 12H9" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}