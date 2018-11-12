import { LinkedList } from './singly-linked-list'

describe('LinkedList', () => {
  test('constructor', () => {
    const list = new LinkedList<number>()
    expect(list.size()).toBe(0)
  })

  test('size', () => {
    const list = new LinkedList<number>()

    list.add(10)
    expect(list.size()).toBe(1)

    list.add(20)
    expect(list.size()).toBe(2)

    list.remove(30)
    expect(list.size()).toBe(2)

    list.remove(10)
    expect(list.size()).toBe(1)

    list.remove(20)
    expect(list.size()).toBe(0)

    list.remove(10)
    expect(list.size()).toBe(0)
  })

  test('forEach', () => {
    const list = new LinkedList<number>()
    const min = 0
    const max = 10

    for (let i = min; i <= max; i++) {
      list.add(i)
    }

    list.forEach((value, index) => {
      expect(value + index).toBe(min + max)
    })
  })
})
