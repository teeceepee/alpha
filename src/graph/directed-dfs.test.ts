import { Bag } from '../bag/linked-list-bag'
import { Digraph } from './digraph'
import { DirectedDfs } from './directed-dfa'

describe('Directed DFS', () => {
  test('marked', () => {
    const n = 10
    const graph = new Digraph(n)

    graph.addEdge(0, 1)
    graph.addEdge(1, 2)
    graph.addEdge(2, 3)

    const initialSources = new Bag<number>()
    initialSources.add(0)
    const dfs = new DirectedDfs(graph, initialSources)

    expect(dfs.marked(0)).toBe(true)
    expect(dfs.marked(1)).toBe(true)
    expect(dfs.marked(2)).toBe(true)
    expect(dfs.marked(3)).toBe(true)
    expect(dfs.marked(4)).toBe(false)
    expect(dfs.marked(5)).toBe(false)
  })
})
