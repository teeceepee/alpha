import { Digraph } from './digraph'

describe('Digraph', () => {
  test('constructor', () => {
    const n = 10
    const graph = new Digraph(n)

    expect(graph.vertexCount()).toBe(n)
    expect(graph.edgeCount()).toBe(0)

    const vertexSet = graph.adjacent(1)
    expect(vertexSet.isEmpty()).toBe(true)

    expect(() => { graph.adjacent(10) }).toThrowError('Vertex index out of bound!')
  })

  test('addEdge', () => {
    const n = 10
    const graph = new Digraph(n)

    graph.addEdge(0, 1)
    graph.addEdge(1, 2)

    graph.adjacent(0).forEach((v) => {
      expect(v).toBe(1)
    })

    graph.adjacent(1).forEach((v) => {
      expect(v).toBe(2)
    })

    expect(graph.adjacent(2).isEmpty()).toBe(true)
  })
})
