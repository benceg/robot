/**
 * The soundboard addition plays sounds broadcast to it by other classes
 */
export default class SoundBoard {
  
  /**
   * Bootstraps the class defaults
   * @param {string} - a DOM string to use as a sound toggle
   */
  constructor(toggles)
  {
    this.soundOn = true;
    this.toggles = document.querySelector(toggles);
    this.audio = new Audio();
  }
  
  /**
   * The play function can be invoked from anywhere via
   * a broadcast:sound event
   * @param {Event} event - a broadcast event listener
   */
  play(event)
  {
    if (this.soundOn === true && event.detail !== this.audio.src.replace(window.location.href, ''))
    {
      this.audio.src = event.detail;
      this.audio.play();
    }
  }
  
  /**
   * Toggles whether any sound should play
   */
  toggleSound()
  {
    this.soundOn = (this.soundOn === true) ? false : true;
  }
  
  /**
   * Resets the src of the audio object
   */
  reset()
  {
    this.audio.src = '';
  }
  
  /**
   * Rigs up relevant event listeners
   */
  listen()
  {
    document.addEventListener('broadcast:sound', this.play.bind(this));
    this.audio.addEventListener('ended', this.reset.bind(this));
    if (this.toggles) this.toggles.addEventListener('click', this.toggleSound.bind(this));
  }

}