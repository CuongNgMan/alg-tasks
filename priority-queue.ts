import Faker from 'faker';
import { performance, PerformanceObserver } from 'perf_hooks';

function generatePriority(max: number) {
  return Math.floor(Math.random() * max);
}

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item.name, +' ' + item.duration);
  });
});
obs.observe({ entryTypes: ['measure'] });

class PQueueItem {
  data: any;
  priority: number;

  constructor(priority: number) {
    this.data = Faker.name.firstName();
    this.priority = priority;
  }
}

class PriorityQueue {
  private values: PQueueItem[] = [];

  swap(i1: number, i2: number) {
    [this.values[i1], this.values[i2]] = [this.values[i2], this.values[i1]];
    return this.values;
  }

  get length() {
    return this.values.length;
  }

  enqueue(value: PQueueItem) {
    this.values.push(value);
    let index = this.values.length - 1;
    const parentIndex = this.parent(index);

    while (index !== 0 && this.values[index].priority > this.values[parentIndex].priority) {
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  dequeue() {
    this.swap(0, this.values.length - 1);

    let poppedNode = this.values.pop();

    this.reOrderHeap(0);

    return poppedNode;
  }

  private reOrderHeap(index: number) {
    let left = this.left(index);
    let right = this.right(index);
    let smallest = index;

    if (left < this.values.length && this.values[smallest].priority < this.values[left].priority) {
      smallest = left;
    }

    if (right < this.values.length && this.values[smallest].priority < this.values[right].priority) {
      smallest = right;
    }

    if (smallest !== index) {
      this.swap(smallest, index);
      this.reOrderHeap(smallest);
    }
  }

  private parent(index: number) {
    return Math.floor((index - 1) / 2);
  }

  private left(index: number) {
    return 2 * index + 1;
  }

  private right(index: number) {
    return 2 * index + 2;
  }
}

let start: number = 0;
const max = 1000;
const pQueue = new PriorityQueue();

const markEnqueueStart = 'enqueueStart';
const markEnqueueEnd = 'enqueueEnd';
try {
  performance.mark(markEnqueueStart);

  for (let i = 0; i < max; i++) {
    pQueue.enqueue(new PQueueItem(generatePriority(max)));
  }
} finally {
  performance.mark(markEnqueueEnd);
}

const markDequeueStart = 'dequeueStart';
const markDequeueEnd = 'dequeueEnd';
try {
  let i = pQueue.length;
  performance.mark(markDequeueStart);

  while (i) {
    console.log(pQueue.dequeue());
    i--;
  }
} finally {
  performance.mark(markDequeueEnd);
}

performance.measure(`Enqueue ${max} items take`, markEnqueueStart, markEnqueueEnd);
performance.measure(`Dequeue ${max} items take`, markDequeueStart, markDequeueEnd);
