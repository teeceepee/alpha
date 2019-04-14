import { SimpleRegexp, Token } from './simple-regexp'

describe('Token', () => {
  test('tokens from string', () => {
    const tokens = Token.tokensFormStr('(abc)')

    expect(tokens.length).toBe(5)
    expect(tokens[0].isLeftParen()).toBe(true)
  })
})

describe('Simple Regular Expression', () => {
  test('concatenation', () => {
    const txt = 'abc'
    const re1 = new SimpleRegexp(txt)
    expect(re1.recognize(txt)).toBe(true)

    const re2 = new SimpleRegexp('foobar')
    expect(re2.recognize('foo')).toBe(false)
  })

  test('alternation', () => {
    const re = new SimpleRegexp('(ab|cd)')

    expect(re.recognize('ab')).toBe(true)
    expect(re.recognize('cd')).toBe(true)
    expect(re.recognize('abc')).toBe(false)
    expect(re.recognize('abcd')).toBe(false)
  })

  test('multiple alternations', () => {
    const re = new SimpleRegexp('(ab|cd|ef|gh)')

    expect(re.recognize('ab')).toBe(true)
    expect(re.recognize('cd')).toBe(true)
    expect(re.recognize('ef')).toBe(true)
    expect(re.recognize('gh')).toBe(true)
    expect(re.recognize('abc')).toBe(false)
    expect(re.recognize('abcd')).toBe(false)
  })

  test('alternations without parentheses', () => {
    const re = new SimpleRegexp('abc|def')

    expect(re.recognize('abc')).toBe(true)
    expect(re.recognize('def')).toBe(true)
    expect(re.recognize('abcd')).toBe(false)

    const re2 = new SimpleRegexp('ab|cd|ef|gh')

    expect(re2.recognize('ab')).toBe(true)
    expect(re2.recognize('cd')).toBe(true)
    expect(re2.recognize('ef')).toBe(true)
    expect(re2.recognize('gh')).toBe(true)
    expect(re2.recognize('abcd')).toBe(false)
  })

  test('Kleene star', () => {
    const re = new SimpleRegexp('ab*c')
    expect(re.recognize('ac')).toBe(true)
    expect(re.recognize('abc')).toBe(true)
    expect(re.recognize('abbc')).toBe(true)
    expect(re.recognize('abbbc')).toBe(true)
    expect(re.recognize('adc')).toBe(false)
  })

  test('Kleene plus', () => {
    const re = new SimpleRegexp('ab+c')
    expect(re.recognize('ac')).toBe(false)
    expect(re.recognize('abc')).toBe(true)
    expect(re.recognize('abbc')).toBe(true)
    expect(re.recognize('abbbc')).toBe(true)
    expect(re.recognize('adc')).toBe(false)
  })

  test('unmatched left parenthesis', () => {
    expect(() => {
      new SimpleRegexp('((abc)').recognize('abc')
    }).toThrowError()

    expect(() => {
      new SimpleRegexp('(((abc)').recognize('abc')
    }).toThrowError()

    expect(() => {
      new SimpleRegexp('abc(de(fg').recognize('abc')
    }).toThrowError()

    expect(() => {
      new SimpleRegexp('a(bc').recognize('abc')
    }).toThrowError()
  })

  test('unmatched right parenthesis', () => {
    expect(() => {
      new SimpleRegexp('(abc))').recognize('abc')
    }).toThrowError()

    expect(() => {
      new SimpleRegexp('ab)c)d').recognize('abc')
    }).toThrowError()

    expect(() => {
      new SimpleRegexp('abc)d').recognize('abc')
    }).toThrowError()
  })

  test('any', () => {
    const re = new SimpleRegexp('a.c')
    expect(re.recognize('abc')).toBe(true)
    expect(re.recognize('adc')).toBe(true)
    expect(re.recognize('ac')).toBe(false)
  })
})
