import Grid from '../../javascript/classes/grid';

describe('Grid', ()=> {
  
  it('takes two numeric coordinate parameters', ()=> {
    
    expect(()=> {
      let grid = new Grid();
    }).toThrow();
    
    expect(()=> {
      let grid = new Grid(0,0);
    }).not.toThrow();
    
  });
  
  describe('layout', ()=> {
    
    let grid = new Grid(5,5);
    
    it('lays out the grid in rows and columns', ()=> {
      
      grid.layout();
      
    });
    
  });
  
});