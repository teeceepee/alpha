import { HashTable } from './separate-chaining'

describe('separate chaining HashTable', () => {
  test('constructor', () => {
    const h = new HashTable<number>()

    expect(h.size()).toBe(0)
  })

  test('set get', () => {
    const h = new HashTable<string>()

    expect(h.get('foo')).toBe(null)

    const v = 'bar'
    h.set('foo', v)
    expect(h.get('foo')).toBe(v)
  })

  test('size', () => {
    const h = new HashTable<number>()
    const c = 10

    for (let i = 0; i < c; i++) {
      h.set(`${i}`, i)
    }

    expect(h.size()).toBe(c)
  })

  test('remove', () => {
    const h = new HashTable<number>()
    const k = 'foo'
    const v = 1

    expect(h.get(k)).toBeNull()

    h.set(k, v)
    expect(h.get(k)).toBe(v)

    h.remove(k)
    expect(h.get(k)).toBeNull()
  })
})
