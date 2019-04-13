import { Bag } from '../../bag/linked-list-bag'
import { Digraph } from '../../graph/digraph'
import { DirectedDfs } from '../../graph/directed-dfa'
import { Stack } from '../../stack/linked-list-stack'

export class Nfa {
  private readonly re: string[] // 匹配转换
  private readonly stateCount: number // 状态数量
  private readonly graph: Digraph // epsilon 转换

  constructor (regexp: string) {
    this.re = regexp.split('')
    this.stateCount = this.re.length

    this.graph = new Digraph(this.stateCount + 1)

    const ops = new Stack<number>()

    for (let i = 0; i < this.re.length; i++) {
      const chr = this.re[i]

      let lp = i

      if (chr === '(' || chr === '|') {
        ops.push(i)
      } else if (chr === ')') {
        const or = ops.pop()

        if (or == null) {
          this.unmatchedParen()
        } else {
          if (this.re[or] === '|') {
            const op = ops.pop()

            if (op == null) {
              this.unmatchedParen()
            } else {
              lp = op
              this.graph.addEdge(lp, or + 1)
              this.graph.addEdge(or, i)
            }
          } else {
            lp = or
          }
        }
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
      this.unmatchedParen()
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

  private unmatchedParen () {
    throw new Error('Unmatched parenthesis')
  }
}
