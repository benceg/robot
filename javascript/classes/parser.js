import Robot from './robot';

export default class Parser {
  
  constructor(robot) {
    
    if (!robot instanceof Robot) {
      throw new Error('Parser needs to connect to an instantiated robot');
    }
    
  }
  
  load(target) {
    
  }
  
  parse() {
    
  }
  
  listen() {
    
  }
  
}