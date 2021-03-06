import config from '../../config/config.json';
import Robot from '../../javascript/classes/robot';
import SpeechParser from '../../javascript/classes/speech-parser';

describe('SpeechParser', ()=> {
  
  it('should be instantiated with a robot instance', ()=> {
    
    expect(()=> { let speechParser = new SpeechParser() }).toThrow();
    expect(()=> { let speechParser = new SpeechParser('robot') }).toThrow();
    expect(()=> { let robot = new Robot(); let speechParser = new SpeechParser(robot) }).not.toThrow();
    
  });
  
  describe('listen', ()=> {
    
    it('should start Mumble if the Web Speech API is supported', ()=> {
      
      let robot = new Robot();
      let speechParser = new SpeechParser(robot);
      
      spyOn(speechParser.mumble, 'start').and.stub();
      
      speechParser.mumble.isAvailable = false;
      speechParser.listen();
      expect(speechParser.mumble.start).not.toHaveBeenCalled();
      
      speechParser.mumble.isAvailable = true;
      speechParser.listen();
      expect(speechParser.mumble.start).toHaveBeenCalled();
      
    });
    
  });
  
});