import { BinarySearchTree } from './binary-search-tree'
import { Comparator } from './comparator'

const stringCompare: Comparator<string> = (a: string, b: string): number => {
  return a.localeCompare(b)
}

describe('BinarySearchTree', () => {
  test('depth', () => {
    const tree = new BinarySearchTree<string, string>(stringCompare)

    expect(tree.depth()).toBe(0)

    tree.add('a', '1')

    expect(tree.depth()).toBe(1)
  })

  test('add get', () => {
    const tree = new BinarySearchTree<string, string>(stringCompare)
    const key = 'a'
    const value = 'A'

    tree.add(key, value)
    expect(tree.get(key)).toBe(value)
  })

  test('add randomly', () => {
    const tree = new BinarySearchTree<string, string>(stringCompare)

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

  test('removeMin', () => {
    const tree = new BinarySearchTree<string, string>(stringCompare)
    const key = 'a'
    const value = 'A'

    tree.add(key, value)
    tree.add('b', 'B')
    tree.add('c', 'C')
    const removed = tree.removeMin()

    expect(removed).toBe(value)
  })

  test('remove', () => {
    const tree = new BinarySearchTree<string, string>(stringCompare)
    const key = 'a'
    const value = 'A'

    const count = 100
    const keys = new Array(count)

    for (let i = 0; i < count; i++) {
      keys[i] = Math.random().toString(26).substring(7)

      tree.add(keys[i], keys[i])
    }
    tree.add(key, value)

    const removed = tree.remove('a')

    expect(removed).toBe(value)
  })

  test('number as key', () => {
    const tree = new BinarySearchTree<number, string>((a, b) => a - b)

    tree.add(10, 'V1')
    tree.add(100, 'V4')
    tree.add(1000, 'V3')

    const key = 1
    const value = 'A'

    tree.add(key, value)
    expect(tree.get(key)).toBe(value)
  })
})
