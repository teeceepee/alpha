import { LinkedList } from './singly-linked-list'

describe('LinkedList', () => {
  test('constructor', () => {
    const list = new LinkedList<number>()
    expect(list.size()).toBe(0)
    expect(list.isEmpty()).toBe(true)
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

  test('findBy', () => {
    const list = new LinkedList<number>()
    const num = 1
    list.add(num)

    const found = list.findBy((n) => n === num)

    expect(found).toBe(num)

    expect(list.findBy((n) => n === 2)).toBeNull()
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

  test('removeFirst', () => {
    const list = new LinkedList<number>()

    list.addFirst(10)
    list.addFirst(20)

    const v = list.removeFirst()
    expect(v).toBe(20)
  })
})
