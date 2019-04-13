import { Bag } from '../bag/linked-list-bag'

export class Digraph {
  private readonly vertexes: number
  private edges: number
  private readonly adj: Array<Bag<number>>

  constructor (vertexCount: number) {
    this.vertexes = vertexCount
    this.edges = 0

    this.adj = new Array(this.vertexes)
    for (let i = 0; i < this.adj.length; i++) {
      this.adj[i] = new Bag<number>()
    }
  }

  public addEdge (v: number, w: number): void {
    this.adj[v].add(w)
    this.edges += 1
  }

  public vertexCount (): number {
    return this.vertexes
  }

  public edgeCount (): number {
    return this.edges
  }

  public adjacent (v: number): Bag<number> {
    if (v < 0 || v >= this.vertexCount()) {
      throw new Error('Vertex index out of bound!')
    }

    return this.adj[v]
  }
}
