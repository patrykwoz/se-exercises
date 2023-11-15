class CircularArray {
    constructor() {
      this.items = [];
      this.head = 0;
    }
  
    addItem(item) {
      this.items.push(item);
    }
  
    rotate(steps) {
      if (this.items.length === 0) {
        return;
      }
  
      // Calculate the new head index after rotation
      this.head = (this.head + steps) % this.items.length;
    }
  
    getByIndex(index) {
      if (index < 0 || index >= this.items.length) {
        return null;
      }
  
      // Calculate the actual index in the circular array
      const actualIndex = (this.head + index) % this.items.length;
      return this.items[actualIndex];
    }
  
    printArray() {
      for (let i = 0; i < this.items.length; i++) {
        console.log(this.getByIndex(i));
      }
    }
  }