
class ListNode<V> {
  public value: V = null
  public next: ListNode<V> = null

  constructor (v: V = null) {
    this.value = v
  }
}

// Singly linked list
export class LinkedList<V> {
  private head: ListNode<V>

  constructor () {
    this.head = new ListNode<V>()
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

  public findBy (predictFn: (v: V) => boolean): V | null {
    let current = this.head.next
    let i = 0

    while (current) {
      const currentValue: V = current.value

      if (predictFn(currentValue)) {
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

  public remove (value: V): void {
    let prev = this.head
    let current = prev.next

    while (current) {
      if (current.value === value) {
        prev.next = current.next
      }

      prev = current
      current = current.next
    }
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
}
