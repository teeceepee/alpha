
export class HashTable<K, V> {
  private keys: Array<K>
  private values: Array<V>
  private _size: number

  constructor(private capacity: number = 8) {
    this.keys = new Array(capacity)
    this.values = new Array(capacity)
    this._size = 0
  }

  size(): number {
    return this._size
  }

  // set(key: K, value: V): void {
  //
  // }
  //
  // get(key: K): V {
  //
  // }
}
