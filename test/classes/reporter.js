import config from '../../config/config.json';
import Reporter from '../../javascript/classes/reporter';

describe('Reporter', ()=> {
  
  let elem = document.createElement('ul');
  elem.id = 'reporter';
  document.body.appendChild(elem);
  
  describe('constructor', ()=> {
    
    it('takes a DOM string as a compulsory constructor argument', ()=> {
      let reporter = new Reporter('#reporter');
      expect(reporter.container instanceof HTMLElement).toBeTruthy();
    });
    
    it('otherwise throws a non-blocking error to the console', ()=> {
      expect(function() { let reporter = new Reporter(); }).toThrow();
    });
    
  });
  
  describe('report', ()=> {
    
    let reporter = new Reporter('#reporter');
    
    it('logs coordinates, if any, to the console', ()=> {
      
      let event = { detail : { message : 'message' } };
      
      spyOn(console, 'log').and.stub();
      spyOn(reporter, 'listItem').and.stub();
      
      reporter.report(event);
      
      expect(console.log).not.toHaveBeenCalled();
      expect(reporter.listItem).toHaveBeenCalled();
      
      event.detail.coords = 'xy';
      
      reporter.report(event);
      
      expect(console.log).toHaveBeenCalled();
      expect(reporter.listItem).toHaveBeenCalled();
      
    });
    
  });
  
  describe('listItem', ()=> {
    
    let reporter = new Reporter('#reporter');
    
    it('should append a list item to the reporter\'s container element', ()=> {
      
      expect(reporter.container.childNodes.length).toBe(0);
      
      reporter.listItem('Hello World');
      
      expect(reporter.container.childNodes.length).toBe(1);
      expect(reporter.container.childNodes[0].nodeName).toBe('LI');
      expect(reporter.container.childNodes[0].textContent).toBe('Hello World');
      
    });
    
  });
  
  describe('listen', ()=> {
    
    let reporter = new Reporter('#reporter');
    
    it('should not throw', ()=> {
      
      expect(function() { reporter.listen(); }).not.toThrow();
      
    });
    
  });

});