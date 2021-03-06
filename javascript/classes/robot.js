import config from '../../config/config.json';
import Grid from './grid';
import ObjectAssign from 'object-assign';

Object.freeze(config);

/**
 * The robot class contains all the functions and parameters specific to the robot
 */
export default class Robot {
  
  /**
   * Overrides default robot settings and bootstraps the module
   * @param {Object} args - overrides for the standard robot config
   */
  constructor(args) {
    ObjectAssign(this, config.robot, args);
    /** @type {Grid} */
    this.grid = undefined;
    /** @type {boolean} */
    this.placed = false;
    /** @type {boolean} */
    this.moving = false;
    /** @type {HTMLElement} */
    this.robot = null;
    /** @type {Array} */
    this.queue = [];
  }
  
  /**
   * Renders the robot in proximity to the grid element
   */
  render()
  {
    this.robot = document.createElement('div');
    this.robot.style.width = this.robot.style.height = `${this.grid.size * 0.6}px`;
    this.robot.style.margin = `${this.grid.size * 0.2}px`;
    this.robot.id = 'robot';
    this.grid.el.appendChild(this.robot);
  }
  
  /**
   * Manoeuvres the robot according to its current state
   */
  animate()
  {
    this.robot.style.transform = 
    this.robot.style.webkitTransform =
    this.robot.style.mozTransform =
    this.robot.style.msTransform =
    this.robot.style.oTransform = `translate3d(${this.position.x * this.grid.size}px, -${this.position.y * this.grid.size}px, ${config.robot.hover}px) rotate(${this.position.a}deg)`;
    
    this.robot.setAttribute('data-heading', this.position.f.toLowerCase());
  }
  
  /**
   * Attaches the robot to the grid of choice
   * @param {Grid} grid - the instantiated grid object
   */
  connectTo(grid)
  {
    if (!(grid instanceof Grid))
    {
      throw new Error('first argument must be a grid instance');
    }
    this.grid = grid;
  }
  
  /**
   * Validates X as a coordinate on the board
   * @param {number} x - the desired new X coordinate
   */
  validateX(x)
  {
    return (typeof x === 'number' && x < this.grid.columns && x >= 0) ? true : false;
  }
  
  /**
   * Validates Y as a coordinate on the board
   * @param {number} y - the desired new Y coordinate
   */
  validateY(y)
  {
    return (typeof y === 'number' && y < this.grid.rows && y >= 0) ? true : false;
  }
  
  /**
   * Validates F as a bearing reference contained in the config file
   * @param {string} f - the uppercase compass direction
   */
  validateF(f)
  {
    return (typeof f === 'string' && typeof config.headings[f] === 'object') ? true : false;
  }
  
  /**
   * Places the robot at an arbitrary point on the board
   * @param {number} x - the X coordinate of the location
   * @param {number} y - the Y coordinate of the location
   * @param {string} f - the compass heading of the location
   */
  place(X = 0, Y = 0, F = 'NORTH')
  {
    let x = parseInt(X);
    let y = parseInt(Y);
    let f = F.toUpperCase();
    // X coordinate
    this.position.x = (this.validateX(x)) ? x : config.robot.position.x;
    // Y coordinate
    this.position.y = (this.validateY(y)) ? y : config.robot.position.y;
    // Heading
    this.position.f = (this.validateF(f)) ? f : config.robot.position.f;
    // Rotation
    this.position.r = (this.validateF(f)) ? config.headings[f].r : config.headings[config.robot.position.f].r;
    // Absolute rotation
    this.position.a = (this.validateF(f)) ? config.headings[f].r : config.headings[config.robot.position.f].r;
    
    if (this.placed === false)
    {
      this.render();
      this.placed = true;
    }
    
    this.animate();
  }
  
