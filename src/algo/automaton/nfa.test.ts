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

  test('alternations without parentheses', () => {
    const nfa = new Nfa('abc|def')

    expect(nfa.recognize('abc')).toBe(true)
    expect(nfa.recognize('def')).toBe(true)
    expect(nfa.recognize('abcd')).toBe(false)
  })

  test('Kleene star', () => {
    const nfa = new Nfa('ab*c')
    expect(nfa.recognize('ac')).toBe(true)
    expect(nfa.recognize('abc')).toBe(true)
    expect(nfa.recognize('abbc')).toBe(true)
    expect(nfa.recognize('abbbc')).toBe(true)
    expect(nfa.recognize('adc')).toBe(false)
  })

  test('Kleene plus', () => {
    const nfa = new Nfa('ab+c')
    expect(nfa.recognize('ac')).toBe(false)
    expect(nfa.recognize('abc')).toBe(true)
    expect(nfa.recognize('abbc')).toBe(true)
    expect(nfa.recognize('abbbc')).toBe(true)
    expect(nfa.recognize('adc')).toBe(false)
  })

  // 不匹配的位置是从右向左计算的
  test('unmatched left parenthesis', () => {
    expect(() => {
      new Nfa('((abc)').recognize('abc')
    }).toThrowError('Unmatched left parenthesis, in position: 0')

    expect(() => {
      new Nfa('(((abc)').recognize('abc')
    }).toThrowError('Unmatched left parenthesis, in position: 1')

    expect(() => {
      new Nfa('abc(de(fg').recognize('abc')
    }).toThrowError('Unmatched left parenthesis, in position: 3')

    // 提示结果不太严谨
    expect(() => {
      new Nfa('a(bc').recognize('abc')
    }).toThrowError('Unmatched left parenthesis, in position: 0')
  })

  test('unmatched right parenthesis', () => {
    expect(() => {
      new Nfa('(abc))').recognize('abc')
    }).toThrowError('Unmatched right parenthesis, in position: 5')

    expect(() => {
      new Nfa('ab)c)d').recognize('abc')
    }).toThrowError('Unmatched right parenthesis, in position: 4')

    // 提示结果不太严谨
    expect(() => {
      new Nfa('abc)d').recognize('abc')
    }).toThrowError('Unmatched right parenthesis, in position: 5')
  })

  test('any', () => {
    const nfa = new Nfa('a.c')
    expect(nfa.recognize('abc')).toBe(true)
    expect(nfa.recognize('adc')).toBe(true)
    expect(nfa.recognize('ac')).toBe(false)
  })
})
