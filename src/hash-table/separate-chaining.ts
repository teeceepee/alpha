import { LinkedList } from '../linked-list/singly-linked-list'
import { stringHash } from './common'

class Entry<V> {
  constructor (public key: string, public value: V) {
  }
}

export class HashTable<V> {
  private static readonly initialCapacity = 16
  private static readonly loadFactorThreshold: number = 0.75

  private buckets: Array<LinkedList<Entry<V>>>
  private capacity: number
  private count: number

  constructor (capacity: number = HashTable.initialCapacity) {
    this.init(capacity)
  }

  public size () {
    return this.count
  }

  public set (key: string, value: V): void {
    if (this.needResizing()) {
      this.resize()
    }

    const bucket = this.hash(key) % this.capacity

    if (!this.buckets[bucket]) {
      this.buckets[bucket] = new LinkedList<Entry<V>>()
    }

    this.buckets[bucket].add(new Entry<V>(key, value))
    this.count = this.count + 1
  }

  public get (key: string): V | null {
    const bucket = this.hash(key) % this.capacity

    if (!this.buckets[bucket]) {
      return null
    }

    const found = this.buckets[bucket].findBy((entry) => entry.key === key)

    return found && found.value
  }

  public remove (key: string): void {
    const bucket = this.hash(key) % this.capacity

    if (!this.buckets[bucket]) {
      return
    }

    this.buckets[bucket].removeBy((entry: Entry<V>) => key === entry.key)
  }

  private needResizing (): boolean {
    return this.size() / this.capacity >= HashTable.loadFactorThreshold
  }

  private resize (): void {
    const oldCap = this.capacity
    const oldBuckets = this.buckets

    // Initialize a new table
    this.init(oldCap * 2)

    // Traverse the old table, add each entry to the new table
    for (let i = 0; i < oldCap; i++) {
      if (oldBuckets[i]) {
        oldBuckets[i].forEach((entry: Entry<V>) => {
          this.set(entry.key, entry.value)
        })
      }
    }
  }

  private init (capacity: number): void {
    this.capacity = capacity
    this.buckets = new Array(capacity)
    this.count = 0
  }

  private hash (key: string): number {
      return stringHash(key)
  }
}
