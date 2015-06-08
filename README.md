# The Roomba Experiment
### A JavaScript Minigame Challenge in ES 2015

---

[ ![Codeship Status for benceg/robot](https://codeship.com/projects/4dd4a350-dd50-0132-f8e6-1e8d60d0eabf/status?branch=master)](https://codeship.com/projects/80228)

Works in modern browsers (albeit with aesthetic differences given IE 11's incomplete 3D CSS support).

Took about 16-20 hours total to finish this (including build & testing scripts, code coverage, documentation and UAT).

## See it at https://benceg.github.io/robot/

- *Read the documentation* at http://git.io/vUjHW
- *See the test results* at http://git.io/vUjHG
- *See the code coverage* at http://git.io/vUjH3

---

### Instructions

- Challenge instructions are at https://goo.gl/dxJPYx.
- Drag the board to rotate it.
- Use the arrow keys to move the Roomba.
	- Hit `<return>` to receive a report, and `<space>` to place it.
- Speak into your microphone to move the Roomba.
	- Use the instruction sets detailed in the document above, with one exception...
	- To place the Roomba, you'll need to yell `Place X<x>, Y<y>, <direction>`, e.g. `Place X1, Y2, South`. This is because the Web Speech API construes concatenated digits as a single number (e.g. `1 2` = `12`). Unfortunately this cannot be surmounted in the API's current state.
	- Use headphones for best effect, especially if your device has speakers in close proximity with its microphone (e.g. a mobile device). If you do not have a pair of headphones on hand, reduce the volume of the game to prevent the microphone from picking it up.
	- It's also strongly recommended that you use a directional microphone in noisy environments.
- Drag & drop instruction sets formatted as they are in the document above, to have them read to the Roomba.
	- There is a set of demo instructions at `./demo/instructions.txt`.
- Use this on your mobile! Note that it will only work in portrait mode, given `<canvas>`'s lack of viewport respect and vice versa. Note that it should run at around 60FPS, even on a second generation iPad.
- Changing the configuration at `./config/config.json` is for power users only (instructions below), but may be worth it if you want to see a 50 x 50 square board grid perform as well as a 5 x 5 board. You can even add new directions and movement patterns for the robot (e.g. `SOUTH EAST`).
- Enjoy the rider's complaints when you try to send him off the board!

---

### Setup & Testing

#### Getting Started

1. Install `io.js` 2.0+ or `node.js` 0.12+.
2. Open a terminal in the project root and enter `npm install`.
3. Enter `npm install grunt-cli -g`.

#### Configuring the App

1. Configuration variables can be found at `./config/config.json`.
	- You can edit configuration variables for speech language (accent, in this case); grid size; robot details; sounds; key mappings and parser commands, among others.
2. After editing, you will need to run `grunt` or `grunt make` to recompile the game (see below).

#### Building the App

1. Enter `grunt` into the terminal to run a continuous, non-blocking build.
2. Enter `grunt make` to run the same build as above, followed by minification. *This is a single-run command.*

#### Testing

1. Enter `grunt test` into the terminal to fire up the continuous PhantomJS, Karma & Jasmine test suite runner.
2. Enter `grunt karma:ci` into the terminal to begin the single run test runner for continuous integration platforms.

---

### Challenge Write-up

#### Basics

- This was architected using ECMAScript 2015: the next generation of JavaScript. It was built using stable syntactic features and conventions of the new JavaScript.
- It was written with the use of only three micro libraries: `FastClick`, `Mumble` and an `Object.assign Polyfill`. This was done to prevent me from having to rewrite each of the above within the time limit.
- The app has 100% test coverage from Jasmine, Karma and Istanbul.
- It passes 100% of its tests.
- It also has 100% documentation coverage from ESDoc.

#### Techniques

- Built using a combination of functional, evented and imperative styles to demonstrate the advantages and disadvantages of each:
	- Instances are passed between objects imperatively, in order to provide maximum interoperability (it would be entirely feasible to have multiple board and robot instances if so desired).
	- The imperative model was favoured over a fully evented model given the messiness of having to generate multiple event namespace GUIDs, and the lack of testability within the evented model, as well as inconsistent browser support for `Event` and `CustomEvent` constructors, which would have led to an inscrutable codebase.
	- Custom events are launched from the document element and fed into the Reporter and Sound Board modules, meaning any action can fire a sound or a report if needed.
	- A little native functional programming (`Array.map, Array.filter, Object.assign`, etc) has been employed to translate configuration scripts to real live actions accomplishable by the Robot module.
- Uses `Object.freeze` to make the configuration object effectively immutable.
- Takes advantage of the ECMAScript 2015 `class` syntactic sugar, but could just as easily have been written using standard ECMAScript 5 modular or prototypal inheritance models. The codebase is completely future-proof as it currently stands, and transpiles to browser-legible ES 5.

#### HTML 5 APIs and Features

- [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
	- By not laying out squares using the DOM, the game grid performs incredibly well no matter what size you make it.
- [Web Speech](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

---

# This game was inspired by hideous Russian carpets everywhere.
