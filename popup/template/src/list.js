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
    this.length++;
    const tail = new Node(value);
    if (this.tail) {
      tail.prev = this.tail;
      this.tail.next = tail;
    }
    this.tail = tail;
    return tail;
  }
  remove(node) {
    this.length--;

    if (node === this.head) {
      this.head = node.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
    } else if (node === this.tail) {
      this.tail = node.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
    } else {
      if (node.prev) {
        node.prev.next = node.next;
      }
      if (node.next) {
        node.next.prev = node.prev;
      }
    }
  }
}
