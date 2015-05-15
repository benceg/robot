import config from '../../config/config.json';
import SoundBoard from '../../javascript/classes/sound-board';

describe('SoundBoard', ()=> {
  
  // Mocking audio API due to PhantomJS' lack of media codecs
  window.Audio = function() {
    this.src = '';
  };
  
  window.Audio.prototype.play = function() {};
  window.Audio.prototype.addEventListener = function(ev, cb) {
    cb();
  };
  
  let domNode = document.createElement('a');
  domNode.id = 'elem';
  document.body.appendChild(domNode);
  
  let broadcast = document.createEvent('CustomEvent');
  broadcast.initCustomEvent('broadcast:sound', false, false);
  
  let click = function(el){
    var ev = document.createEvent("MouseEvent");
    ev.initMouseEvent("click", true, true);
    el.dispatchEvent(ev);
  };
  
  it('takes an optional DOM string toggle element constructor argument', ()=> {
    let soundBoard = new SoundBoard();
  });
  
  describe('play', ()=> {
    
    beforeEach(()=> {
      spyOn(window.Audio.prototype, 'play').and.stub();
    });
    
    let soundBoard = new SoundBoard();
    let event = { detail : 'audio.mp3' };
    
    it('takes an optional DOM string toggle element constructor argument', ()=> {
      soundBoard.play(event);
      expect(window.Audio.prototype.play).toHaveBeenCalled();
    });
    
    it('does not play if the sound is off', ()=> {
      soundBoard.soundOn = false;
      soundBoard.play(event);
      expect(window.Audio.prototype.play).not.toHaveBeenCalled();
    });
    
    it('does not play a sound file that is already playing', ()=> {
      soundBoard.soundOn = true;
      soundBoard.audio.src = 'audio.mp3';
      soundBoard.play(event);
      expect(window.Audio.prototype.play).not.toHaveBeenCalled();
    });
  });
  
  describe('toggleSound', ()=> {
    
    let soundBoard = new SoundBoard();
    
    it('should toggle the soundOn value', function() {
      soundBoard.toggleSound();
      expect(soundBoard.soundOn).toBeFalsy();
      soundBoard.toggleSound();
      expect(soundBoard.soundOn).toBeTruthy();
    });
    
  });
  
  describe('reset', ()=> {
    
    let soundBoard = new SoundBoard();
    
    it('should toggle the soundOn value', function() {
      soundBoard.audio.src = 'audio.mp3';
      soundBoard.reset();
      expect(soundBoard.audio.src).toBe('');
    });
    
  });
  
  describe('listen', ()=> {
    
    it('should attach event listeners', ()=> {
      
      let soundBoard = new SoundBoard();
     
      spyOn(soundBoard, 'play').and.stub();
      soundBoard.listen();
      document.dispatchEvent(broadcast);
      expect(soundBoard.play).toHaveBeenCalled();
      
    });
    
    it('should attach a toggle event listener if toggle is enabled', ()=> {
      
      let soundBoard = new SoundBoard('#elem');
      
      soundBoard.listen();
      click(soundBoard.toggles);
      expect(soundBoard.soundOn).toBeFalsy();
      
    });
    
  });

});