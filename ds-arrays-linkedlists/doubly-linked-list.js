class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  unshift(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
  }

  pop() {
    if (!this.head) throw new Error("Cannot pop from an empty list");
    const removedValue = this.tail.val;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail.next = null;
    }
    this.length--;
    return removedValue;
  }

  shift() {
    if (!this.head) throw new Error("Cannot shift from an empty list");
    const removedValue = this.head.val;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      this.head.prev = null;
    }
    this.length--;
    return removedValue;
  }

  getAt(idx) {
    if (!Number.isInteger(idx) || idx < 0) throw new Error("Invalid index");
    let currentNode = this.head;
    let counter = 0;
    while (currentNode && counter !== idx) {
      currentNode = currentNode.next;
      counter++;
    }
    if (!currentNode) throw new Error("Index not found in the list");
    return currentNode.val;
  }

  setAt(idx, val) {
    if (!Number.isInteger(idx) || idx < 0) throw new Error("Invalid index");
    let currentNode = this.head;
    let counter = 0;
    while (currentNode && counter !== idx) {
      currentNode = currentNode.next;
      counter++;
    }
    if (!currentNode) throw new Error("Index not found in the list");
    currentNode.val = val;
  }

  insertAt(idx, val) {
    if (!Number.isInteger(idx) || idx < 0) throw new Error("Invalid index");
    if (idx === 0) return this.unshift(val);
    let currentNode = this.head;
    let counter = 0;
    while (currentNode && counter !== idx - 1) {
      currentNode = currentNode.next;
      counter++;
    }
    if (!currentNode) throw new Error("Index not found in the list");
    const newNode = new Node(val);
    newNode.next = currentNode.next;
    newNode.prev = currentNode;
    if (currentNode.next) {
      currentNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }
    currentNode.next = newNode;
    this.length++;
  }

  removeAt(idx) {
    if (!Number.isInteger(idx) || idx < 0) throw new Error("Invalid index");
    if (idx === 0) return this.shift();
    let currentNode = this.head;
    let counter = 0;
    while (currentNode && counter !== idx - 1) {
      currentNode = currentNode.next;
      counter++;
    }
    if (!currentNode || !currentNode.next) throw new Error("Index not found in the list");
    const removedNode = currentNode.next;
    currentNode.next = removedNode.next;
    if (removedNode.next) {
      removedNode.next.prev = currentNode;
    } else {
      this.tail = currentNode;
    }
    this.length--;
    return removedNode;
  }

  average() {
    if (this.length === 0) return 0;
    let currentNode = this.head;
    let sum = 0;
    while (currentNode) {
      sum += currentNode.val;
      currentNode = currentNode.next;
    }
    return sum / this.length;
  }
}

module.exports = DoublyLinkedList;
