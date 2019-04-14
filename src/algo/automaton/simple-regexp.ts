import { Bag } from '../../bag/linked-list-bag'
import { Digraph } from '../../graph/digraph'
import { DirectedDfs } from '../../graph/directed-dfa'
import { Stack } from '../../stack/linked-list-stack'

class CharSet {
  public static ALPHABET_COUNT = 128

  private readonly charArray: boolean[]

  constructor () {
    this.charArray = new Array(CharSet.ALPHABET_COUNT)
    for (let i = 0; i < this.charArray.length; i++) {
      this.charArray[i] = false
    }
  }

  public addChar (chr: string): void {
    const charCode = chr.charCodeAt(0)

    if (charCode >= CharSet.ALPHABET_COUNT) {
      throw new Error(`Unsupported character: ${chr[0]}`)
    }

    this.charArray[charCode] = true
  }

  public contains (chr: string): boolean {
    const charCode = chr.charCodeAt(0)

    if (charCode >= CharSet.ALPHABET_COUNT) {
      return false
    }

    return this.charArray[charCode]
  }
}

enum CharClassType {
  ANY = 'ANY',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

// https://en.wikipedia.org/wiki/Regular_expression#Character_classes
class CharClass {

  public static fromChar (chr: string): CharClass {
    if (chr[0] === '.') {
      return new CharClass(CharClassType.ANY)
    } else {
      const charSet = new CharSet()
      charSet.addChar(chr[0])
      return new CharClass(CharClassType.VALID, charSet)
    }
  }

  private readonly type: CharClassType
  private readonly charSet: CharSet

  constructor (type: CharClassType, charSet?: CharSet) {
    this.type = type
    this.charSet = charSet || new CharSet()
  }

  public classType (): CharClassType {
    return this.type
  }

  public chars (): CharSet {
    return this.charSet
  }

  public matches (chr: string): boolean {
    const t = this.classType()

    if (t === CharClassType.ANY) {
      return true
    } else if (t === CharClassType.VALID) {
      return this.chars().contains(chr[0])
    } else if (t === CharClassType.INVALID) {
      return !this.chars().contains(chr[0])
    } else {
      throw new Error(`Unknown character class type: ${t}`)
    }
  }
}

export enum TokenType {
  CHAR_CLASS = 'CHAR_CLASS',
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  ALTERNATION = 'ALTERNATION',
  STAR = 'STAR',
  PLUS = 'PLUS',
}

export class Token {
  public static tokensFormStr (s: string): Token[] {
    const results: Token[] = []

    let i = 0
    while (i < s.length) {
      const chr = s[i]
      let token

      if (chr === '(') {
        token = new Token(TokenType.LEFT_PAREN)
      } else if (chr === ')') {
        token = new Token(TokenType.RIGHT_PAREN)
      } else if (chr === '|') {
        token = new Token(TokenType.ALTERNATION)
      } else if (chr === '*') {
        token = new Token(TokenType.STAR)
      } else if (chr === '+') {
        token = new Token(TokenType.PLUS)
      } else {
        const charClass = CharClass.fromChar(chr)

        token = new Token(TokenType.CHAR_CLASS, charClass)
      }

      results.push(token)

      i += 1
    }
    return results
  }

  public type: TokenType
  public charClass: CharClass | null

  constructor (type: TokenType, charClass?: CharClass) {
    this.type = type
    this.charClass = charClass || null
  }

  public isCharClass (): boolean {
    return this.type === TokenType.CHAR_CLASS
  }

  public isLeftParen (): boolean {
    return this.type === TokenType.LEFT_PAREN
  }

  public isRightParen (): boolean {
    return this.type === TokenType.RIGHT_PAREN
  }

  public isAlternation (): boolean {
    return this.type === TokenType.ALTERNATION
  }

  public isStar (): boolean {
    return this.type === TokenType.STAR
  }

  public isPlus (): boolean {
    return this.type === TokenType.PLUS
  }
}

export class SimpleRegexp {
  private readonly tokens: Token[]
  private readonly stateCount: number // 状态数量
  private readonly graph: Digraph // epsilon 转换

  constructor (regexp: string) {
    this.tokens = Token.tokensFormStr(regexp)

    this.stateCount = this.tokens.length

    this.graph = new Digraph(this.stateCount + 1)

    const ops = new Stack<number>()

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i]

      let leftParenPos = i

      if (token.isLeftParen() || token.isAlternation()) {
        ops.push(i)
      } else if (token.isRightParen()) { // 支持多向或运算，如 (ab|cd|ef)
        const alternationOps = new Bag<number>()

        while (true) {
          const tmpOp = ops.pop()

          if (tmpOp == null) {
            throw new Error(`Unmatched right parenthesis`)
          } else {
            if (this.tokens[tmpOp].isAlternation()) {
              alternationOps.add(tmpOp)
            } else {
              leftParenPos = tmpOp
              break
            }
          }
        }

        alternationOps.forEach((or) => {
          this.graph.addEdge(leftParenPos, or + 1)
          this.graph.addEdge(or, i)
        })
      }

      // '*'
      if (i < this.tokens.length - 1 && this.tokens[i + 1].isStar()) {
        this.graph.addEdge(leftParenPos, i + 1)
        this.graph.addEdge(i + 1, leftParenPos)
      }

      // '+'
      if (i < this.tokens.length - 1 && this.tokens[i + 1].isPlus()) {
        this.graph.addEdge(i + 1, leftParenPos)
      }

      if (token.isLeftParen() || token.isRightParen() || token.isStar() || token.isPlus()) {
        this.graph.addEdge(i, i + 1)
      }
    }

    // 如果操作符栈不为空，说明有相对于最外层的 `|`，每个都增加两条 epsilon 转换，分别是从初始状态到 or + 1，从 or 到接受状态
    const startState = 0
    const acceptanceState = this.stateCount

    while (!ops.isEmpty()) {
      const or = ops.pop()

      if (or != null) {
        if (this.tokens[or].isAlternation()) {
          this.graph.addEdge(startState, or + 1)
          this.graph.addEdge(or, acceptanceState)
        } else {
          throw new Error(`Unmatched left parenthesis`)
        }
      }
    }
  }

  public recognize (txt: string): boolean {
    let pc = new Bag<number>()
    const initialSources = new Bag<number>()
    initialSources.add(0)
    let dfs = new DirectedDfs(this.graph, initialSources)

    for (let v = 0; v < this.graph.vertexCount(); v++) {
      if (dfs.marked(v)) {
        pc.add(v)
      }
    }

    for (const chr of txt) {
      // 计算 txt[i + 1] 可能到达的所有 NFA 状态
      const match = new Bag<number>()

      pc.forEach((v) => {
        if (v < this.stateCount) {
          const t = this.tokens[v]

          if (t.isCharClass() && t.charClass && t.charClass.matches(chr)) {
            match.add(v + 1)
          }
        }
      })

      pc = new Bag<number>()
      dfs = new DirectedDfs(this.graph, match)
      for (let j = 0; j < this.graph.vertexCount(); j++) {
        if (dfs.marked(j)) {
          pc.add(j)
        }
      }
    }

    let found = false
    pc.forEach((v) => {
      if (v === this.stateCount) {
        found = true
      }
    })

    return found
  }
}
