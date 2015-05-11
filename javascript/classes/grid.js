import config from '../../config/config.json';
import ObjectAssign from 'object-assign';

Object.freeze(config);

export default class Grid {
  
  constructor(args) {
    ObjectAssign(this, config.grid, args);
    this.el = document.querySelector(this.container);
  }
  
  layout() {
    if (!this.ctx || !this.ctx instanceof CanvasRenderingContext2D) {
      throw new Error('Grid.ctx is not a canvas element');
    }
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.draw(x, y);
      }
    }
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.el.appendChild(this.canvas);
    this.canvas.width = this.columns * this.size;
    this.canvas.height = this.rows * this.size;
    this.ctx = this.canvas.getContext('2d');
  }
  
  draw(x, y) {
    this.ctx.moveTo(x * this.size, y * this.size);
    this.ctx.strokeRect(x * this.size, y * this.size, x * this.size + this.size, y * this.size + this.size);
  }
  
}