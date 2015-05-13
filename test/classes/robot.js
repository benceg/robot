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
      expect(robot.robot.style.transform).toBe('translate3d(20px, -30px, 10px) rotate(0deg)');
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
  
  describe('rotate', ()=> {
    
  });
  
  describe('listen', ()=> {
    
    let robot = new Robot('Test');    
    
    it('should listen to movement events and change its position accordingly', ()=> {
      spyOn(robot, 'move').and.stub();
      //let event = new Event('move', { x : 0, y : 0 });
      //document.dispatchEvent('move');
      //expect(robot.move).toHaveBeenCalledWith({ x : 0, y : 0 });
    });
    
    it('should listen to rotation events and change its heading accordingly', ()=> {
      spyOn(robot, 'rotate').and.stub();
      //let event = new Event('rotate', 90);
      //document.dispatchEvent('rotate');
      //expect(robot.move).toHaveBeenCalledWith({ x : 0, y : 0 });
    });
    
  });
  
  describe('playSound', ()=> {
    
    it('should play a sound on movement and heading change', ()=> {
      
    });
    
  });
  
});