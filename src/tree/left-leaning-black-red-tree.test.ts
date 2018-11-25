import { RedBlackTree } from './left-leaning-black-red-tree'

describe('left-leaning RedBlackTree', () => {
  test('constructor', () => {
    const tree = new RedBlackTree()

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
    const tree = new RedBlackTree<string>()

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
})
