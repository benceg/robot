import config from '../../config/config.json';
import Grid from '../../javascript/classes/grid';

describe('Grid', ()=> {
  
  it('takes a hash of parameters as an optional constructor argument', ()=> {
    let grid = new Grid({
      rows : 1,
      columns : 1
    });
    expect(grid.columns).toBe(1);
    expect(grid.rows).toBe(1);
  });
  
  it('defaults to config file constructor arguments', ()=> {
    let grid = new Grid();
    expect(grid.columns).toBe(config.grid.columns);
    expect(grid.rows).toBe(config.grid.rows);
  });
  
  describe('layout', ()=> {
    
    it('only works given an existing canvas context', ()=> {
      
      expect(()=> {
        let grid = new Grid();
        grid.layout();
      }).toThrow();
      
      expect(()=> {
        let grid = new Grid();
        grid.ctx = '';
        grid.layout();
      }).toThrow();
      
      expect(()=> {
        let grid = new Grid();
        grid.createCanvas();
        grid.layout();
      }).not.toThrow();
      
    });
    
  });
  
  describe('createCanvas', ()=> {
    
    let grid = new Grid({
      columns : 10,
      rows : 10,
      size : 20
    });
    
    it('lays out a canvas using the grid\'s width, height and size constructor arguments', ()=> {
      grid.createCanvas();
      expect(grid.canvas.width).toBe(200);
      expect(grid.canvas.height).toBe(200);
    });
    
  });
  
  describe('checkTouch', ()=> {
    
    let grid = new Grid();
    
    it('should return the event if no touches are intercepted', ()=> {
      let event = {};
      expect(grid.checkTouch(event)).toBe(event);
    });
    
    it('should return the first touch in an array of touches', ()=> {
      let event = { changedTouches : [1, 2] };
      expect(grid.checkTouch(event)).toBe(1);
    });
    
  });
  
  describe('startRotate', ()=> {
    
    let grid = new Grid();
    grid.createCanvas();
    grid.layout();
    
    let click = {
      preventDefault : function() {},
      target : null,
      pageX : 0,
      pageY : 0
    };
    
    it('should do nothing if the event\'s target is not the grid\'s canvas element', ()=> {
      grid.startRotate(click);
      expect(document.documentElement.dataset.dragging).toBeUndefined();
    });
    
    it('should otherwise add a dragging data attribute to the document element', ()=> {
      click.target = grid.canvas;
      grid.startRotate(click);
      expect(document.documentElement.dataset.dragging).toBe('');
    });
    
  });
  
  describe('stopRotate', ()=> {
    
    let grid = new Grid();
    grid.createCanvas();
    grid.layout();
    
    let click = {
      preventDefault : function() {},
      target : grid.canvas,
      pageX : 0,
      pageY : 0
    };
    
    it('should otherwise remove the dragging data attribute from the document element', ()=> {
      grid.startRotate(click);
      expect(document.documentElement.dataset.dragging).toBe('');
      grid.stopRotate(click);
      expect(document.documentElement.dataset.dragging).toBeUndefined;
    });
    
    it('should do nothing if either startX or startY is not defined', ()=> {
      spyOn(click, 'preventDefault').and.stub();
      grid.stopRotate(click);
      expect(click.preventDefault).not.toHaveBeenCalled();
    });
    
  });
  
  describe('rotate', ()=> {
    
    let grid = new Grid();
    grid.createCanvas();
    grid.layout();
    
    let click = {
      preventDefault : function() {},
      target : grid.canvas,
      pageX : 0,
      pageY : 0
    };
    
    let drag = {
      preventDefault : function() {},
      target : grid.canvas,
      pageX : 100,
      pageY : 100
    };
    
    it('should rotate the game board', ()=> {
      grid.startRotate(click);
      grid.rotate(drag);
      expect(grid.canvas.parentNode.style.webkitTransform).toBe('perspective(1000px) rotateX(65deg) rotateZ(60deg)');
    });
    
    it('should do nothing if either startX or startY is not defined', ()=> {
      grid.stopRotate(click);
      grid.rotate(drag);
      expect(grid.canvas.parentNode.style.webkitTransform).toBe('perspective(1000px) rotateX(65deg) rotateZ(60deg)');
    });
    
  });
  
  describe('clamp', ()=> {
    
    let grid = new Grid();
    
    it('should keep a rotation angle clamped between a supplied positive high and negative low integer', ()=> {
      expect(grid.clamp(101, 100, 90)).toBe(100);
      expect(grid.clamp(-91, 100, 90)).toBe(-90);
      expect(grid.clamp(99, 100, 90)).toBe(99);
    });
    
    it('should default to no value, 60 max and 60 min', ()=> {
      expect(grid.clamp(61)).toBe(60);
      expect(grid.clamp(-61)).toBe(-60);
      expect(grid.clamp(30)).toBe(30);
    });
    
  });
  
  describe('listen', ()=> {
    
    let grid = new Grid();
    
    it('should not throw', ()=> {
      expect(()=> { grid.listen(); }).not.toThrow();
    });
    
  });
  
});