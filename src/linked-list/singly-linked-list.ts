
class ListNode<V> {
  public value: V
  public next: ListNode<V> | null = null

  constructor (v: V) {
    this.value = v
  }
}

// Singly linked list
export class LinkedList<V> {
  private head: ListNode<V> | null
  private tail: ListNode<V> | null

  constructor () {
    this.head = null
    this.tail = null
  }

  public size (): number {
    let count = 0
    let current = this.head

    while (current) {
      count = count + 1
      current = current.next
    }

    return count
  }

  public findBy (predicateFn: (v: V) => boolean): V | null {
    let current = this.head
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
  public addFirst (value: V): void {
    const node = new ListNode<V>(value)

    // if the list is empty, the new node should be tail
    if (this.isEmpty()) {
      this.tail = node
    }

    node.next = this.head
    this.head = node
  }

  // Add value in list tail
  public addLast (value: V): void {
    const node = new ListNode<V>(value)

    if (this.tail == null) {
      this.head = node
    } else {
      this.tail.next = node
    }

    this.tail = node
  }

  public removeBy (predicateFn: (v: V) => boolean): void {
    if (this.head == null) {
      return
    }

    let prev: ListNode<V> | null = null
    let current: ListNode<V> | null = this.head

    while (current) {
      if (predicateFn(current.value)) {
        if (current.next == null) {
          this.tail = prev
        }

        if (prev == null) {
          this.head = current.next
        } else {
          prev.next = current.next
        }
        return
      }

      prev = current
      current = current.next
    }
  }

  public remove (value: V): void {
    this.removeBy((v: V) => v === value)
  }

  public forEach (callbackFn: (value: V, index: number) => void): void {
    let current = this.head
    let i = 0

    while (current) {
      callbackFn(current.value, i)

      current = current.next
      i = i + 1
    }
  }

  public isEmpty (): boolean {
    return this.head == null
  }

  public removeFirst (): V | null {
    // just for strict null checks
    if (this.head == null) {
      return null
    }

    const firstNode: ListNode<V> = this.head

    if (firstNode.next == null) {
      this.tail = null
    }

    // remove the first node
    this.head = firstNode.next

    return firstNode.value
  }
}
