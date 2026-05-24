export const CHART_COLORS = {
  primary: 'oklch(0.75 0.15 195)',
  secondary: 'oklch(0.65 0.18 280)',
  success: 'oklch(0.72 0.19 155)',
  warning: 'oklch(0.8 0.18 85)',
  muted: 'oklch(0.5 0.01 265)',
  grid: 'oklch(0.25 0.02 265 / 0.5)',
  tooltipBg: 'oklch(0.12 0.015 265 / 0.95)',
  tooltipBorder: 'oklch(0.75 0.15 195 / 0.2)',
} as const

export const chartAnimation = {
  isAnimationActive: true,
  animationDuration: 1200,
  animationEasing: 'ease-out' as const,
}

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: CHART_COLORS.tooltipBg,
    border: `1px solid ${CHART_COLORS.tooltipBorder}`,
    borderRadius: '10px',
    fontSize: '12px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px oklch(0 0 0 / 0.4)',
  },
  labelStyle: { color: 'oklch(0.75 0.15 195)' },
  cursor: { stroke: CHART_COLORS.primary, strokeWidth: 1, strokeDasharray: '4 4' },
}

export const axisProps = {
  stroke: CHART_COLORS.muted,
  fontSize: 11,
  tickLine: false as const,
  axisLine: false as const,
}
