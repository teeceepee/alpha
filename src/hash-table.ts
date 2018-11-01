
export class HashTable<K, V> {
  private keys: K[]
  private values: V[]
  private count: number

  constructor (private capacity: number = 8) {
    this.keys = new Array(capacity)
    this.values = new Array(capacity)
    this.count = 0
  }

  public size (): number {
    return this.count
  }

  // set(key: K, value: V): void {
  //
  // }
  //
  // get(key: K): V {
  //
  // }
}
