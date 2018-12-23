import { Stack } from './linked-list-stack'

describe('linked list stack', () => {
  test('constructor', () => {
    const stack = new Stack<number>()
    expect(stack.isEmpty()).toBe(true)
  })

  test('push pop', () => {
    const stack = new Stack<number>()
    const numbers = [1, 2, 3, 4, 5, 6]

    for (const n of numbers) {
      stack.push(n)
    }

    for (let i = numbers.length - 1; i >= 0; i--) {
      const v = stack.pop()
      expect(v).toBe(numbers[i])
    }

    expect(stack.isEmpty()).toBe(true)
  })

})
