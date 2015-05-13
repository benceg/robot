import Grid from "./classes/grid";
import Robot from "./classes/robot";
import Reporter from "./classes/reporter";
import TextParser from "./classes/text-parser";
import SpeechParser from "./classes/speech-parser";

let grid = new Grid({
  container : '#board',
  columns : 5,
  rows : 5
});

let robot = new Robot({
  name : 'Roomba'
});

let reporter = new Reporter('#report');

let textParser = new TextParser(robot);
let speechParser = new SpeechParser(robot);

document.addEventListener('DOMContentLoaded', ()=> {
  
  grid.createCanvas();
  grid.layout();
  grid.listen();
  
  robot.connectTo(grid);
  robot.listen();
  
  textParser.listen();
  // speechParser.listen();
  
  reporter.listen();
  
});