import type { ChartConfig } from '@/components/ui/chart'

// Map of design system color variables to their CSS custom property names
export const DESIGN_SYSTEM_COLORS = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  accent: 'var(--accent)',
  destructive: 'var(--destructive)',
  muted: 'var(--muted)',
  card: 'var(--card)',
  popover: 'var(--popover)',
  border: 'var(--border)',
  chart1: 'var(--chart-1)',
  chart2: 'var(--chart-2)',
  chart3: 'var(--chart-3)',
  chart4: 'var(--chart-4)',
  chart5: 'var(--chart-5)',
} as const

export type DesignSystemColor = keyof typeof DESIGN_SYSTEM_COLORS

/**
 * Creates a chart configuration using only design system colors
 * @param config - Chart configuration with design system color keys
 * @returns ChartConfig with proper color values
 */
export function createChartConfig(
  config: Record<
    string,
    {
      label?: React.ReactNode
      icon?: React.ComponentType
      color: DesignSystemColor
    }
  >,
): ChartConfig {
  const chartConfig: ChartConfig = {}

  for (const [key, value] of Object.entries(config)) {
    chartConfig[key] = {
      label: value.label,
      icon: value.icon,
      color: DESIGN_SYSTEM_COLORS[value.color],
    }
  }

  return chartConfig
}

/**
 * Example usage:
 *
 * const chartConfig = createChartConfig({
 *   desktop: {
 *     label: "Desktop",
 *     color: "primary"
 *   },
 *   mobile: {
 *     label: "Mobile",
 *     color: "secondary"
 *   }
 * })
 */
