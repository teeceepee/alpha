import { Bag } from './linked-list-bag'

describe('LinkedList', () => {
  test('constructor', () => {
    const bag = new Bag<number>()

    expect(bag.size()).toBe(0)
    expect(bag.isEmpty()).toBe(true)
  })

  test('size', () => {
    const bag = new Bag<number>()

    bag.add(10)
    expect(bag.size()).toBe(1)

    bag.add(20)
    expect(bag.size()).toBe(2)

    bag.add(10)
    expect(bag.size()).toBe(2)

    bag.remove(20)
    expect(bag.size()).toBe(1)

    bag.remove(20)
    expect(bag.size()).toBe(1)

    bag.remove((10))
    expect(bag.size()).toBe(0)
  })

  test('contains', () => {
    const bag = new Bag<number>()
    const min = 0
    const max = 100

    for (let i = min; i <= max; i++) {
      bag.add(i)
    }

    for (let i = min; i <= max; i++) {
      expect(bag.contains(i)).toBe(true)
    }
  })

  test('forEach', () => {
    const bag = new Bag<number>()
    const min = 0
    const max = 100

    for (let i = min; i <= max; i++) {
      bag.add(i)
    }

    let count = 0
    bag.forEach((value) => {
      count += 1

      expect(bag.contains(value)).toBe(true)
    })

    expect(count).toBe(max - min + 1)
  })
})
