# Color Usage Guidelines

This document outlines the guidelines for using colors in our application to ensure consistency with the Claymorphism design system.

## Design System Colors

All colors in the application should use the predefined CSS custom properties from our design system. These are defined in `app/globals.css` and include:

### Core Colors
- `--background` / `--foreground` - Main background and text colors
- `--card` / `--card-foreground` - Card component colors
- `--popover` / `--popover-foreground` - Popover component colors
- `--primary` / `--primary-foreground` - Primary brand colors
- `--secondary` / `--secondary-foreground` - Secondary brand colors
- `--muted` / `--muted-foreground` - Muted/disabled state colors
- `--accent` / `--accent-foreground` - Accent/highlight colors
- `--destructive` / `--destructive-foreground` - Error/danger colors
- `--border` - Border colors
- `--input` - Input field colors
- `--ring` - Focus ring colors

### Chart Colors
- `--chart-1` through `--chart-5` - Predefined chart colors

### Sidebar Colors
- `--sidebar` / `--sidebar-foreground`
- `--sidebar-primary` / `--sidebar-primary-foreground`
- `--sidebar-accent` / `--sidebar-accent-foreground`
- `--sidebar-border`
- `--sidebar-ring`

## Usage Guidelines

### 1. Always Use Tailwind Classes

Use Tailwind's color utility classes that reference our design system:

```tsx
// ✅ Good
<div className="bg-primary text-primary-foreground">
  <p className="text-muted-foreground">Subtitle</p>
</div>

// ❌ Bad - hardcoded colors
<div style={{ backgroundColor: '#5854d6' }}>
  <p style={{ color: '#666' }}>Subtitle</p>
</div>
```

### 2. No Hardcoded Colors

Never use hardcoded color values in your code:

```tsx
// ❌ Bad - hardcoded hex colors
<div className="bg-[#5854d6]" />

// ❌ Bad - hardcoded rgb/hsl colors
<div style={{ color: 'rgb(88, 84, 214)' }} />

// ✅ Good - design system colors
<div className="bg-primary" />
```

### 3. Chart Colors

When using the Chart component, use the `createChartConfig` utility:

```tsx
import { createChartConfig } from "@/lib/chart-utils"

// ✅ Good - using design system colors
const chartConfig = createChartConfig({
  desktop: {
    label: "Desktop",
    color: "chart1" // or "primary", "secondary", etc.
  },
  mobile: {
    label: "Mobile",
    color: "chart2"
  }
})

// ❌ Bad - hardcoded colors
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#5854d6"
  }
}
```

### 4. Dynamic Colors

If you need to apply colors dynamically, use CSS custom properties:

```tsx
// ✅ Good - using CSS variables
<div 
  style={{
    backgroundColor: 'var(--primary)',
    color: 'var(--primary-foreground)'
  }}
/>

// ❌ Bad - hardcoded colors
<div 
  style={{
    backgroundColor: props.isPrimary ? '#5854d6' : '#868e96'
  }}
/>
```

### 5. Opacity and Color Modifications

When you need transparency, use Tailwind's opacity modifiers:

```tsx
// ✅ Good
<div className="bg-primary/50" /> // 50% opacity
<div className="text-muted-foreground/70" /> // 70% opacity

// ❌ Bad
<div style={{ backgroundColor: 'rgba(88, 84, 214, 0.5)' }} />
```

### 6. Dark Mode Support

All design system colors automatically adapt to dark mode. Never hardcode different colors for dark mode:

```tsx
// ✅ Good - automatic dark mode support
<div className="bg-background text-foreground" />

// ❌ Bad - manual dark mode handling
<div className={isDark ? 'bg-gray-900' : 'bg-white'} />
```

## ESLint Rules

The project includes ESLint rules that will flag any hardcoded colors:

1. Hex colors (`#ffffff`)
2. RGB/RGBA colors (`rgb(255, 255, 255)`)
3. HSL/HSLA colors (`hsl(0, 0%, 100%)`)
4. Inline style color properties

## Exceptions

The only exceptions to these rules are:
1. The `globals.css` file where design system colors are defined
2. External libraries that require specific color formats (document in code comments)

## Adding New Colors

If you need a new color that doesn't exist in the design system:

1. **Don't** add it directly in your component
2. **Do** discuss with the design team
3. **Do** add it to `globals.css` as a new CSS custom property
4. **Do** ensure it has both light and dark mode variants

## Resources

- [Tailwind CSS Color Documentation](https://tailwindcss.com/docs/customizing-colors)
- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- Design System Colors: `app/globals.css`
- Chart Utils: `lib/chart-utils.ts`