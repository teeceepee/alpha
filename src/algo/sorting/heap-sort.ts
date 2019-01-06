// heap sort
// https://en.wikipedia.org/wiki/Heapsort
export class HeapSort {
  private readonly arr: number[]

  constructor (arr: number[]) {
    this.arr = arr
  }

  public sort (): void {
    const maxIndex = this.arr.length - 1
    const beginIndex: number = Math.floor((maxIndex - 1) / 2)

    for (let i = beginIndex; i >= 0; i--) {
      this.maxHeapify(i, maxIndex)
    }

    for (let i = maxIndex; i > 0; i--) {
      this.swap(0, i)
      this.maxHeapify(0, i - 1)
    }
  }

  private swap (i: number, j: number): void {
    const tmp = this.arr[i]
    this.arr[i] = this.arr[j]
    this.arr[j] = tmp
  }

  private maxHeapify (index: number, maxIndex: number): void {
    const li = index * 2 + 1
    const ri = li + 1
    let cMax = li

    if (li > maxIndex) {
      return
    }

    if (ri <= maxIndex && this.arr[ri] > this.arr[li]) {
      cMax = ri
    }

    if (this.arr[cMax] > this.arr[index]) {
      this.swap(cMax, index)
      this.maxHeapify(cMax, maxIndex)
    }
  }
}
