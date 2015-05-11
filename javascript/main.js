import Grid from "./classes/grid";
import Robot from "./classes/robot";

let grid = new Grid({
  container : '#board',
  columns : 5,
  rows : 5
});

let robot = new Robot({
  name : 'Roomba'
});

document.addEventListener('DOMContentLoaded', ()=> {
  
  grid.createCanvas();
  grid.layout();
  
  robot.connectTo(grid);
  robot.listen();
  
});