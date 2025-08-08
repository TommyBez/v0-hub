'use client'

import * as React from "react"
import {
  div as MotionDiv,
  a as MotionA,
  button as MotionButton,
  span as MotionSpan,
} from "motion/react-client"

type BaseProps = {
  hoverScale?: number
  tapScale?: number
  initialOpacity?: number
  animateOpacity?: number
  duration?: number
}

type DivProps = BaseProps & { as?: 'div' } & React.ComponentPropsWithoutRef<'div'>

type AnchorProps = BaseProps & { as: 'a' } & React.ComponentPropsWithoutRef<'a'>

type ButtonProps = BaseProps & { as: 'button' } & React.ComponentPropsWithoutRef<'button'>

type SpanProps = BaseProps & { as: 'span' } & React.ComponentPropsWithoutRef<'span'>

export type AnimatedProps = DivProps | AnchorProps | ButtonProps | SpanProps

export function Animated({
  as = "div",
  hoverScale = 1.02,
  tapScale = 0.98,
  initialOpacity = 0,
  animateOpacity = 1,
  duration = 0.2,
  children,
  ...rest
}: AnimatedProps) {
  const Component =
    as === "a"
      ? MotionA
      : as === "button"
        ? MotionButton
        : as === "span"
          ? MotionSpan
          : MotionDiv

  return (
    <Component
      initial={{ opacity: initialOpacity, y: 2 }}
      animate={{ opacity: animateOpacity, y: 0 }}
      transition={{ duration, ease: "easeOut" }}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      {...(rest as any)}
    >
      {children}
    </Component>
  )
}