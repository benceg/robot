import config from '../../config/config.json';
import Robot from '../../javascript/classes/robot';
import Grid from '../../javascript/classes/grid';

describe('Robot', ()=> {
  
  it('can be instantiated with arguments that override default settings', ()=> {
    
    let robot = new Robot();
    let roomba = new Robot({ name : 'Roomba' });
    
    expect(robot.name).toBe('Robot');
    expect(roomba.name).toBe('Roomba');
    
  });
  
  describe('render', ()=> {
    
    let grid = new Grid();
    let robot = new Robot();
    
    robot.connectTo(grid);
    
    it('renders the robot in proximity to the game board', ()=> {
      robot.render();
      expect(document.getElementById('robot') instanceof Node).toBeTruthy();
    });
    
  });
  
  describe('animate', ()=> {
    
    let grid = new Grid({ size : 10 });
    let robot = new Robot();
    
    robot.connectTo(grid);
    
    it('manoeuvres the robot using CSS transforms based on the grid size', ()=> {
      robot.render();
      robot.position.a = 0;
      robot.position.x = 2;
      robot.position.y = 3;
      robot.animate();
      expect(robot.robot.style.transform).toBe(`translate3d(20px, -30px, ${config.robot.hover}px) rotate(0deg)`);
    });
    
  });
  
  describe('connectTo', ()=> {
    
    it('plugs the robot into the grid', ()=> {
      
      let grid = new Grid();
      let robot = new Robot();
      
      robot.connectTo(grid);
      expect(robot.grid instanceof Grid).toBeTruthy();
      
    });
    
    it('won\'t plug into anything that isn\'t a grid object', ()=> {
      
      let grid = 'not grid';
      let robot = new Robot();
      
      expect(()=> {
        robot.connectTo(grid);
      }).toThrow();
      
    });
    
  });
  
  describe('validateX', ()=> {
    
    let grid = new Grid({ columns : 3, rows : 3 });
    let robot = new Robot();
    
    robot.connectTo(grid);
    
    it('ensures the number is greater than zero and does not exceed the number of columns on the board', ()=> {
      
      expect(robot.validateX(-1)).toBeFalsy();
      expect(robot.validateX(4)).toBeFalsy();
      expect(robot.validateX(2)).toBeTruthy();
      
    });
    
  });
  
  describe('validateY', ()=> {
    
    let grid = new Grid({ columns : 3, rows : 3 });
    let robot = new Robot();
    
    robot.connectTo(grid);
    
    it('ensures the number is greater than zero and does not exceed the number of rows on the board', ()=> {
      
      expect(robot.validateY(-1)).toBeFalsy();
      expect(robot.validateY(4)).toBeFalsy();
      expect(robot.validateY(2)).toBeTruthy();
      
    });
    
  });
  
  describe('validateF', ()=> {
    
    let robot = new Robot();
    
    it('checks the config file for the appropriate heading title and sets rotation accordingly', ()=> {
      
      expect(robot.validateF('OTHER')).toBeFalsy();
      expect(robot.validateF('NORTH')).toBeTruthy();
      
    });
    
  });
  
  describe('place', ()=> {
    
    var grid = new Grid({ columns : 3, rows : 3 });
    var robot = new Robot();
    
    robot.connectTo(grid);
    
    beforeEach(function() {
      spyOn(Robot.prototype, 'render').and.stub();
      spyOn(Robot.prototype, 'animate').and.stub();
    });
    
    it('places the robot on the board at the desired coordinates and heading', ()=> {
      
      robot.place(2,2,'EAST');
      
      expect(robot.placed).toBeTruthy();
      expect(robot.position.x).toBe(2);
      expect(robot.position.y).toBe(2);
      expect(robot.position.f).toBe('EAST');
      expect(robot.render).toHaveBeenCalled();
      expect(robot.animate).toHaveBeenCalled();
      
    });
    
    it('uses a default set of coordinates and heading if no position is specified', ()=> {
      
      robot.place();
      
      expect(robot.position.x).toBe(0);
      expect(robot.position.y).toBe(0);
      expect(robot.position.f).toBe('NORTH');
      
    });
    
    it('will ignore invalid placement', ()=> {
      
      robot.place(6,6,'OTHER');
      
      expect(robot.placed).toBeTruthy();
      expect(robot.position.x).toBe(0);
      expect(robot.position.y).toBe(0);
      expect(robot.position.f).toBe('NORTH');
      
    });
    
  });
  
  describe('move', ()=> {
    
    beforeEach(()=> {
      spyOn(Robot.prototype, 'validateX').and.callThrough();
      spyOn(Robot.prototype, 'validateY').and.callThrough();
      spyOn(Robot.prototype, 'animate').and.stub();
    });
    
    let grid = new Grid();
    let robot = new Robot();
    
    robot.connectTo(grid);
    
    it('should not be allowed if the robot has not been placed', ()=> {
      expect(()=> {
        robot.move();
      }).toThrow();
    });
    
    it('should validate and change the position of the robot according to the headings configuration', ()=> {
      robot.placed = true;
      robot.position.f = 'WEST';
      robot.move();
      expect(Robot.prototype.validateX).toHaveBeenCalled();
      expect(Robot.prototype.validateY).toHaveBeenCalled();
      expect(Robot.prototype.animate).toHaveBeenCalled();
      robot.position.f = 'SOUTH';
      robot.move();
      expect(Robot.prototype.validateX).toHaveBeenCalled();
      expect(Robot.prototype.validateY).toHaveBeenCalled();
      expect(Robot.prototype.animate).toHaveBeenCalled();
      robot.position.f = 'EAST';
      robot.move();
      expect(Robot.prototype.validateX).toHaveBeenCalled();
      expect(Robot.prototype.validateY).toHaveBeenCalled();
      expect(Robot.prototype.animate).toHaveBeenCalled();
    });
    
  });

  describe('clampRotation', ()=> {
    
    let robot = new Robot();
    
    it('constrains rotation to positive integer values between 0 and 360 degrees', ()=> {
      expect(robot.clampRotation(450)).toBe(90);
      expect(robot.clampRotation(-90)).toBe(270);
      expect(robot.clampRotation(270)).toBe(270);
    });
    
  });
  
  describe('rotate', ()=> {
    
    let robot = new Robot();
    let grid = new Grid();
    
    robot.connectTo(grid);
    
    it('may not be invoked if the robot has not been placed', ()=> {
      expect(function() { robot.rotate('left'); }).toThrow();
    });
    
    it('can rotate the robot 90 degrees anticlockwise', ()=> {
      robot.place();
      robot.rotate('left');
      expect(robot.position.r).toBe(270);
    });
    
    it('should always reflect a positive integer value for degrees', ()=> {
      robot.place();
      robot.position.r = 450;
      robot.rotate('left');
      expect(robot.position.r).toBe(0);
    });
    
    it('can rotate the robot 90 degrees clockwise', ()=> {
      robot.place();
      robot.rotate('right');
      expect(robot.position.r).toBe(90);
    });
    
    it('defaults to rotating right', ()=> {
      robot.place();
      robot.rotate();
      expect(robot.position.r).toBe(90);
    });
    
  });
  
  describe('left', ()=> {
    
    let robot = new Robot();
    
    it('should proxy to the rotate function with a `left` argument', ()=> {
      spyOn(robot, 'rotate').and.stub();
      robot.left();
      expect(robot.rotate).toHaveBeenCalledWith('left');
    });
    
  });
  
  describe('right', ()=> {
    
    let robot = new Robot();
    
    it('should proxy to the rotate function with a `right` argument', ()=> {
      spyOn(robot, 'rotate').and.stub();
      robot.right();
      expect(robot.rotate).toHaveBeenCalledWith('right');
    });
    
  });
  
  describe('report', ()=> {
    
    let robot = new Robot();
    let grid = new Grid();
    robot.connectTo(grid);
    
    beforeEach(()=> {
      spyOn(robot, 'broadcast').and.stub();
    });
    
    it('should send an invalidation message if the robot is not on the board', ()=> {
      robot.report();
      expect(robot.broadcast).toHaveBeenCalledWith('report', {
        coords : false,
        message : `${robot.name} is not yet on the board`
      });
    });
    
    it('should otherwise send its coordinates through with a message', ()=> {
      robot.place();
      robot.report();
      expect(robot.broadcast).toHaveBeenCalledWith('report', {
        coords : { X : robot.position.x, Y : robot.position.y, F : robot.position.f },
        message : `${robot.name} is at X${robot.position.x}, Y${robot.position.y} and facing ${robot.position.f.toLowerCase()}`
      });
    });
    
  });
  
  describe('handleKeypress', ()=> {
    
    let robot = new Robot();
    let grid = new Grid();
    robot.connectTo(grid);
    
    let event = {
      preventDefault : function() {},
      target : { nodeName : 'LI' },
      which : 32 // space = `place`
    };
    
    beforeEach(()=> {
      spyOn(robot, 'place').and.stub();
    });
    
    it('should intercept a keypress and match it with a configured command', ()=> {
      robot.handleKeypress(event);
      expect(robot.place).toHaveBeenCalled();
    });
    
    it('should not be fired if the keypress target is an input', ()=> {
      event.target.nodeName = 'INPUT';
      robot.handleKeypress(event);
      expect(robot.place).not.toHaveBeenCalled();
      event.target.nodeName = 'LI';
    });
    
    it('should not be fired if the robot is already on the move', ()=> {
      robot.moving = true;
      robot.handleKeypress(event);
      expect(robot.place).not.toHaveBeenCalled();
      robot.moving = false;
    });
    
    it('should not be fired if no mapping is found for the key', ()=> {
      spyOn(event, 'preventDefault').and.stub();
      event.which = 99;
      robot.handleKeypress(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
      event.which = 32;
    });
    
  });
  
  describe('handleClick', ()=> {
    
    let robot = new Robot();
    let grid = new Grid();
    robot.connectTo(grid);
    
    let elem = document.createElement('a');
    elem.setAttribute('data-action', 'place');
    
    let event = {
      preventDefault : function() {},
      stopPropagation : function() {},
      target : elem
    };
    
    beforeEach(()=> {
      spyOn(robot, 'place').and.stub();
    });
    
    it('should intercept a click and match it with a configured command', ()=> {
      robot.handleClick(event);
      expect(robot.place).toHaveBeenCalled();
    });
    
    it('should not be fired if the robot is already on the move', ()=> {
      robot.moving = true;
      robot.handleClick(event);
      expect(robot.place).not.toHaveBeenCalled();
      robot.moving = false;
    });
    
    it('should not be fired if no mapping is found for the data-action attribute', ()=> {
      elem.setAttribute('data-action', 'test');
      robot.handleClick(event);
      expect(robot.place).not.toHaveBeenCalled();
    });
    
    it('should not be fired if the click target does not have a data-action attribute', ()=> {
      spyOn(event, 'preventDefault').and.stub();
      elem.removeAttribute('data-action');
      robot.handleClick(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
    
  });

  describe('registerCommands', ()=> {
    
    let robot = new Robot();
    let grid = new Grid();
    robot.connectTo(grid);
    
    it('should cross-reference regex commands with their component functions', ()=> { 
      let commands = robot.registerCommands();
      expect(typeof commands).toBe('object');
      
      for(var i in commands) {
        expect(()=> { commands[i].action(); }).not.toThrow();
        expect(typeof commands[i].action).toBe('function');
      }
    });
    
  });
  
  describe('listen', ()=> {
    
    let robot = new Robot();
    
    it('should not throw', ()=> {
      expect(()=> { robot.listen(); }).not.toThrow();
    });
    
  });
  
});