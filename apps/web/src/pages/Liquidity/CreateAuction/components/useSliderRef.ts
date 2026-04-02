import { useCallback, useEffect, useRef } from 'react'

interface UseSliderRefOptions {
  onSelectPercent: (pct: number) => void
  min: number
  max: number
  // Maps full slider width to this range (defaults to 100, meaning 0–100%).
  // Use a custom scale when the slider's maximum is less than 100 (e.g. constrained auction supply).
  scale?: number
  // Snap increment (defaults to 1). Use 0.5 for half-percent steps, etc.
  step?: number
}

export function useSliderRef({ onSelectPercent, min, max, scale = 100, step = 1 }: UseSliderRefOptions) {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const isDragging = useRef(false)
  const onSelectPercentRef = useRef(onSelectPercent)
  onSelectPercentRef.current = onSelectPercent

  const getPercentFromClientX = useCallback(
    (clientX: number, el: HTMLDivElement): number => {
      const rect = el.getBoundingClientRect()
      const x = clientX - rect.left
      const raw = Math.round(((x / rect.width) * scale) / step) * step
      return Math.max(min, Math.min(max, raw))
    },
    [min, max, scale, step],
  )

  useEffect(() => {
    const el = sliderRef.current
    if (!el) {
      return undefined
    }

    const onPointerDown = (e: PointerEvent): void => {
      isDragging.current = true
      el.setPointerCapture(e.pointerId)
      onSelectPercentRef.current(getPercentFromClientX(e.clientX, el))
    }

    const onPointerMove = (e: PointerEvent): void => {
      if (!isDragging.current) {
        return
      }
      onSelectPercentRef.current(getPercentFromClientX(e.clientX, el))
    }

    const onPointerUp = (): void => {
      isDragging.current = false
    }

    const onPointerCancel = (): void => {
      isDragging.current = false
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerCancel)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerCancel)
    }
  }, [getPercentFromClientX])

  return sliderRef
}
