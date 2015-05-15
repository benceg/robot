/**
 * The reporter class
 */
export default class Reporter {
  
  constructor(container = '')
  {
    try
    {
      this.container = document.querySelector(container);
    }
    catch(e)
    {
      throw new Error('No container was specified for the reporter');
    }
  }
  
  report(event)
  {
    if (event.detail.coords) console.log(event.detail.coords);
    this.listItem(event.detail.message);
  }
  
  listItem(val)
  {
    let li = document.createElement('li');
    li.innerHTML = val;
    this.container.insertBefore(li, this.container.firstChild);
  }
  
  listen()
  {
    document.addEventListener('broadcast:report', this.report.bind(this));
  }

}