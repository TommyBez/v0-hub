'use client'

import {
  a as MotionA,
  button as MotionButton,
  div as MotionDiv,
  span as MotionSpan,
} from 'motion/react-client'
import type * as React from 'react'

type BaseProps = {
  hoverScale?: number
  tapScale?: number
  initialOpacity?: number
  animateOpacity?: number
  duration?: number
}

type DivProps = BaseProps & {
  as?: 'div'
} & React.ComponentPropsWithoutRef<'div'>

type AnchorProps = BaseProps & { as: 'a' } & React.ComponentPropsWithoutRef<'a'>

type ButtonProps = BaseProps & {
  as: 'button'
} & React.ComponentPropsWithoutRef<'button'>

type SpanProps = BaseProps & {
  as: 'span'
} & React.ComponentPropsWithoutRef<'span'>

export type AnimatedProps = DivProps | AnchorProps | ButtonProps | SpanProps

export function Animated({
  as = 'div',
  hoverScale = 1.02,
  tapScale = 0.98,
  initialOpacity = 0,
  animateOpacity = 1,
  duration = 0.2,
  children,
  ...rest
}: AnimatedProps) {
  let Component:
    | typeof MotionDiv
    | typeof MotionA
    | typeof MotionButton
    | typeof MotionSpan

  if (as === 'a') {
    Component = MotionA
  } else if (as === 'button') {
    Component = MotionButton
  } else if (as === 'span') {
    Component = MotionSpan
  } else {
    Component = MotionDiv
  }

  return (
    <Component
      animate={{ opacity: animateOpacity, y: 0 }}
      initial={{ opacity: initialOpacity, y: 2 }}
      transition={{ duration, ease: 'easeOut' }}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Component>
  )
}