  /**
   * Moves the robot according to its current heading
   */
  move()
  {
    if (this.placed === true)
    {
      let oldPosition = {};
      let newPosition = config.headings[this.position.f];
      
      ObjectAssign(oldPosition, this.position);
      
      this.position.x = (this.validateX(this.position.x + newPosition.x)) ? (this.position.x + newPosition.x) : this.position.x;
      this.position.y = (this.validateY(this.position.y + newPosition.y)) ? (this.position.y + newPosition.y) : this.position.y;
      
      if(oldPosition.x === this.position.x && oldPosition.y === this.position.y) {
        this.broadcast('sound', this.sounds.error);
      } else {
        this.broadcast('sound', this.sounds.move);
      }
      
      this.animate();
    }
    else
    {
      throw new Error(this.name + ' has not been placed.');
    }
  }
  
  /**
   * Clamps rotation to positive integers between 0 and 360
   * @param {number} val - any number
   */
  clampRotation(val)
  {
    if (val < 0) {
      return (val + 360);
    } else if (val >= 360) {
      return (val - 360);
    } else {
      return val;
    }
  }
  
  /**
   * Rotates the robot to a new heading
   * @param {string} heading - either 'left' or 'right'
   */
  rotate(heading = 'right')
  {
    if (this.placed === true)
    {
      if (heading === 'left')
      {
        let newPos = this.position.r - config.increment;
        this.position.a -= config.increment;
        this.position.r = this.clampRotation(newPos);
      }
      else
      {
        let newPos = this.position.r + config.increment;
        this.position.a += config.increment;
        this.position.r = this.clampRotation(newPos);
      }
      
      for (var key in config.headings) {
        if (this.position.r === config.headings[key].r) {
          this.position.f = key;
        }
      }
      
      this.animate();
    }
    else
    {
      throw new Error(this.name + ' has not been placed.');
    }
  }
  
  /**
   * Proxy function to rotate from speech and text parser
   */
  left() {
    this.rotate('left');
  }
  
  /**
   * Proxy function to rotate from speech and text parser
   */
  right() {
    this.rotate('right');
  }
  
  /**
   * Announces the position and bearing of the robot
   */
  report()
  {
    let log = { coords : false, message : false };
    
    if (this.placed === true)
    {
      log.coords = {
        X : this.position.x,
        Y : this.position.y,
        F : this.position.f
      };
      log.message = `${this.name} is at X${this.position.x}, Y${this.position.y} and facing ${this.position.f.toLowerCase()}`
    }
    else
    {
      log.coords = false;
      log.message = `${this.name} is not yet on the board`;
    }
    
    this.broadcast('report', log);
  }
  
  /**
   * Listens for arrow and space key events
   * @param {string} type - the event type to broadcast (rendered as broadcast:type)
   * @param {Object} detail - the detail object to send as an event argument
   */
  broadcast(type, detail)
  {
    let event = document.createEvent('CustomEvent');
    event.initCustomEvent('broadcast:' + type, false, false, detail);
    document.dispatchEvent(event);
  }
  
  /**
   * Handles keypresses from arrow, enter and space key listener
   * @param {Event} event - the keydown event
   */
  handleKeypress(event)
  {
    let mapping = config.mappings[event.which];
    
    if (event.target.nodeName !== 'INPUT' && this.moving === false && mapping && typeof this[mapping.command] === 'function')
    {
      event.preventDefault();
      let args = mapping.arguments || [];
      this[mapping.command].apply(this, mapping.arguments);
    }
  }
  
  /**
   * Handles clicks
   * @param {Event} event - the click or touch event
   */
  handleClick(event)
  {
    if (event.target.getAttribute('data-action') && this.moving === false)
    {
      event.preventDefault();
      event.stopPropagation();
      
      let command = event.target.getAttribute('data-action');
      if (typeof this[command] === 'function')
      {
        this[command]();
      }
    }
  }
  
  /**
   * Registers commands that pertain to this robot instance
   * from a list of configurable regular expressions
   * @param {Event} event - the keydown event
   */
  registerCommands()
  {
    let self = this;
    
    let commands = config.commands.map(function(i)
    {
      let cmd = {
        name : i.name,
        command : new RegExp(i.command, 'i'),
        action : function() {
          self[i.action].apply(self, arguments);
        }
      }
      
      return cmd;
    });
    
    return commands;
  }
  
  /**
   * Listens for arrow and space key events
   */
  listen()
  {
    document.addEventListener('keydown', this.handleKeypress.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
  }
  
}