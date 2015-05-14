import config from '../../config/config.json';
import ObjectAssign from 'object-assign';

Object.freeze(config);

var startX = null;
var startY = null

export default class Grid
{
  
  constructor(args)
  {
    ObjectAssign(this, config.grid, args);
    this.el = document.querySelector(this.container);
    this.offsetX = 0;
    this.offsetY = 0;
  }
  
  createCanvas()
  {
    this.canvas = document.createElement('canvas');
    this.el.appendChild(this.canvas);
    this.canvas.draggable = true;
    this.canvas.width = this.columns * this.size;
    this.canvas.height = this.rows * this.size;
    this.ctx = this.canvas.getContext('2d');
  }
  
  layout()
  {
    this.ctx.strokeStyle = this.lines.color;
    this.ctx.lineWidth = this.lines.width;
    if (!this.ctx || !this.ctx instanceof CanvasRenderingContext2D)
    {
      throw new Error('Grid.ctx is not a canvas element');
    }
    for (let y = 0; y < this.rows; y++)
    {
      for (let x = 0; x < this.columns; x++)
      {
        this.draw(x, y);
      }
    }
  }
  
  draw(x, y)
  {
    let fromX = x * this.size + this.lines.width / 2;
    let fromY = y * this.size + this.lines.width / 2;
    let toX = this.size - this.lines.width;
    let toY = this.size - this.lines.width;
    this.ctx.strokeRect(fromX, fromY, toX, toY);
  }
  
  checkTouch(event) {
    return (event.changedTouches) ? event.changedTouches[0] : event;
  }
  
  startRotate(event)
  {
    if (event.target === this.canvas)
    {
      event.preventDefault();
      startX = this.checkTouch(event).pageX - this.offsetX;
      startY = this.checkTouch(event).pageY - this.offsetY;
      document.documentElement.setAttribute('data-dragging', '');
    }
  }
  
  stopRotate(event)
  {
    if (startX || startY)
    {
      event.preventDefault();
      startX = null;
      startY = null;
      document.documentElement.removeAttribute('data-dragging');
    }
  }
  
  rotate(event)
  {
    if(startX && startY)
    {
      event.preventDefault();
      this.offsetX = this.clamp((this.checkTouch(event).pageX - startX), this.angle.x[0], this.angle.x[1]);
      this.offsetY = this.clamp((this.checkTouch(event).pageY - startY), this.angle.y[0], this.angle.y[1]);
      this.canvas.parentNode.style.transform = `perspective(1000px) rotateX(${this.offsetY}deg) rotateZ(${this.offsetX}deg)`;
      this.canvas.parentNode.style.webkitTransform = `perspective(1000px) rotateX(${this.offsetY}deg) rotateZ(${this.offsetX}deg)`;
    }
  }
  
  clamp(value, max = 60, min = 60)
  {
    if (value > max) {
      return max;
    } else if (value < -min) {
      return -(min);
    } else {
      return value;
    }
  }
  
  listen()
  {
    document.addEventListener('mousedown', this.startRotate.bind(this));
    document.addEventListener('mousemove', this.rotate.bind(this));
    document.addEventListener('mouseup', this.stopRotate.bind(this));
    
    document.addEventListener('touchstart', this.startRotate.bind(this));
    document.addEventListener('touchmove', this.rotate.bind(this));
    document.addEventListener('touchend', this.stopRotate.bind(this));
  }
  
}