class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals) this.push(val);
  }

  push(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length += 1;
  }

  unshift(val) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length += 1;
  }

  pop() {
    if (!this.head) {
      throw new Error("Cannot pop from an empty list");
    }

    if (!this.head.next) {
      const removedValue = this.head.val;
      this.head = null;
      this.tail = null;
      this.length -= 1;
      return removedValue;
    }

    let currentNode = this.head;
    while (currentNode.next !== this.tail) {
      currentNode = currentNode.next;
    }

    const removedValue = this.tail.val;
    currentNode.next = null;
    this.tail = currentNode;
    this.length -= 1;
    return removedValue;
  }

  shift() {
    if (!this.head) {
      throw new Error("Cannot shift from an empty list");
    }

    if (!this.head.next) {
      const removedValue = this.head.val;
      this.head = null;
      this.tail = null;
      this.length -= 1;
      return removedValue;
    }

    const removedValue = this.head.val;
    this.head = this.head.next;
    this.length -= 1;
    return removedValue;
  }

  getAt(idx) {
    let currentNode = this.head;
    let counter = 0;

    if (!Number.isInteger(idx) || idx < 0) {
      throw new Error("Index should be a non-negative whole number");
    }

    while (currentNode) {
      if (counter === idx) {
        return currentNode.val;
      }
      counter += 1;
      currentNode = currentNode.next;
    }

    throw new Error("Index not found in the list");
  }

  setAt(idx, val) {
    let currentNode = this.head;
    let counter = 0;

    if (!Number.isInteger(idx) || idx < 0) {
      throw new Error("Index should be a non-negative whole number");
    }

    while (currentNode) {
      if (counter === idx) {
        currentNode.val = val;
        return;
      }
      counter += 1;
      currentNode = currentNode.next;
    }

    throw new Error("Index not found in the list");
  }

  insertAt(idx, val) {
    const newNode = new Node(val);

    if (!Number.isInteger(idx) || idx < 0) {
      throw new Error("Index should be a non-negative whole number");
    }

    if (idx === 0) {
      newNode.next = this.head;
      this.head = newNode;

      if (!this.tail) {
        this.tail = newNode;
      }
      this.length += 1;
      return;
    }

    let currentNode = this.head;
    let counter = 0;

    while (currentNode) {
      if (counter === (idx - 1)) {
        newNode.next = currentNode.next;
        currentNode.next = newNode;

        if (currentNode === this.tail) {
          this.tail = newNode;
        }
        this.length += 1;
        return;
      }
      counter += 1;
      currentNode = currentNode.next;
    }

    throw new Error("Index not found in the list");
  }

  removeAt(idx) {
    if (!Number.isInteger(idx) || idx < 0) {
      throw new Error("Index should be a non-negative whole number");
    }

    if (!this.head) {
      throw new Error("The list is empty");
    }

    if (idx === 0) {
      let removedNode = this.head;
      this.head = this.head.next;

      if (!this.head) {
        this.tail = null;
      }
      this.length -= 1;

      return removedNode;
    }

    let currentNode = this.head;
    let counter = 0;

    while (currentNode) {
      if (counter === (idx - 1)) {
        let removedNode = currentNode.next;

        if (!removedNode) {
          throw new Error("Index not found in the list");
        }

        if (removedNode === this.tail) {
          this.tail = currentNode;
        }

        currentNode.next = currentNode.next.next;
        this.length -= 1;
        return removedNode;
      }

      counter += 1;
      currentNode = currentNode.next;
    }

    throw new Error("Index not found in the list");
  }

  average() {
    let currentNode = this.head;
    let sum = 0;
    let counter = 0;

    while (currentNode) {
      sum += currentNode.val;
      counter += 1;
      currentNode = currentNode.next;
    }

    if (counter === 0) {
      return 0;
    }

    let average = sum / counter;
    return average;
  }

  reverse() {
    if (!this.head || !this.head.next) {
      // Nothing to reverse for an empty list or a list with one element.
      return;
    }

    let prev = null;
    let current = this.head;
    let next = null;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    // After the loop, 'prev' will be the new head of the reversed list.
    this.tail = this.head; // Update the tail to the previous head.
    this.head = prev; // Update the head to the new head.
  }

  pivot(value) {
    if (!this.head || !this.head.next) {
      // Nothing to pivot for an empty list or a list with one element.
      return;
    }

    let lessThanList = new LinkedList();
    let greaterThanOrEqualList = new LinkedList();
    let current = this.head;

    while (current) {
      if (current.val < value) {
        lessThanList.push(current.val);
      } else {
        greaterThanOrEqualList.push(current.val);
      }
      current = current.next;
    }

    this.head = lessThanList.head;
    lessThanList.tail.next = greaterThanOrEqualList.head;
    this.tail = greaterThanOrEqualList.tail;
  }


  toArray() {
    const result = [];
    let current = this.head;

    while (current) {
      result.push(current.val);
      current = current.next;
    }

    return result;
  }


}

function mergeSortedLists(a, b) {
  const mergedList = new LinkedList();
  let currentA = a.head;
  let currentB = b.head;

  while (currentA || currentB) {
    if (!currentA) {
      mergedList.push(currentB.val);
      currentB = currentB.next;
    } else if (!currentB) {
      mergedList.push(currentA.val);
      currentA = currentA.next;
    } else if (currentA.val < currentB.val) {
      mergedList.push(currentA.val);
      currentA = currentA.next;
    } else {
      mergedList.push(currentB.val);
      currentB = currentB.next;
    }
  }

  return mergedList;
}


module.exports = LinkedList;
