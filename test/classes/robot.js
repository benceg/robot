import Robot from '../../javascript/classes/robot';

describe('Robot', ()=> {
  
  it('has a default name', ()=> {
    
  });
  
  it('has a default position', ()=> {
    
  });
  
  it('has default sound files', ()=> {
    
  });
  
  it('has a default sprite brush', ()=> {
    
  });
  
  it('can be instantiated with any valid name, position and sprite', ()=> {
    
    expect(()=> {
      let toby = new Robot('Toby', { x : 0, y : 1 }, 'brush.png');
    }).not.toThrow();
    
  });
  
  describe('listen', ()=> {
    
    let robot = new Robot('Test');
    
    it('should listen to movement events', ()=> {
      
    });
    
    it('should change its position accordingly', ()=> {
      
    });
    
    it('should listen to rotation events', ()=> {
      
    });
    
    it('should change its orientation accordingly', ()=> {
      
    });
    
  });
  
  describe('playSound', ()=> {
    
    it('should play a sound on movement and orientation change', ()=> {
      
    });
    
  });
  
  describe('moveTo', ()=> {
    
  });
  
});