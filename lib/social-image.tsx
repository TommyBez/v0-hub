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

// The ImageResponse renderer does not have access to CSS variables,
// so we mirror the brand palette defined in app/globals.css using
// the exact OKLCH tokens documented in docs/color-guidelines.md.
const BRAND_TOKENS = {
  light: {
    background: 'oklch(0.9232 0.0026 48.7171)',
    card: 'oklch(0.9699 0.0013 106.4238)',
    border: 'oklch(0.8687 0.0043 56.3660)',
    text: 'oklch(0.2795 0.0368 260.0310)',
    muted: 'oklch(0.5510 0.0234 264.3637)',
    primary: 'oklch(0.5854 0.2041 277.1173)',
    accent: 'oklch(0.9376 0.0260 321.9388)',
  },
  dark: {
    background: 'oklch(0.2244 0.0074 67.4370)',
    card: 'oklch(0.2801 0.0080 59.3379)',
    border: 'oklch(0.3359 0.0077 59.4197)',
    text: 'oklch(0.9288 0.0126 255.5078)',
    muted: 'oklch(0.7137 0.0192 261.3246)',
    primary: 'oklch(0.6801 0.1583 276.9349)',
    accent: 'oklch(0.3896 0.0074 59.4734)',
  },
}

const FONT_FAMILY =
  '"Plus Jakarta Sans", Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'

const THEMES: Record<
  SocialImageTheme,
  {
    background: string
    overlay: string
    cardOverlay: string
    border: string
    text: string
    muted: string
    accent: string
    accentSecondary: string
    badgeBg: string
    divider: string
  }
> = {
  dark: {
    background: BRAND_TOKENS.dark.background,
    overlay:
      'radial-gradient(circle at 18% 20%, oklch(0.6801 0.1583 276.9349 / 0.25), transparent 55%), radial-gradient(circle at 82% 0%, oklch(0.7137 0.0192 261.3246 / 0.2), transparent 62%)',
    cardOverlay:
      'linear-gradient(145deg, oklch(0.2801 0.0080 59.3379 / 0.92), oklch(0.2244 0.0074 67.4370 / 0.78))',
    border: BRAND_TOKENS.dark.border,
    text: BRAND_TOKENS.dark.text,
    muted: BRAND_TOKENS.dark.muted,
    accent: BRAND_TOKENS.dark.primary,
    accentSecondary: BRAND_TOKENS.dark.accent,
    badgeBg: 'oklch(0.2801 0.0080 59.3379 / 0.65)',
    divider: 'oklch(0.3359 0.0077 59.4197 / 0.45)',
  },
  light: {
    background: BRAND_TOKENS.light.background,
    overlay:
      'radial-gradient(circle at 12% 18%, oklch(0.5854 0.2041 277.1173 / 0.20), transparent 45%), radial-gradient(circle at 90% 25%, oklch(0.9376 0.0260 321.9388 / 0.30), transparent 60%)',
    cardOverlay:
      'linear-gradient(145deg, oklch(0.9699 0.0013 106.4238 / 0.94), oklch(0.9232 0.0026 48.7171 / 0.85))',
    border: BRAND_TOKENS.light.border,
    text: BRAND_TOKENS.light.text,
    muted: BRAND_TOKENS.light.muted,
    accent: BRAND_TOKENS.light.primary,
    accentSecondary: BRAND_TOKENS.light.accent,
    badgeBg: 'oklch(0.8687 0.0043 56.3660 / 0.85)',
    divider: 'oklch(0.8687 0.0043 56.3660 / 0.6)',
  },
}

const DEFAULT_FOOTER = 'v0hub • GitHub bootstrapper powered by the v0 agent'

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
        boxShadow: '0 40px 120px oklch(0.2244 0.0074 67.4370 / 0.45)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          border: `1px solid ${palette.border}`,
          borderRadius: '32px',
          padding: '48px',
          background: palette.cardOverlay,
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
              letterSpacing: '0.02em',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '24px',
                background: `linear-gradient(140deg, ${palette.accent}, ${palette.accentSecondary})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: BRAND_TOKENS.light.card,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              v0
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                v0hub
              </span>
              <span
                style={{
                  fontSize: '20px',
                  color: palette.muted,
                  fontWeight: 500,
                }}
              >
                GitHub bootstrapper
              </span>
            </div>
          </div>
          {badge ? (
            <div
              style={{
                padding: '12px 24px',
                borderRadius: '999px',
                border: `1px solid ${palette.accent}`,
                color: palette.accent,
                fontSize: '22px',
                fontWeight: 600,
                backgroundColor: palette.badgeBg,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
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
            borderTop: `1px solid ${palette.divider}`,
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
