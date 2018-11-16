import { linearProbing, pseudoRandomProbing, stringHash } from './common'

// Open addressing hash table
export class HashTable<V> {
  private static readonly initialCapacity: number = 16
  private static readonly loadFactorThreshold: number = 0.75

  private keys: Array<string | null>
  private values: Array<V | null>
  private capacity: number
  private count: number

  constructor (capacity: number = HashTable.initialCapacity) {
    this.init(capacity)
  }

  public size (): number {
    return this.count
  }

  public set (key: string, value: V): void {
    if (this.needResizing()) {
      this.resize()
    }

    let bucket = this.hash(key) % this.capacity

    for (let i = 0; i < this.capacity; i++) {
      if (!this.keys[bucket] || this.keys[bucket] === key) {
        this.keys[bucket] = key
        this.values[bucket] = value
        this.count = this.count + 1
        return
      }

      bucket = this.probing(bucket)
    }
  }

  public get (key: string): V | null {
    let bucket = this.hash(key) % this.capacity

    for (let i = 0; i < this.capacity; i++) {
      if (this.keys[bucket] && this.keys[bucket] === key) {
        return this.values[bucket]
      }

      bucket = this.probing(bucket)
    }

    return null
  }

  public remove (key: string): void {
    let bucket = this.hash(key) % this.capacity

    for (let i = 0; i < this.capacity; i++) {
      if (this.keys[bucket] && this.keys[bucket] === key) {
        this.keys[bucket] = null
        this.values[bucket] = null
        this.count = this.count - 1
        return
      }

      bucket = this.probing(bucket)
    }
  }

  private needResizing (): boolean {
    return this.size() / this.capacity >= HashTable.loadFactorThreshold
  }

  private resize (): void {
    const oldCap = this.capacity
    const oldKeys = this.keys
    const oldValues = this.values

    // Initialize a new table
    this.init(oldCap * 2)

    // Traverse the old table, add each entry to the new table
    for (let i = 0; i < oldCap; i++) {
      const k = oldKeys[i]
      const v = oldValues[i]

      if (k != null && v != null) {
        this.set(k, v)
      }
    }
  }

  private init (capacity: number): void {
    this.keys = new Array(capacity)
    this.values = new Array(capacity)
    this.capacity = capacity
    this.count = 0
  }

  private hash (key: string): number {
    return stringHash(key)
  }

  private probing (bucket: number): number {
    return this.pseudoRandomProbing(bucket)
    // return this.linearProbing(bucket)
  }

  private linearProbing (bucket: number): number {
    return linearProbing(bucket, this.capacity)
  }

  private pseudoRandomProbing (bucket: number): number {
    return pseudoRandomProbing(bucket, this.capacity)
  }
}
