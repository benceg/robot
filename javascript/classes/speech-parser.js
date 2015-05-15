import config from '../../config/config.json';
import Mumble from 'mumble-js';
import Robot from './robot';

Object.freeze(config);

/**
 * The speech parser addition parses speech fed to it via the Web Speech API
 */
export default class SpeechParser
{
  
  /**
   * Bootstraps the class defaults
   * @param {Robot} robot - an instantiated Robot class
   */
  constructor(robot)
  {
    if (!(robot instanceof Robot))
    {
      throw new Error('Parser needs to connect to an instantiated robot');
    }
    
    /** @type {Robot} */
    this.robot = robot;
    
    /** @type {Object} */
    this.commands = this.robot.registerCommands();
    
    /** @type {Mumble} */
    this.mumble = new Mumble({
      language : config.language,
      commands : this.commands
    });
  }
  
  /**
   * Invokes Mumble's listening cycle
   */
  listen()
  {
    this.mumble.start();
  }
  
}