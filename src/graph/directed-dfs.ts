import { Bag } from '../bag/linked-list-bag'
import { Digraph } from './digraph'

export class DirectedDfs {
  private readonly markedArr: boolean[]

  constructor (graph: Digraph, sources: Bag<number>) {
    this.markedArr = new Array(graph.vertexCount())
    for (let i = 0; i < this.markedArr.length; i++) {
      this.markedArr[i] = false
    }

    sources.forEach((s) => {
      if (!this.markedArr[s]) {
        this.dfs(graph, s)
      }
    })
  }

  public marked (v: number): boolean {
    return this.markedArr[v]
  }

  private dfs (graph: Digraph, v: number) {
    this.markedArr[v] = true

    graph.adjacent(v).forEach((w) => {
      if (!this.markedArr[w]) {
        this.dfs(graph, w)
      }
    })

  }
}
