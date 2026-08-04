import { motion, useReducedMotion } from 'framer-motion'

type LogoProps = {
  showText?: boolean
  className?: string
}

/**
 * Renders the PlanMesh logo with an optional wordmark and custom styling.
 *
 * @param showText - Whether to display the “PlanMesh” wordmark
 * @param className - Additional classes applied to the logo container
 * @returns The rendered logo component
 */
export function Logo({ showText = true, className = '' }: LogoProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <motion.div
        whileHover={shouldReduceMotion ? undefined : { rotate: 6, scale: 1.03 }}
        className="
          relative flex size-10 items-center justify-center overflow-hidden
          rounded-2xl border shadow-sm
          bg-[var(--surface-strong)]
          border-[var(--line)]
          text-[var(--lagoon-deep)]
          ring-1 ring-[var(--inset-glint)]
        "
      >
        <svg viewBox="0 0 100 100" className="size-6" fill="none">
          <path
            d="M25 52L48 25L75 50L50 76L25 52Z"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-70"
          />

          <circle cx="50" cy="50" r="10" fill="currentColor" />
          <circle cx="25" cy="52" r="6.5" fill="currentColor" />
          <circle cx="48" cy="25" r="6.5" fill="currentColor" />
          <circle cx="75" cy="50" r="6.5" fill="currentColor" />
          <circle cx="50" cy="76" r="6.5" fill="currentColor" />
        </svg>

        <motion.span
          className="absolute size-3 rounded-full bg-[var(--lagoon)]/40"
          animate={
            shouldReduceMotion
              ? { opacity: 0 }
              : { scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      </motion.div>

      {showText && (
        <span className="text-lg font-extrabold tracking-tight text-[var(--sea-ink)]">
          Plan<span className="text-[var(--lagoon-deep)]">Mesh</span>
        </span>
      )}
    </span>
  )
}
