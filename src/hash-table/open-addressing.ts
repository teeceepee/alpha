import { linearProbing, pseudoRandomProbing, stringHash } from './common'

// Open addressing hash table
export class HashTable<V> {
  private keys: Array<string | null>
  private values: Array<V | null>
  private count: number

  constructor (private capacity: number = 16) {
    this.keys = new Array(capacity)
    this.values = new Array(capacity)
    this.count = 0
  }

  public size (): number {
    return this.count
  }

  public set (key: string, value: V): void {
    if (this.needResizing()) {
      throw(new Error('Need rehash')) // TODO
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
    return false
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
