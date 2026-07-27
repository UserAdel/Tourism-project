import { useEffect, useLayoutEffect, useRef } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import FloatingWhatsApp from './FloatingWhatsApp'

const REVEAL_SELECTOR = '[data-reveal]'
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const

export default function PublicMotionLayout() {
  const location = useLocation()
  const siteRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, location.search])

  useEffect(() => {
    const site = siteRef.current
    if (!site) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pendingElements = new Set<HTMLElement>()
    let revealFrame = 0
    const revealObserver = reducedMotion || !('IntersectionObserver' in window)
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              entry.target.classList.add('is-revealed')
              revealObserver?.unobserve(entry.target)
              pendingElements.delete(entry.target as HTMLElement)
            })
          },
          { rootMargin: '0px 0px -5% 0px', threshold: 0.08 },
        )

    const revealVisibleElements = () => {
      pendingElements.forEach((element) => {
        if (element.classList.contains('is-revealed')) return
        const bounds = element.getBoundingClientRect()
        if (bounds.bottom < 0 || bounds.top > window.innerHeight * 0.92) return
        element.classList.add('is-revealed')
        revealObserver?.unobserve(element)
        pendingElements.delete(element)
      })
    }

    const scheduleVisibleCheck = () => {
      window.cancelAnimationFrame(revealFrame)
      revealFrame = window.requestAnimationFrame(revealVisibleElements)
    }

    const prepareAnimations = () => {
      site.querySelectorAll<HTMLElement>('[data-stagger]').forEach((container) => {
        const step = Number(container.dataset.staggerStep ?? 70)
        Array.from(container.children).forEach((child, index) => {
          if (!(child instanceof HTMLElement)) return
          if (!child.dataset.reveal) child.dataset.reveal = 'up'
          if (!child.dataset.revealDelay) {
            child.style.setProperty('--reveal-delay', `${Math.min(index * step, 360)}ms`)
          }
        })
      })

      site.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
        if (!element.classList.contains('reveal-ready')) {
          if (element.dataset.revealDelay) {
            element.style.setProperty('--reveal-delay', `${element.dataset.revealDelay}ms`)
          }
          element.classList.add('reveal-ready')
        }

        if (element.classList.contains('is-revealed')) return
        pendingElements.add(element)

        if (reducedMotion) {
          element.classList.add('is-revealed')
          pendingElements.delete(element)
        } else if (revealObserver) {
          revealObserver?.observe(element)
        } else {
          element.classList.add('is-revealed')
          pendingElements.delete(element)
        }
      })

      site.classList.add('motion-ready')
      scheduleVisibleCheck()
    }

    prepareAnimations()
    const mutationObserver = new MutationObserver(prepareAnimations)
    mutationObserver.observe(site, { childList: true, subtree: true })
    window.addEventListener('scroll', scheduleVisibleCheck, { passive: true })
    window.addEventListener('resize', scheduleVisibleCheck)

    return () => {
      window.cancelAnimationFrame(revealFrame)
      window.removeEventListener('scroll', scheduleVisibleCheck)
      window.removeEventListener('resize', scheduleVisibleCheck)
      mutationObserver.disconnect()
      revealObserver?.disconnect()
      pendingElements.clear()
    }
  }, [location.key])

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.82, ease: SMOOTH_EASE }}
    >
      <div
        ref={siteRef}
        className="public-site min-h-screen flex flex-col bg-background text-foreground"
      >
        <Header />
        <main className="flex-1">
          <motion.div
            key={location.key}
            className="public-page-route"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, ease: SMOOTH_EASE }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </MotionConfig>
  )
}
