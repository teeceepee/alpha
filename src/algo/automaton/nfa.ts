import { Bag } from '../../bag/linked-list-bag'
import { Digraph } from '../../graph/digraph'
import { DirectedDfs } from '../../graph/directed-dfa'
import { Stack } from '../../stack/linked-list-stack'

export class Nfa {
  private readonly re: string[] // 匹配转换
  private readonly stateCount: number // 状态数量
  private readonly graph: Digraph // epsilon 转换
  private readonly startWithLeftParen: boolean // 是否以 `(` 开头，用于计算错误提示的位置

  constructor (regexp: string) {
    this.startWithLeftParen = regexp[0] === '('

    // 下面的或操作要求 `|` 一定要在一对括号中
    // 所以如果正则表达式不以 `(` 开头，则在最外层包裹一层括号
    if (regexp[0] !== '(') {
      this.re = new Array(regexp.length + 2)
      this.re[0] = '('

      for (let i = 0; i < regexp.length; i++) {
        this.re[i + 1] = regexp[i]
      }

      this.re[this.re.length - 1] = ')'
    } else {
      this.re = new Array(regexp.length)
      for (let i = 0; i < regexp.length; i++) {
        this.re[i] = regexp[i]
      }
    }

    this.stateCount = this.re.length

    this.graph = new Digraph(this.stateCount + 1)

    const ops = new Stack<number>()

    for (let i = 0; i < this.re.length; i++) {
      const chr = this.re[i]

      let lp = i

      if (chr === '(' || chr === '|') {
        ops.push(i)
      } else if (chr === ')') { // 支持多向或运算，如 (ab|cd|ef)
        const alternationOps = new Bag<number>()

        // 从栈中取操作符，如果取不到说明括号不匹配，有多余的 `)`
        // 如果取到的是 `|`，存入 alternationOps 中
        // 否则取到的是 `(`，赋值给 lp，结束循环
        //
        // 循环结束后，lp 记录与当前 `)` 对应的 `(` 位置，alternationOps 记录中间所有的 `|` 位置
        while (true) {
          const tmpOp = ops.pop()

          if (tmpOp == null) {
            const position = this.startWithLeftParen ? i : i - 1
            throw new Error(`Unmatched right parenthesis, in position: ${position}`)
          } else {
            if (this.re[tmpOp] === '|') {
              alternationOps.add(tmpOp)
            } else {
              lp = tmpOp
              break
            }
          }
        }

        // 对每一个 `|`，增加一个从 `(` 到后一个字符的 epsilon 转换，增加一个从 `|` 到当前 `)` 的 epsilon 转换
        alternationOps.forEach((or) => {
          this.graph.addEdge(lp, or + 1)
          this.graph.addEdge(or, i)
        })
      }

      if (i < this.re.length - 1 && this.re[i + 1] === '*') {
        this.graph.addEdge(lp, i + 1)
        this.graph.addEdge(i + 1, lp)
      }

      if (chr === '(' || chr === '*' || chr === ')') {
        this.graph.addEdge(i, i + 1)
      }
    }

    if (!ops.isEmpty()) {
      const left = ops.pop()
      if (left != null) {
        let position: number
        if (this.startWithLeftParen) {
          position = left
        } else {
          position = left === 0 ? left : left - 1
        }

        throw new Error(`Unmatched left parenthesis, in position: ${position}`)
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
          if (this.re[v] === chr || this.re[v] === '.') {
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
