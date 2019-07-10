import { Comparator } from './comparator'
import { RedBlackTree } from './left-leaning-black-red-tree'

const stringCompare: Comparator<string> = (a: string, b: string): number => {
  return a.localeCompare(b)
}

describe('left-leaning RedBlackTree', () => {
  test('constructor', () => {
    const tree = new RedBlackTree(stringCompare)

    expect(tree.depth()).toBe(0)

    const count = 3
    const keys = new Array(count)

    for (let i = 0; i < count; i++) {
      keys[i] = Math.random().toString(26).substring(7)

      tree.add(keys[i], keys[i])
    }

    expect(tree.depth()).toBe(2)
  })

  test('add randomly', () => {
    const tree = new RedBlackTree<string, string>(stringCompare)

    const count = 10000
    const keys = new Array(count)

    for (let i = 0; i < count; i++) {
      keys[i] = Math.random().toString(26).substring(7)

      tree.add(keys[i], keys[i])
    }

    for (let i = 0; i < count; i++) {
      expect(tree.get(keys[i])).toBe(keys[i])
    }
  })

  test('forEach', () => {
    const tree = new RedBlackTree<string, string>(stringCompare)

    const count = 100
    const keys = new Array(count)

    for (let i = 0; i < count; i++) {
      keys[i] = i.toString()

      tree.add(keys[i], keys[i])
    }

    const sorted = keys.sort()

    let index = 0

    tree.forEach((v) => {
      expect(v).toBe(sorted[index])

      index += 1
    })
  })

  test('forEachR', () => {
    const tree = new RedBlackTree<string, string>(stringCompare)

    const count = 100
    const keys = new Array(count)

    for (let i = 0; i < count; i++) {
      keys[i] = i.toString()

      tree.add(keys[i], keys[i])
    }

    const sorted = keys.sort()

    let index = 0

    tree.forEachR((v) => {
      expect(v).toBe(sorted[index])

      index += 1
    })
  })

  test('number as key', () => {
    const tree = new RedBlackTree<number, string>((a, b) => a - b)

    tree.add(10, 'V1')
    tree.add(100, 'V4')
    tree.add(1000, 'V3')

    const key = 1
    const value = 'A'

    tree.add(key, value)
    expect(tree.get(key)).toBe(value)
  })
})
