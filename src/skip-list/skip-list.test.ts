import { SkipList } from './skip-list'

describe('SkipList', () => {
  test('constructor', () => {
    const skipList = new SkipList<string>()

    expect(skipList.level()).toBe(1)
  })

  test('findByScore', () => {
    const skipList = new SkipList<string>()
    const n = 1000

    for (let i = 0; i < n; i++) {
      skipList.add(i, i.toString())
    }

    for (let i = 0; i < n; i++) {
      expect(skipList.findByScore(i)).toBe(i.toString())
    }
  })

  test('forEach', () => {
    const skipList = new SkipList<string>()

    const entries = [
      {
        score: 1,
        value: '1',
      },
      {
        score: 20,
        value: '20',
      },
      {
        score: 3000,
        value: '3000',
      },
    ]

    for (const entry of entries) {
      skipList.add(entry.score, entry.value)
    }

    skipList.forEach((score, value, index) => {
      const entry = entries[index]

      expect(score).toBe(entry.score)
      expect(value).toBe(entry.value)
    })
  })

  test('values with same score', () => {
    const skipList = new SkipList<string>()
    const values = ['a', 'b', 'c']
    const reversed = ['c', 'b', 'a']

    for (const value of values) {
      skipList.add(1, value)
    }

    skipList.forEach((score, value, index) => {
      expect(value).toBe(reversed[index])
    })
  })

  test('removeByScore', () => {
    const skipList = new SkipList<string>()
    const n = 1000

    for (let i = 1; i <= n; i++) {
      const score = i
      skipList.add(score, score.toString())
    }

    for (let i = 1; i <= n; i++) {
      const score = i
      const removedValue = skipList.removeByScore(score)
      expect(removedValue).toBe(score.toString())
    }

    expect(skipList.size()).toBe(0)
    expect(skipList.level()).toBe(1)
  })
})
