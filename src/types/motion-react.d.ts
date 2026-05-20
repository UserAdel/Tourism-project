declare module 'motion/react' {
  import type { ComponentType, PropsWithChildren } from 'react'

  type MotionComponent = ComponentType<Record<string, unknown>>

  export const motion: Record<string, MotionComponent>
  export function AnimatePresence(props: PropsWithChildren): JSX.Element
}
