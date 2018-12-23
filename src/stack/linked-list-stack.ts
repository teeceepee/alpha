import { LinkedList } from '../linked-list/singly-linked-list'

export class Stack<V> {
  private list: LinkedList<V>

  constructor () {
    this.list = new LinkedList<V>()
  }

  public isEmpty (): boolean {
    return this.list.isEmpty()
  }

  public push (value: V): void {
    this.list.addFirst(value)
  }

  public pop (): V | null {
    return this.list.removeFirst()
  }
}
