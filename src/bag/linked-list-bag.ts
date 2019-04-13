import { LinkedList } from '../linked-list/singly-linked-list'

export class Bag<T> {
  private list: LinkedList<T>

  constructor () {
    this.list = new LinkedList<T>()
  }

  public size (): number {
    return this.list.size()
  }

  public isEmpty (): boolean {
    return this.list.isEmpty()
  }

  public contains (value: T): boolean {
    let found = false
    this.list.forEach((v) => {
      if (found) {
        return
      }

      if (v === value) {
        found = true
      }
    })

    return found
  }

  public add (value: T): void {
    if (!this.contains(value)) {
      this.list.addLast(value)
    }
  }

  public remove (value: T): void {
    this.list.remove(value)
  }

  public forEach (callbackFn: (value: T, index: number) => void): void {
    this.list.forEach(callbackFn)
  }
}
