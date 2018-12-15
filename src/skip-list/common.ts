
export const MAX_LEVEL_COUNT = 64

const P = 0.25

// return a random level in [1, max]
export function randomLevel (max: number = MAX_LEVEL_COUNT): number {
  let level = 1

  while (Math.random() < P) {
    level += 1
  }

  return Math.min(level, max)
}
