import config from '../../config/config.json';
import Mumble from 'mumble-js';
import Robot from './robot';

Object.freeze(config);

export default class TextParser
{
  
  constructor(robot)
  {
    if (!robot instanceof Robot)
    {
      throw new Error('Parser needs to connect to an instantiated robot');
    }
    
    this.queue = [];
    
    this.robot = robot;
    
    this.commands = this.robot.registerCommands();
    
    this.digesting = true;
    
    this.digest();
  }
  
  digest() {
    let self = this;
    setTimeout(function() {
      requestAnimationFrame(self.digest.bind(self));
      if (self.queue.length)
      {
        self.readLn.call(self, self.queue[0]);
        self.queue.shift();
      }
    }, config.digest);
  }
  
  cancelDigest() {
    this.digesting = false;
  }
  
  readLn(ln) {
    let args = [];
    let command = this.commands.filter(function(i) {
      let match = ln.trim().match(i.command);
      if (match) args = match.slice(1, match.length);
      return match;
    });
    try {
      command[0].action.apply(self.robot, args);
    } catch(e) {
      this.queue = [];
      throw new Error(e.message);
    }
  }
  
  enqueue(event)
  {
    this.queue = this.queue.concat(event.target.result.trim().split('\n'));
  }
  
  loadFile(event)
  {
    event.stopPropagation();
    event.preventDefault();
    
    document.documentElement.removeAttribute('data-file');

    let file = event.dataTransfer.files[0];
    let reader = new FileReader();
    
    reader.onload = this.enqueue.bind(this);
    reader.readAsText(file);
  }
  
  addDropState(event)
  {
    event.stopPropagation();
    event.preventDefault();
    document.documentElement.setAttribute('data-file', '');
  }
  
  removeDropState(event)
  {
    event.stopPropagation();
    event.preventDefault();
    document.documentElement.removeAttribute('data-file');
  }
  
  listen()
  {
    document.documentElement.addEventListener('dragover', this.addDropState.bind(this));
    document.documentElement.addEventListener('dragend', this.removeDropState.bind(this));
    document.documentElement.addEventListener('dragleave', this.removeDropState.bind(this));
    document.documentElement.addEventListener('drop', this.loadFile.bind(this));
  }
  
}