import Grid from "./classes/grid";
import Robot from "./classes/robot";
import Parser from "./classes/parser";
import Speech from "./classes/speech";

let grid = new Grid({
  container : '#board',
  columns : 5,
  rows : 5
});

let robot = new Robot({
  name : 'Roomba'
});

let parser = new Parser(robot);

let speech = new Speech(robot);

document.addEventListener('DOMContentLoaded', ()=> {
  
  grid.createCanvas();
  grid.layout();
  grid.listen();
  
  robot.connectTo(grid);
  robot.listen();
  
  parser.listen();
  
  speech.listen();
  
});