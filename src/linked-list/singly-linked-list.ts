
class ListHead<V> {
  public next: ListNode<V> | null = null
}

class ListNode<V> {
  public value: V
  public next: ListNode<V> | null = null

  constructor (v: V) {
    this.value = v
  }
}

// Singly linked list
export class LinkedList<V> {
  private readonly head: ListHead<V>

  constructor () {
    this.head = new ListHead<V>()
  }

  public size (): number {
    let count = 0
    let current = this.head.next

    while (current) {
      count = count + 1
      current = current.next
    }

    return count
  }

  public findBy (predicateFn: (v: V) => boolean): V | null {
    let current = this.head.next
    let i = 0

    while (current) {
      const currentValue: V = current.value

      if (predicateFn(currentValue)) {
        return currentValue
      }

      current = current.next
      i = i + 1
    }

    return null
  }

  // Add value in list head
  public add (value: V): void {
    const node = new ListNode<V>(value)

    node.next = this.head.next
    this.head.next = node
  }

  public removeBy (predicateFn: (v: V) => boolean): void {
    let prev = this.head
    let current = prev.next

    while (current) {
      if (predicateFn(current.value)) {
        prev.next = current.next
      }

      prev = current
      current = current.next
    }
  }

  public remove (value: V): void {
    this.removeBy((v: V) => v === value)
  }

  public forEach (callbackFn: (value: V, index: number) => void): void {
    let current = this.head.next
    let i = 0

    while (current) {
      callbackFn(current.value, i)

      current = current.next
      i = i + 1
    }
  }

  public isEmpty (): boolean {
    return !this.head.next
  }

  public addFirst (value: V): void {
    this.add(value)
  }

  public removeFirst (): V | null {
    // just for strict null checks
    if (!this.head.next) {
      return null
    }

    const firstNode: ListNode<V> = this.head.next

    // remove the first node
    this.head.next = firstNode.next

    return firstNode.value
  }
}
