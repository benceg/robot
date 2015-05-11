export default class Grid {
  
  constructor(x, y) {
    if (typeof x !== "number" || typeof y !== "number") {
      throw new Error("Grid expects numeric coordinates");
    }
    this.x = x;
    this.y = y;
  }
  
  layout() {
    
  }
  
}