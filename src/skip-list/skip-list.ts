// https://github.com/antirez/redis/blob/unstable/src/t_zset.c

import { MAX_LEVEL_COUNT, randomLevel } from './common'

class Level<V> {
  public forward: ListNode<V> | null = null
  public span: number = 0
}

class ListNode<V> {
  public score: number
  public value: V | null = null
  public levels: Array<Level<V>>
  // public backward: ListNode<V> | null

  constructor (score: number, value: V | null, levelCount: number) {
    this.score = score
    this.value = value

    this.levels = new Array(levelCount)
    for (let i = 0; i < this.levels.length; i++) {
      this.levels[i] = new Level<V>()
    }
  }
}

export class SkipList<V> {
  private readonly head: ListNode<V>
  // private tail: ListNode<V> | null

  private count: number
  private levelCount: number

  constructor () {
    this.count = 0
    this.levelCount = 1

    this.head = new ListNode<V>(0, null, MAX_LEVEL_COUNT)
    // this.header.backward = null
    // this.tail = null
  }

  public size (): number {
    return this.count
  }

  public level (): number {
    return this.levelCount
  }

  public add (score: number, value: V): void {
    // search path nodes
    const update: Array<ListNode<V>> = new Array(MAX_LEVEL_COUNT)
    //
    const rank: number[] = new Array(MAX_LEVEL_COUNT)

    let current = this.head
    for (let i = this.levelCount - 1; i >= 0; i--) {
      // Store rank that is crossed to reach the insert position
      rank[i] = (i === this.levelCount - 1) ? 0 : rank[i + 1]

      // For values with the same score, the last added value is added in the front
      let forwardNode = current.levels[i].forward
      while (forwardNode && forwardNode.score < score) {
        rank[i] += current.levels[i].span

        current = forwardNode
        forwardNode = current.levels[i].forward
      }

      update[i] = current
    }

    const newLevel = randomLevel()

    if (newLevel > this.levelCount) {
      for (let i = this.levelCount; i < newLevel; i++) {
        rank[i] = 0
        update[i] = this.head
        update[i].levels[i].span = this.count
      }

      this.levelCount = newLevel
    }
    const newNode = new ListNode<V>(score, value, newLevel)

    for (let i = 0; i < newLevel; i++) {
      newNode.levels[i].forward = update[i].levels[i].forward
      update[i].levels[i].forward = newNode

      // Update span covered by update[i] as `newNode` is inserted here
      newNode.levels[i].span = update[i].levels[i].span - (rank[0] - rank[i])
      update[i].levels[i].span = (rank[0] - rank[i]) + 1
    }

    // Increment span for untouched levels
    for (let i = newLevel; i < this.levelCount; i++) {
      update[i].levels[i].span += 1
    }

    this.count += 1
  }

  public findByScore (score: number): V | null {
    let current = this.head

    for (let i = this.levelCount - 1; i >= 0; i--) {
      let forwardNode = current.levels[i].forward
      while (forwardNode && forwardNode.score < score) {
        current = forwardNode
        forwardNode = current.levels[i].forward
      }
    }

    const node = current.levels[0].forward

    if (node && node.score === score) {
      return node.value
    } else {
      return null
    }
  }

  public removeByScore (score: number): V | null {
    const update: Array<ListNode<V>> = new Array(MAX_LEVEL_COUNT)

    let current = this.head
    for (let i = this.levelCount - 1; i >= 0; i--) {
      let forwardNode = current.levels[i].forward
      while (forwardNode && forwardNode.score < score) {
        current = forwardNode
        forwardNode = current.levels[i].forward
      }

      update[i] = current
    }

    const foundNode = current.levels[0].forward

    // Not found
    if (foundNode == null || foundNode.score !== score) {
      return null
    }

    // Remove the `foundNode` from the list
    for (let i = 0; i < this.levelCount; i++) {
      if (update[i].levels[i].forward === foundNode) {
        // Remove the found node
        update[i].levels[i].forward = foundNode.levels[i].forward

        // Reset span to 0 if `forward` is null
        if (update[i].levels[i].forward == null) {
          update[i].levels[i].span = 0
        } else {
          update[i].levels[i].span += foundNode.levels[i].span - 1
        }
      } else {
        update[i].levels[i].span -= 1
      }
    }

    // Decrease list's level
    while (this.levelCount > 1 && this.head.levels[this.levelCount - 1].forward == null) {
      this.levelCount -= 1
    }

    // Decrease list's size
    this.count -= 1

    return foundNode.value
  }

  public forEach (callbackFn: (score: number, value: V, index: number) => void): void {
    let current = this.head
    let i = 0
    while (current.levels[0].forward) {
      const value = current.levels[0].forward.value
      const score = current.levels[0].forward.score

      callbackFn(score, value!, i)

      current = current.levels[0].forward
      i += 1
    }
  }
}
