import config from '../../config/config.json';
import Mumble from 'mumble-js';
import Robot from './robot';

Object.freeze(config);

/**
 * The text parser class adds the ability to translate a file to commands
 */
export default class TextParser
{
  
  /**
   * Bootstraps the text parser
   * @param {Robot} robot - a Robot instance
   */
  constructor(robot)
  {
    if (!(robot instanceof Robot))
    {
      throw new Error('Parser needs to connect to an instantiated robot');
    }
    
    this.robot = robot;
    this.commands = this.robot.registerCommands();
    
    this.queue = [];
    this.parsing = false;
    this.interval = null;
  }
  
  /**
   * Invokes a digest cycle for the interpreter
   */
  digest() {
    this.parsing = true;
    this.interval = setInterval(this.tick.bind(this), config.digest);
  }
  
  /**
   * Reads the queue line for line or cancels if it reaches zero lines
   */
  tick() {
    if (this.queue.length)
    {
      this.readLn.call(this, this.queue[0]);
      this.queue.shift();
    }
    else
    {
      this.parsing = false;
      clearInterval(this.interval);
    }
  }
  
  /**
   * Allows manual clearing of the digest cycle
   */
  cancelDigest() {
    clearInterval(this.interval);
    this.interval = null;
  }
  
  /**
   * Reads a line and relates it to a command
   */
  readLn(ln) {
    let args = [];
    
    // Find the input command in the list of commands
    let command = this.commands.filter(function(i)
    {
      let match = ln.trim().match(i.command);
      if (match) args = match.slice(1, match.length);
      return match;
    });
    
    // Unfortunately we have to go imperative here as opposed to
    // broadcasting an event as we need to know whether or not to
    // clear an illegal text input queue on exception
    try {
      command[0].action.apply(self.robot, args);
    } catch(e) {
      this.queue = [];
      throw new Error(e.message);
    }
  }
  
  /**
   * Creates a queue from the lines of an input file
   * and invokes the digest cycle
   * @param {Event} event - a file API onload event
   */
  enqueue(event)
  {
    this.queue = this.queue.concat(event.target.result.trim().split('\n'));
    this.digest();
  }
  
  /**
   * Loads a file via the drag and drop and file APIs
   * @param {Event} event - a drop event
   */
  loadFile(event)
  {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.parsing === false)
    {
      document.documentElement.removeAttribute('data-file');

      let file = event.dataTransfer.files[0];
      let reader = new FileReader();
      
      reader.onload = this.enqueue.bind(this);
      reader.readAsText(file);
    }
  }
  
  /**
   * Adds a dragged-over state to the document element
   * @param {Event} event - a dragover event
   */
  addDropState(event)
  {
    event.stopPropagation();
    event.preventDefault();
    if (this.parsing === false) document.documentElement.setAttribute('data-file', '');
  }
  
  /**
   * Removes a dragged-over state from the document element
   * @param {Event} event - a dragover event
   */
  removeDropState(event)
  {
    event.stopPropagation();
    event.preventDefault();
    if (this.parsing === false) document.documentElement.removeAttribute('data-file');
  }
  
  /**
   * Bootstraps event listeners
   */
  listen()
  {
    document.documentElement.addEventListener('dragover', this.addDropState.bind(this));
    document.documentElement.addEventListener('dragend', this.removeDropState.bind(this));
    document.documentElement.addEventListener('dragleave', this.removeDropState.bind(this));
    document.documentElement.addEventListener('drop', this.loadFile.bind(this));
  }
  
}