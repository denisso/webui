class Node {
  constructor(value) {
    this.value = value;
    this.next = this.prev = null;
  }
}

export default class List {
  constructor() {
    this.length = 0;
  }
  append(value) {
    const tail = new Node(value);
    if (this.tail) {
      tail.prev = this.tail;
      this.tail.next = tail;
    }
    this.tail = tail;
    this.length++;
    return tail;
  }
  remove(node) {
    if (node === this.tail) {
      if (!node.prev) {
        this.head = this.tail = null;
      } else {
        this.tail = node.prev;
      }
      return;
    } else if (node === this.head) {
      if (!node.next) {
        this.head = this.tail = null;
      } else {
        this.head = node.prev;
      }
      return;
    }
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      if (node.next) node.next.prev = null;
    }
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      if (node.prev) node.prev.next = null;
    }
    this.length--;
  }
}
