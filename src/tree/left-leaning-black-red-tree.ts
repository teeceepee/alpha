
enum Color {
  Red = 1,
  Black,
}

// Left-leaning red-black tree
class TreeNode<V> {
  public key: string
  public value: V
  public color: Color

  public left: TreeNode<V> | null = null
  public right: TreeNode<V> | null = null

  constructor (key: string, value: V, color: Color = Color.Red) {
    this.key = key
    this.value = value
    this.color = color
  }

  public isRed (): boolean {
    return this.color === Color.Red
  }
}

export class RedBlackTree<V> {
  private root: TreeNode<V> | null = null

  public add (k: string, v: V): void {
    this.root = this.addRecursively(this.root, k, v)
    this.root.color = Color.Black
  }

  public depth (): number {
    return this.depthRecursively(this.root)
  }

  public get (k: string): V | null {
    return this.getRecursively(this.root, k)
  }

  private depthRecursively (node: TreeNode<V> | null): number {
    if (node == null) {
      return 0
    }

    const leftDepth = this.depthRecursively(node.left)
    const rightDepth = this.depthRecursively(node.right)

    return 1 + Math.max(leftDepth, rightDepth)
  }

  private getRecursively (node: TreeNode<V> | null, k: string): V | null {
    if (node == null) {
      return null
    }

    const compareResult: number = k.localeCompare(node.key)

    if (compareResult === 0) {
      return node.value
    } else if (compareResult < 0) {
      return this.getRecursively(node.left, k)
    } else {
      return this.getRecursively(node.right, k)
    }
  }

  private addRecursively (node: TreeNode<V> | null, k: string, v: V): TreeNode<V> {
    if (node == null) {
      return new TreeNode<V>(k, v)
    }

    const compareResult: number = k.localeCompare(node.key)

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
  private rotateLeft (node: TreeNode<V>): TreeNode<V> {
    if (!node.right) {
      throw new Error('`node.right` is null, it must be a red node')
    }

    const newRoot: TreeNode<V> = node.right

    node.right = newRoot.left
    newRoot.left = node

    newRoot.color = node.color
    node.color = Color.Red

    return newRoot
  }

  // When the `node` needs rotateRight, `node.left` must be a red node
  private rotateRight (node: TreeNode<V>): TreeNode<V> {
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
  private flipColors (node: TreeNode<V>): void {
    if (!node.left || !node.right) {
      throw new Error('`node.left` and `node.right` must be red nodes')
    }

    node.color = Color.Red
    node.left.color = Color.Black
    node.right.color = Color.Black
  }

  private isRed (node: TreeNode<V> | null): boolean {
    return !!node && node.isRed()
  }
}
