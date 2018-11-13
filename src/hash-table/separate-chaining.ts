import { LinkedList } from '../linked-list/singly-linked-list'
import { stringHash } from './common'

class Entry<V> {
  constructor (public key: string, public value: V) {
  }
}

export class HashTable<V> {
  public static initialBucketNum = 16

  private buckets: Array<LinkedList<Entry<V>>>
  private count: number

  constructor () {
      this.buckets = new Array(HashTable.initialBucketNum)
      this.count = 0
  }

  public size () {
    return this.count
  }

  public set (key: string, value: V): void {
    if (this.needResizing()) {
      throw(new Error('Need resizing')) // TODO
    }

    const bucket = this.hash(key) % this.buckets.length

    if (!this.buckets[bucket]) {
      this.buckets[bucket] = new LinkedList<Entry<V>>()
    }

    this.buckets[bucket].add(new Entry<V>(key, value))
    this.count = this.count + 1
  }

  public get (key: string): V | null {
    const bucket = this.hash(key) % this.buckets.length

    if (!this.buckets[bucket]) {
      return null
    }

    const found = this.buckets[bucket].findBy((entry) => entry.key === key)

    return found && found.value
  }

  public remove (key: string): void {
    const bucket = this.hash(key) % this.buckets.length

    if (!this.buckets[bucket]) {
      return
    }

    this.buckets[bucket].removeBy((entry: Entry<V>) => key === entry.key)
  }

  private needResizing (): boolean {
      return false
  }

  private hash (key: string): number {
      return stringHash(key)
  }
}
