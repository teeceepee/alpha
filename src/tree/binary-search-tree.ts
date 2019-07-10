import { Comparator } from './comparator'

class TreeNode<K, V> {
  public key: K
  public value: V
  public left: TreeNode<K, V> | null = null
  public right: TreeNode<K, V> | null = null

  constructor (key: K, value: V) {
    this.key = key
    this.value = value
  }
}

interface RemoveResult<K, V> {
  newRoot: TreeNode<K, V> | null
  removedNode: TreeNode<K, V> | null
}

/**
 * Binary search tree
 */
export class BinarySearchTree<K, V> {
  private readonly comparator: Comparator<K>
  private root: TreeNode<K, V> | null

  constructor (comparator: Comparator<K>) {
    this.comparator = comparator
    this.root = null
  }

  public depth (): number {
    return this.depthRecursively(this.root)
  }

  public get (k: K): V | null {
    return this.getRecursively(this.root, k)
  }

  public add (k: K, v: V): void {
    this.root = this.addRecursively(this.root, k, v)
  }

  // remove the minimum value from the tree
  public removeMin (): V | null {
    const { newRoot, removedNode } = this.removeMinRecursively(this.root)

    this.root = newRoot
    return removedNode ? removedNode.value : null
  }

  public remove (k: K): V | null {
    const { newRoot, removedNode } = this.removeRecursively(this.root, k)
    this.root = newRoot
    return removedNode ? removedNode.value : null
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

  // return a new node or return the updated `node`
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

    return node
  }

  // return null or return the updated `node`
  private removeMinRecursively (node: TreeNode<K, V> | null): RemoveResult<K, V> {
    if (node == null) {
      return {newRoot: null, removedNode: null}
    }

    if (node.left == null) {
      return {newRoot: node.right, removedNode: node}
    } else {
      const { newRoot, removedNode } = this.removeMinRecursively(node.left)
      node.left = newRoot

      return {newRoot: node, removedNode}
    }
  }

  private removeRecursively (node: TreeNode<K, V> | null, k: K): RemoveResult<K, V> {
    if (node == null) {
      return {newRoot: null, removedNode: null}
    }

    const compareResult: number = this.comparator(k, node.key)

    if (compareResult === 0) {
      const removeResult = this.removeMinRecursively(node.right)
      const newNode = removeResult.removedNode
      const newRight = removeResult.newRoot

      let newRoot
      if (newNode == null) {
        newRoot = node.left
      } else {
        newNode.left = node.left
        newNode.right = newRight

        newRoot = newNode
      }

      return {newRoot, removedNode: node}
    } else if (compareResult < 0) {
      const { newRoot, removedNode } = this.removeRecursively(node.left, k)
      node.left = newRoot
      return {newRoot: node, removedNode}
    } else {
      const { newRoot, removedNode} = this.removeRecursively(node.right, k)
      node.right = newRoot
      return {newRoot: node, removedNode}
    }
  }
}
