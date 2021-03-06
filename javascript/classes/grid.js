import config from '../../config/config.json';
import ObjectAssign from 'object-assign';

Object.freeze(config);

var startX = null;
var startY = null

/**
 * The robot class contains all the functions and parameters specific to the grid
 */
export default class Grid
{
  
  /**
   * Overrides default grid settings and bootstraps the module
   * @param {Object} args - overrides for the standard grid config
   */
  constructor(args)
  {
    ObjectAssign(this, config.grid, args);
    /** @type {HTMLElement} */
    this.el = document.querySelector(this.container);
    /** @type {number} */
    this.offsetX = 0;
    /** @type {number} */
    this.offsetY = 0;
    /** @type {HTMLCanvasElement} */
    this.canvas = undefined;
    /** @type {CanvasRenderingContext2D} */
    this.ctx = undefined;
  }
  
  /**
   * Builds the canvas element to a size inferred from the config
   */
  createCanvas()
  {
    this.canvas = document.createElement('canvas');
    this.el.appendChild(this.canvas);
    this.canvas.width = this.columns * this.size;
    this.canvas.height = this.rows * this.size;
    this.ctx = this.canvas.getContext('2d');
  }
  
  /**
   * Lays out the canvas grid in rows and columns
   */
  layout()
  {
    this.ctx.strokeStyle = this.lines.color;
    this.ctx.lineWidth = this.lines.width;
    if (!this.ctx || !(this.ctx instanceof CanvasRenderingContext2D))
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
  
  /**
   * Draws the rectangular grid on the canvas
   * @param {number} x - the starting X coordinate
   * @param {number} y - the starting Y coordinate
   */
  draw(x, y)
  {
    let fromX = x * this.size + this.lines.width / 2;
    let fromY = y * this.size + this.lines.width / 2;
    let toX = this.size - this.lines.width;
    let toY = this.size - this.lines.width;
    this.ctx.strokeRect(fromX, fromY, toX, toY);
  }
  
  /**
   * Ascertains whether the current event is a tap or a click
   * @param {Event} event - a click or touch event
   */
  checkTouch(event) {
    return (event.changedTouches) ? event.changedTouches[0] : event;
  }
  
  /**
   * Instigates the rotation logic on mousedown
   * @param {Event} event - a mousedown or touchstart event
   */
  startRotate(event)
  {
    if (event.target === this.canvas || event.target === this.canvas.parentNode)
    {
      event.preventDefault();
      startX = this.checkTouch(event).pageX - this.offsetX;
      startY = this.checkTouch(event).pageY - this.offsetY;
      document.documentElement.setAttribute('data-dragging', '');
    }
  }
  
  /**
   * Cancels the rotation logic on mouseup
   * @param {Event} event - a mouseup or touchend event
   */
  stopRotate(event)
  {
    if (startX !== null || startY !== null)
    {
      event.preventDefault();
      startX = null;
      startY = null;
      document.documentElement.removeAttribute('data-dragging');
    }
  }
  
  /**
   * Rotates the grid on mousemove
   * @param {Event} event - a mousemove or touchmove event
   */
  rotate(event)
  {
    if(startX !== null && startY !== null)
    {
      event.preventDefault();
      
      this.offsetX = this.clamp((this.checkTouch(event).pageX - startX), this.angle.x[0], this.angle.x[1]);
      this.offsetY = this.clamp((this.checkTouch(event).pageY - startY), this.angle.y[0], this.angle.y[1]);
      
      this.canvas.parentNode.style.transform =
      this.canvas.parentNode.style.webkitTransform =
      this.canvas.parentNode.style.mozTransform =
      this.canvas.parentNode.style.msTransform =
      this.canvas.parentNode.style.oTransform = `perspective(1000px) rotateX(${this.offsetY}deg) rotateZ(${this.offsetX}deg)`;
    }
  }
  
  /**
   * Clamps a rotation value to a positive and negative
   * minimum and maximum integer range
   * @param {number} value - the value to clamp
   * @param {number} max - the maximum positive value
   * @param {number} min - the maximum negative value
   */
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
  
  /**
   * Rigs up the listeners for this class
   */
  listen()
  {
    document.addEventListener('mousedown', this.startRotate.bind(this), true);
    document.addEventListener('mousemove', this.rotate.bind(this));
    document.addEventListener('mouseup', this.stopRotate.bind(this));
    
    document.addEventListener('touchstart', this.startRotate.bind(this));
    document.addEventListener('touchmove', this.rotate.bind(this));
    document.addEventListener('touchend', this.stopRotate.bind(this));
  }
  
}