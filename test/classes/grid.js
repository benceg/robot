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
      
      let grid = new Grid();
      
      expect(()=> {
        grid.layout();
      }).toThrow();
      
      expect(()=> {
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
  
});