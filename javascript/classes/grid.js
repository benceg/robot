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
  
  layout()
  {
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
  
  createCanvas()
  {
    this.canvas = document.createElement('canvas');
    this.el.appendChild(this.canvas);
    this.canvas.draggable = true;
    this.canvas.width = this.columns * this.size;
    this.canvas.height = this.rows * this.size;
    this.ctx = this.canvas.getContext('2d');
  }
  
  draw(x, y)
  {
    this.ctx.moveTo(x * this.size, y * this.size);
    this.ctx.strokeRect(x * this.size, y * this.size, x * this.size + this.size, y * this.size + this.size);
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
      startX = null;
      startY = null;
      document.documentElement.removeAttribute('data-dragging');
    }
  }
  
  rotate(event)
  {
    event.preventDefault();
    
    if(startX && startY)
    {
      this.offsetX = this.clamp((this.checkTouch(event).pageX - startX), 60);
      this.offsetY = this.clamp((this.checkTouch(event).pageY - startY), 60);
      this.canvas.parentNode.style.transform = `perspective(1000px) rotateX(${this.offsetY}deg) rotateZ(${this.offsetX}deg)`;
    }
  }
  
  clamp(value, clamp)
  {
    if (value > clamp) {
      return clamp;
    } else if (value < -clamp) {
      return -(clamp);
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