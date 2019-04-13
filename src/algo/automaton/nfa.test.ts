import { Nfa } from './nfa'

describe('NFA', () => {
  test('concatenation', () => {
    const txt = 'abc'
    const nfa1 = new Nfa(txt)
    expect(nfa1.recognize(txt)).toBe(true)

    const nfa2 = new Nfa('foobar')
    expect(nfa2.recognize('foo')).toBe(false)
  })

  test('alternation', () => {
    const nfa = new Nfa('(ab|cd)')

    expect(nfa.recognize('ab')).toBe(true)
    expect(nfa.recognize('cd')).toBe(true)
    expect(nfa.recognize('abc')).toBe(false)
    expect(nfa.recognize('abcd')).toBe(false)
  })

  test('multiple alternations', () => {
    const nfa = new Nfa('(ab|cd|ef|gh)')

    expect(nfa.recognize('ab')).toBe(true)
    expect(nfa.recognize('cd')).toBe(true)
    expect(nfa.recognize('ef')).toBe(true)
    expect(nfa.recognize('gh')).toBe(true)
    expect(nfa.recognize('abc')).toBe(false)
    expect(nfa.recognize('abcd')).toBe(false)
  })

  test('Kleene star', () => {
    const nfa = new Nfa('ab*c')
    expect(nfa.recognize('abc')).toBe(true)
    expect(nfa.recognize('ac')).toBe(true)
    expect(nfa.recognize('adc')).toBe(false)
  })

  test('unmatched parenthesis', () => {
    expect(() => { new Nfa('((abc').recognize('abc') }).toThrowError()
    expect(() => { new Nfa(')').recognize('abc') }).toThrowError()
  })
})
