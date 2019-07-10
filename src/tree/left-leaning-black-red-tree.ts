import { Stack } from '../stack/linked-list-stack'
import { Comparator } from './comparator'

enum Color {
  Red = 1,
  Black,
}

// Left-leaning red-black tree
class TreeNode<K, V> {
  public key: K
  public value: V
  public color: Color

  public left: TreeNode<K, V> | null = null
  public right: TreeNode<K, V> | null = null

  constructor (key: K, value: V, color: Color = Color.Red) {
    this.key = key
    this.value = value
    this.color = color
  }

  public isRed (): boolean {
    return this.color === Color.Red
  }
}

export class RedBlackTree<K, V> {
  private readonly comparator: Comparator<K>
  private root: TreeNode<K, V> | null

  constructor (comparator: Comparator<K>) {
    this.comparator = comparator
    this.root = null
  }

  public add (k: K, v: V): void {
    this.root = this.addRecursively(this.root, k, v)
    this.root.color = Color.Black
  }

  public depth (): number {
    return this.depthRecursively(this.root)
  }

  public get (k: K): V | null {
    return this.getRecursively(this.root, k)
  }

  public forEach (callbackFn: (value: V) => void): void {
    this.traverseIteratively(callbackFn)
  }

  // recursively
  public forEachR (callbackFn: (value: V) => void): void {
    this.traverseRecursively(this.root, callbackFn)
  }

  private depthRecursively (node: TreeNode<K, V> | null): number {
    if (node == null) {
      return 0
    }

    const leftDepth = this.depthRecursively(node.left)
    const rightDepth = this.depthRecursively(node.right)

    return 1 + Math.max(leftDepth, rightDepth)
  }

  private getRecursively (node: TreeNode<K, V> | null, k: K): V | null {
    if (node == null) {
      return null
    }

    const compareResult: number = this.comparator(k, node.key)

    if (compareResult === 0) {
      return node.value
    } else if (compareResult < 0) {
      return this.getRecursively(node.left, k)
    } else {
      return this.getRecursively(node.right, k)
    }
  }

  private addRecursively (node: TreeNode<K, V> | null, k: K, v: V): TreeNode<K, V> {
    if (node == null) {
      return new TreeNode<K, V>(k, v)
    }

    const compareResult: number = this.comparator(k, node.key)

    if (compareResult === 0) {
      node.value = v
    } else if (compareResult < 0) {
      node.left = this.addRecursively(node.left, k, v)
    } else {
      node.right = this.addRecursively(node.right, k, v)
    }

    // Condition 1
    if (this.isRed(node.right) && !this.isRed(node.left)) {
      node = this.rotateLeft(node)
    }

    // Condition 2
    // `!!node.left && this.isRed(node.left)` is equivalent to `this.isRed(node.left)`. just for strict null checks
    if (!!node.left && this.isRed(node.left) && this.isRed(node.left.left)) {
      node = this.rotateRight(node)
    }

    // Condition 3
    if (this.isRed(node.left) && this.isRed(node.right)) {
      this.flipColors(node)
    }

    return node
  }

  // When the `node` needs rotateLeft, `node.right` must be a red node
  private rotateLeft (node: TreeNode<K, V>): TreeNode<K, V> {
    if (!node.right) {
      throw new Error('`node.right` is null, it must be a red node')
    }

    const newRoot: TreeNode<K, V> = node.right

    node.right = newRoot.left
    newRoot.left = node

    newRoot.color = node.color
    node.color = Color.Red

    return newRoot
  }

  // When the `node` needs rotateRight, `node.left` must be a red node
  private rotateRight (node: TreeNode<K, V>): TreeNode<K, V> {
    if (!node.left) {
      throw new Error('`node.left` is null, it must be a red node')
    }

    const newRoot = node.left

    node.left = newRoot.right
    newRoot.right = node

    newRoot.color = node.color
    node.color = Color.Red

    return newRoot
  }

  // When the `node` needs flipColors, `node.left` and `node.right` must be red nodes
  private flipColors (node: TreeNode<K, V>): void {
    if (!node.left || !node.right) {
      throw new Error('`node.left` and `node.right` must be red nodes')
    }

    node.color = Color.Red
    node.left.color = Color.Black
    node.right.color = Color.Black
  }

  private isRed (node: TreeNode<K, V> | null): boolean {
    return !!node && node.isRed()
  }

  private traverseIteratively (callbackFn: (value: V) => void): void {
    const stack = new Stack<TreeNode<K, V>>()
    let node: TreeNode<K, V> | null = this.root

    do {
      while (node != null) {
        stack.push(node)
        node = node.left
      }

      while (!stack.isEmpty()) {
        const top = stack.pop()

        // for strict null checks
        if (top != null) {
          callbackFn(top.value)

          if (top.right != null) {
            node = top.right
            break
          }
        }
      }
    } while (node != null || !stack.isEmpty())
  }

  private traverseRecursively (node: TreeNode<K, V> | null, callbackFn: (value: V) => void): void {
    if (node == null) {
      return
    }

    this.traverseRecursively(node.left, callbackFn)
    callbackFn(node.value) // in-order traverse
    this.traverseRecursively(node.right, callbackFn)
  }
}
