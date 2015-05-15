import Grid from './classes/grid';
import Robot from './classes/robot';
import Reporter from './classes/reporter';
import SoundBoard from './classes/sound-board';
import TextParser from './classes/text-parser';
import SpeechParser from './classes/speech-parser';
import fastClick from 'fastclick';

let grid = new Grid({
  container : '#board',
  columns : 5,
  rows : 5
});

let robot = new Robot({
  name : 'Roomba'
});

let reporter = new Reporter('#report');
let soundBoard = new SoundBoard();

let textParser = new TextParser(robot);
let speechParser = new SpeechParser(robot);

document.addEventListener('DOMContentLoaded', ()=> {
  
  fastClick.attach(document.body);
  
  grid.createCanvas();
  grid.layout();
  grid.listen();
  
  robot.connectTo(grid);
  robot.listen();
  
  textParser.listen();
  // speechParser.listen();
  
  reporter.listen();
  soundBoard.listen();
  
});