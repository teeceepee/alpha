// heap sort
// https://en.wikipedia.org/wiki/Heapsort

// 下标从 0 开始的数组
// 父节点的下标，-1 表示下标对应的节点是根节点
function parentIndex (currentIndex: number): number {
  return Math.floor((currentIndex - 1) / 2)
}

// 左子节点的下标
function leftChildIndex (currentIndex: number): number {
  return currentIndex * 2 + 1
}

// 右子节点的下标
function rightChildIndex (currentIndex: number): number {
  return currentIndex * 2 + 2
}

export class HeapSort {
  private readonly arr: number[]

  constructor (arr: number[]) {
    this.arr = arr
  }

  public sort (): void {
    // 数组最后一个元素的下标
    const lastIndex = this.arr.length - 1

    // 堆调整开始的下标，从最后一个元素的父节点开始
    // 调整结束后，[0, lastIndex] 的数组即为一个大根堆
    const beginIndex: number = parentIndex(lastIndex)
    for (let i = beginIndex; i >= 0; i--) {
      this.maxHeapify(i, lastIndex)
    }

    // 大根堆的第一个元素与最后一个元素交换
    for (let i = lastIndex; i > 0; i--) {
      this.swap(0, i)
      this.maxHeapify(0, i - 1)
    }
  }

  private swap (i: number, j: number): void {
    const tmp = this.arr[i]
    this.arr[i] = this.arr[j]
    this.arr[j] = tmp
  }

  // 以 arr[index] 为根节点，调整为大根堆，假设左右两个子树都已经是大根堆
  private maxHeapify (index: number, lastIndex: number): void {
    const li = leftChildIndex(index)
    const ri = rightChildIndex(index)

    // 如果左子节点的下标大于 maxIndex，说明该节点是叶子节点，不需要调整
    if (li > lastIndex) {
      return
    }

    // 查找左右节点中较大的那个的下标
    let largerChildIndex = li
    if (ri <= lastIndex && this.arr[ri] > this.arr[li]) {
      largerChildIndex = ri
    }

    // 如果某个子节点大于当前节点，交换，然后那个子树做堆调整
    if (this.arr[largerChildIndex] > this.arr[index]) {
      this.swap(largerChildIndex, index)
      this.maxHeapify(largerChildIndex, lastIndex)
    }
  }
}
