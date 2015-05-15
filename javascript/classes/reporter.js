/**
 * The reporter class can report messages sent by other modules
 */
export default class Reporter {
  
  /**
   * Constructor expects a HTMLElement string identifier
   * @param {string} container - A HTMLElement identifier string
   */
  constructor(container = '')
  {
    try
    {
      /** @type {HTMLElement} */
      this.container = document.querySelector(container);
    }
    catch(e)
    {
      throw new Error('No container was specified for the reporter');
    }
  }
  
  /**
   * Intercepts a broadcasted event and reports it
   * @param {Event} event - an event of type `broadcast:report`
   */
  report(event)
  {
    if (event.detail.coords) console.log(event.detail.coords);
    this.listItem(event.detail.message);
  }
  
  /**
   * Creates a list item in the reporter's container
   * @param {string} val - the list item's text
   */
  listItem(val)
  {
    let li = document.createElement('li');
    li.innerHTML = val;
    this.container.insertBefore(li, this.container.firstChild);
  }
  
  /**
   * Rigs the broadcast event listener for `broadcast:report` events
   */
  listen()
  {
    document.addEventListener('broadcast:report', this.report.bind(this));
  }

}