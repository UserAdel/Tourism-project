import { createElement, forwardRef, type PropsWithChildren, type ReactNode } from 'react'

type MotionProps = Record<string, unknown> & {
  children?: ReactNode
  className?: string
}

const motionOnlyProps = new Set([
  'animate',
  'exit',
  'initial',
  'layout',
  'transition',
  'variants',
  'viewport',
  'whileFocus',
  'whileHover',
  'whileInView',
  'whileTap',
])

function createMotionElement(tag: string) {
  return forwardRef<HTMLElement, MotionProps>(function MotionElement(props, ref) {
    const domProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !motionOnlyProps.has(key)),
    )

    return createElement(tag, { ...domProps, ref })
  })
}

type MotionFactory = Record<string, ReturnType<typeof createMotionElement>>

export const motion = new Proxy({} as MotionFactory, {
  get(target, tag: string) {
    target[tag] ??= createMotionElement(tag)
    return target[tag]
  },
})

export function AnimatePresence({ children }: PropsWithChildren) {
  return <>{children}</>
}
