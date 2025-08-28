// src/utils/timer.js
/**
 * tiny timer helpers for countdowns.
 * We return start and stop wrappers to avoid repeating setInterval everywhere.
 */

/**
 * startCountdown:
 *  - duration (seconds)
 *  - onTick(remainingSeconds)
 *  - onComplete()
 * returns stop() to cancel.
 */
export function startCountdown(duration, onTick, onComplete) {
  let remaining = duration
  onTick(remaining)
  const id = setInterval(() => {
    remaining -= 1
    onTick(Math.max(0, remaining))
    if (remaining <= 0) {
      clearInterval(id)
      onComplete && onComplete()
    }
  }, 1000)
  return () => clearInterval(id)
}
