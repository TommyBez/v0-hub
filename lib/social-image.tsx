import { ImageResponse } from 'next/og'

export const OPEN_GRAPH_SIZE = { width: 1200, height: 630 } as const
export const TWITTER_SIZE = { width: 1500, height: 785 } as const

type SocialImageSize = {
  width: number
  height: number
}

type SocialImageTheme = 'dark' | 'light'

export type SocialImageOptions = {
  title: string
  subtitle?: string
  badge?: string
  meta?: string
  tag?: string
  footer?: string
  size?: SocialImageSize
  theme?: SocialImageTheme
}

const FONT_FAMILY =
  'Geist Sans, Inter, "Space Grotesk", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'

const THEMES: Record<
  SocialImageTheme,
  {
    background: string
    overlay: string
    text: string
    muted: string
    accent: string
    badgeBg: string
  }
> = {
  dark: {
    background: '#030712',
    overlay:
      'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(248, 250, 252, 0.12), transparent 55%)',
    text: '#F8FAFC',
    muted: '#94A3B8',
    accent: '#38BDF8',
    badgeBg: 'rgba(15, 23, 42, 0.7)',
  },
  light: {
    background: '#F8FAFC',
    overlay:
      'radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.14), transparent 45%), radial-gradient(circle at 90% 20%, rgba(14, 165, 233, 0.2), transparent 55%)',
    text: '#0F172A',
    muted: '#475569',
    accent: '#0EA5E9',
    badgeBg: 'rgba(255, 255, 255, 0.75)',
  },
}

const DEFAULT_FOOTER = 'Bootstrap GitHub repositories with the v0 agent'

export function createSocialImage({
  title,
  subtitle,
  badge,
  meta,
  tag,
  footer,
  size,
  theme = 'dark',
}: SocialImageOptions) {
  const { width, height } = size ?? OPEN_GRAPH_SIZE
  const palette = THEMES[theme]

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: palette.background,
        backgroundImage: palette.overlay,
        color: palette.text,
        fontFamily: FONT_FAMILY,
        padding: '80px',
        borderRadius: '48px',
        boxShadow: '0 40px 120px rgba(15, 23, 42, 0.45)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '32px',
          padding: '48px',
          background:
            theme === 'dark'
              ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.2))'
              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.7))',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '32px',
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: `linear-gradient(135deg, ${palette.accent}, #6366F1)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                color: '#0F172A',
                fontWeight: 700,
              }}
            >
              v0
            </div>
            v0hub
          </div>
          {badge ? (
            <div
              style={{
                padding: '12px 20px',
                borderRadius: '999px',
                border: `1px solid ${palette.accent}`,
                color: palette.accent,
                fontSize: '22px',
                fontWeight: 600,
                backgroundColor: palette.badgeBg,
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {tag ? (
            <div
              style={{
                fontSize: '24px',
                letterSpacing: '0.25em',
                color: palette.muted,
                textTransform: 'uppercase',
              }}
            >
              {tag}
            </div>
          ) : null}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: '34px',
                color: palette.muted,
                lineHeight: 1.3,
                maxWidth: '1000px',
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '26px',
            color: palette.muted,
            borderTop: '1px solid rgba(148, 163, 184, 0.3)',
            paddingTop: '24px',
          }}
        >
          <span>{meta ?? 'github.com • v0 sdk • redis caching'}</span>
          <span>{footer ?? DEFAULT_FOOTER}</span>
        </div>
      </div>
    </div>,
    {
      width,
      height,
    },
  )
}
