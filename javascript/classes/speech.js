import Mumble from 'mumble-js';
import Robot from './robot';

export default class Speech {
  
  constructor(robot) {
    
    if (!robot instanceof Robot) {
      throw new Error('Parser needs to connect to an instantiated robot');
    }
    
    this.mumble = new Mumble({
      language: 'en-GB',
      debug: false,
      commands: [
        {
          name: 'place',
          command: /^place$/,
          action: function() {
            robot.place();
          }
        },
        {
          name: 'place_at',
          command: /^place X(.+) Y(.+) (North|East|South|West)$/,
          action: function(x, y, f) {
            robot.place(parseInt(x), parseInt(y), f.toUpperCase());
          }
        },
        {
          name: 'move',
          command: /^move$/,
          action: function() {
            robot.move();
          }
        },
        {
          name: 'left',
          command: /^left$/,
          action: function() {
            robot.rotate('left');
          }
        },
        {
          name: 'right',
          command: /^right$/,
          action: function() {
            robot.rotate('right');
          }
        }
      ]
    });
    
  }
  
  listen() {
    
    this.mumble.start();
    
  }
  
}