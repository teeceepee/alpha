
class TreeNode<V> {
  public key: string
  public value: V
  public left: TreeNode<V> | null = null
  public right: TreeNode<V> | null = null

  constructor (key: string, value: V) {
    this.key = key
    this.value = value
  }
}

// Binary search tree
export class BinarySearchTree<V> {
  private root: TreeNode<V> | null = null

  public depth (): number {
    return this.depthRecursively(this.root)
  }

  public get (k: string): V | null {
    return this.getRecursively(this.root, k)
  }

  public add (k: string, v: V): void {
    this.root = this.addRecursively(this.root, k, v)
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

  // return a new node or return the updated `node`
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

    return node
  }
}
