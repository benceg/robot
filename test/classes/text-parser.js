import config from '../../config/config.json';
import Robot from '../../javascript/classes/robot';
import TextParser from '../../javascript/classes/text-parser';
import TestDemo from '../../demo/unit-test.txt';

describe('TextParser', ()=> {
  
  it('should be instantiated with a robot instance', ()=> {
    
    expect(()=> { let textParser = new TextParser() }).toThrow();
    expect(()=> { let textParser = new TextParser('robot') }).toThrow();
    expect(()=> { let robot = new Robot(); let textParser = new TextParser(robot) }).not.toThrow();
    
  });
  
  describe('digest', ()=> {
    
    it('should set the parsing parameter to true', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      
      expect(textParser.parsing).toBeFalsy();
      textParser.digest();
      expect(textParser.parsing).toBeTruthy();
    });
    
  });
  
  describe('cancelDigest', ()=> {
    
    it('should cancel the interval cycle', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      textParser.digest();
      textParser.cancelDigest();
      expect(textParser.interval).toBe(null);
    });
    
  });
  
  describe('tick', ()=> {
    
    it('should set the parsing parameter to false if the queue is empty', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      
      textParser.parsing = true;
      textParser.tick();
      expect(textParser.parsing).toBeFalsy();
    });
    
    it('should otherwise invole the readLn function and shift the queue', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      
      textParser.queue = [1, 2];
      
      spyOn(textParser, 'readLn').and.stub();
      
      textParser.tick();
      expect(textParser.queue.length).toBe(1);
      expect(textParser.readLn).toHaveBeenCalled();
    });
    
  });
  
  describe('readLn', ()=> {
    
    it('should match a single command to a single function', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      
      spyOn(robot, 'place').and.stub();
      
      textParser.readLn('PLACE');
      expect(robot.place).toHaveBeenCalled();
    });
    
    it('should throw an error if the appropriate function is not found', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      
      expect(()=> { textParser.readLn('NOTHING'); }).toThrow();
    });
    
  });
  
  describe('enqueue', ()=> {
    
    let event = {
      target : {
        result : TestDemo
      }
    };
    
    it('should trim and split an input text file into parsable lines', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      
      textParser.enqueue(event);
      expect(textParser.queue.length).toBe(6);
    });
    
    it('should invoke a digest cycle', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      
      spyOn(textParser, 'digest').and.stub();
      
      textParser.enqueue(event);
      expect(textParser.digest).toHaveBeenCalled();
    });
    
  });
  
  describe('loadFile', ()=> {
    
    let event = {
      preventDefault : function() {},
      stopPropagation : function() {},
      dataTransfer : {
        files : []
      }
    };
    
    it('should do nothing if the parser is currently parsing', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      textParser.parsing = true;
      textParser.loadFile(event);
    });
    
    it('should otherwise remove the data-file attribute on the document element', ()=> {
      document.documentElement.setAttribute('data-file', '');
      let robot = new Robot();
      let textParser = new TextParser(robot);
      textParser.loadFile(event);
      expect(document.documentElement.getAttribute('data-file')).toBe(null);
    });
    
  });
  
  describe('addDropState', ()=> {
    
    let event = {
      preventDefault : function() {},
      stopPropagation : function() {}
    };
    
    it('should do nothing if the parser is currently parsing', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      textParser.parsing = true;
      textParser.addDropState(event);
      expect(document.documentElement.getAttribute('data-file')).toBe(null);
    });
    
    it('should otherwise add a droppable file state to the document element', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      textParser.addDropState(event);
      expect(document.documentElement.getAttribute('data-file')).toBe('');
    });
    
  });
  
  describe('removeDropState', ()=> {
    
    let event = {
      preventDefault : function() {},
      stopPropagation : function() {}
    };
    
    it('should do nothing if the parser is currently parsing', ()=> {
      document.documentElement.setAttribute('data-file', '')
      let robot = new Robot();
      let textParser = new TextParser(robot);
      textParser.parsing = true;
      textParser.removeDropState(event);
      expect(document.documentElement.getAttribute('data-file')).toBe('');
    });
    
    it('should otherwise add a droppable file state to the document element', ()=> {
      document.documentElement.setAttribute('data-file', '')
      let robot = new Robot();
      let textParser = new TextParser(robot);
      textParser.removeDropState(event);
      expect(document.documentElement.getAttribute('data-file')).toBe(null);
    });
    
  });
  
  describe('listen', ()=> {
    
    it('should not throw', ()=> {
      let robot = new Robot();
      let textParser = new TextParser(robot);
      
      textParser.listen();
    });
    
  });
  
});