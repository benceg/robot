import config from '../../config/config.json';
import Mumble from 'mumble-js';
import Robot from './robot';

Object.freeze(config);

export default class SpeechParser
{
  
  constructor(robot)
  {
    if (!(robot instanceof Robot))
    {
      throw new Error('Parser needs to connect to an instantiated robot');
    }
    
    this.robot = robot;
    
    this.commands = this.robot.registerCommands();
    
    this.mumble = new Mumble({
      language : config.language,
      commands : this.commands
    });
  }
  
  listen()
  {
    this.mumble.start();
  }
  
}