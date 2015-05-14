/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _classesGrid = __webpack_require__(1);

	var _classesGrid2 = _interopRequireDefault(_classesGrid);

	var _classesRobot = __webpack_require__(4);

	var _classesRobot2 = _interopRequireDefault(_classesRobot);

	var _classesReporter = __webpack_require__(5);

	var _classesReporter2 = _interopRequireDefault(_classesReporter);

	var _classesTextParser = __webpack_require__(6);

	var _classesTextParser2 = _interopRequireDefault(_classesTextParser);

	var _classesSpeechParser = __webpack_require__(8);

	var _classesSpeechParser2 = _interopRequireDefault(_classesSpeechParser);

	var grid = new _classesGrid2["default"]({
	  container: "#board",
	  columns: 5,
	  rows: 5
	});

	var robot = new _classesRobot2["default"]({
	  name: "Roomba"
	});

	var reporter = new _classesReporter2["default"]("#report");

	var textParser = new _classesTextParser2["default"](robot);
	var speechParser = new _classesSpeechParser2["default"](robot);

	document.addEventListener("DOMContentLoaded", function () {

	  grid.createCanvas();
	  grid.layout();
	  grid.listen();

	  robot.connectTo(grid);
	  robot.listen();

	  textParser.listen();
	  // speechParser.listen();

	  reporter.listen();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _configConfigJson = __webpack_require__(2);

	var _configConfigJson2 = _interopRequireDefault(_configConfigJson);

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	Object.freeze(_configConfigJson2['default']);

	var startX = null;
	var startY = null;

	var Grid = (function () {
	  function Grid(args) {
	    _classCallCheck(this, Grid);

	    _objectAssign2['default'](this, _configConfigJson2['default'].grid, args);
	    this.el = document.querySelector(this.container);
	    this.offsetX = 0;
	    this.offsetY = 0;
	  }

	  _createClass(Grid, [{
	    key: 'createCanvas',
	    value: function createCanvas() {
	      this.canvas = document.createElement('canvas');
	      this.el.appendChild(this.canvas);
	      this.canvas.draggable = true;
	      this.canvas.width = this.columns * this.size;
	      this.canvas.height = this.rows * this.size;
	      this.ctx = this.canvas.getContext('2d');
	    }
	  }, {
	    key: 'layout',
	    value: function layout() {
	      this.ctx.strokeStyle = this.lines.color;
	      this.ctx.lineWidth = this.lines.width;
	      if (!this.ctx || !this.ctx instanceof CanvasRenderingContext2D) {
	        throw new Error('Grid.ctx is not a canvas element');
	      }
	      for (var y = 0; y < this.rows; y++) {
	        for (var x = 0; x < this.columns; x++) {
	          this.draw(x, y);
	        }
	      }
	    }
	  }, {
	    key: 'draw',
	    value: function draw(x, y) {
	      var fromX = x * this.size + this.lines.width / 2;
	      var fromY = y * this.size + this.lines.width / 2;
	      var toX = this.size - this.lines.width;
	      var toY = this.size - this.lines.width;
	      this.ctx.strokeRect(fromX, fromY, toX, toY);
	    }
	  }, {
	    key: 'checkTouch',
	    value: function checkTouch(event) {
	      return event.changedTouches ? event.changedTouches[0] : event;
	    }
	  }, {
	    key: 'startRotate',
	    value: function startRotate(event) {
	      if (event.target === this.canvas) {
	        event.preventDefault();
	        startX = this.checkTouch(event).pageX - this.offsetX;
	        startY = this.checkTouch(event).pageY - this.offsetY;
	        document.documentElement.setAttribute('data-dragging', '');
	      }
	    }
	  }, {
	    key: 'stopRotate',
	    value: function stopRotate(event) {
	      if (startX || startY) {
	        event.preventDefault();
	        startX = null;
	        startY = null;
	        document.documentElement.removeAttribute('data-dragging');
	      }
	    }
	  }, {
	    key: 'rotate',
	    value: function rotate(event) {
	      if (startX && startY) {
	        event.preventDefault();
	        this.offsetX = this.clamp(this.checkTouch(event).pageX - startX, 60);
	        this.offsetY = this.clamp(this.checkTouch(event).pageY - startY, 60, 0);
	        this.canvas.parentNode.style.transform = 'perspective(1000px) rotateX(' + this.offsetY + 'deg) rotateZ(' + this.offsetX + 'deg)';
	      }
	    }
	  }, {
	    key: 'clamp',
	    value: function clamp(value) {
	      var max = arguments[1] === undefined ? 60 : arguments[1];
	      var min = arguments[2] === undefined ? 60 : arguments[2];

	      if (value > max) {
	        return max;
	      } else if (value < -min) {
	        return -min;
	      } else {
	        return value;
	      }
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {
	      document.addEventListener('mousedown', this.startRotate.bind(this));
	      document.addEventListener('mousemove', this.rotate.bind(this));
	      document.addEventListener('mouseup', this.stopRotate.bind(this));

	      document.addEventListener('touchstart', this.startRotate.bind(this));
	      document.addEventListener('touchmove', this.rotate.bind(this));
	      document.addEventListener('touchend', this.stopRotate.bind(this));
	    }
	  }]);

	  return Grid;
	})();

	exports['default'] = Grid;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		"language": "en-GB",
		"digest": 1000,
		"grid": {
			"container": "body",
			"rows": 5,
			"columns": 5,
			"size": 100,
			"lines": {
				"color": "rgba(0,0,0,0.3)",
				"width": 3
			}
		},
		"robot": {
			"name": "Robot",
			"speed": 1000,
			"position": {
				"x": 0,
				"y": 0,
				"f": "NORTH"
			},
			"hover": 10,
			"sounds": {
				"move": "",
				"rotate": ""
			}
		},
		"increment": 90,
		"headings": {
			"NORTH": {
				"r": 0,
				"x": 0,
				"y": 1
			},
			"EAST": {
				"r": 90,
				"x": 1,
				"y": 0
			},
			"SOUTH": {
				"r": 180,
				"x": 0,
				"y": -1
			},
			"WEST": {
				"r": 270,
				"x": -1,
				"y": 0
			}
		},
		"mappings": {
			"13": {
				"command": "report"
			},
			"32": {
				"command": "place"
			},
			"37": {
				"command": "rotate",
				"arguments": [
					"left"
				]
			},
			"38": {
				"command": "move"
			},
			"39": {
				"command": "rotate",
				"arguments": [
					"right"
				]
			}
		},
		"commands": [
			{
				"name": "place",
				"command": "^place$",
				"action": "place"
			},
			{
				"name": "place_at",
				"command": "^place X?([0-9]+)\\,?\\s?Y?([0-9]+)\\,?\\s?(North|East|South|West)$",
				"action": "place"
			},
			{
				"name": "move",
				"command": "^move$",
				"action": "move"
			},
			{
				"name": "left",
				"command": "^left$",
				"action": "left"
			},
			{
				"name": "right",
				"command": "^right$",
				"action": "right"
			},
			{
				"name": "report",
				"command": "^report$",
				"action": "report"
			}
		]
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);

		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));

			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}

		return to;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _configConfigJson = __webpack_require__(2);

	var _configConfigJson2 = _interopRequireDefault(_configConfigJson);

	var _grid = __webpack_require__(1);

	var _grid2 = _interopRequireDefault(_grid);

	var _objectAssign = __webpack_require__(3);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	Object.freeze(_configConfigJson2['default']);

	/**
	 * The robot class
	 */

	var Robot = (function () {

	  /**
	   * Overrides default robot settings and bootstraps the module
	   * @param {Object} args - overrides for the standard robot config
	   */

	  function Robot(args) {
	    _classCallCheck(this, Robot);

	    _objectAssign2['default'](this, _configConfigJson2['default'].robot, args);

	    /** @type {boolean} */
	    this.placed = false;
	    /** @type {boolean} */
	    this.moving = false;
	    /** @type {node} */
	    this.robot = null;
	    /** @type {array} */
	    this.queue = [];
	  }

	  _createClass(Robot, [{
	    key: 'render',

	    /**
	     * Renders the robot in proximity to the grid element
	     */
	    value: function render() {
	      this.robot = document.createElement('div');
	      this.robot.style.width = this.robot.style.height = '' + this.grid.size * 0.6 + 'px';
	      this.robot.style.margin = '' + this.grid.size * 0.2 + 'px';
	      this.robot.id = 'robot';
	      this.grid.el.appendChild(this.robot);
	    }
	  }, {
	    key: 'animate',

	    /**
	     * Manoeuvres the robot according to its current state
	     */
	    value: function animate() {
	      this.robot.style.transform = 'translate3d(' + this.position.x * this.grid.size + 'px, -' + this.position.y * this.grid.size + 'px, ' + _configConfigJson2['default'].robot.hover + 'px) rotate(' + this.position.a + 'deg)';
	      this.robot.setAttribute('data-heading', this.position.f.toLowerCase());
	    }
	  }, {
	    key: 'connectTo',

	    /**
	     * Attaches the robot to the grid of choice
	     * @param {Grid} grid - the instantiated grid object
	     */
	    value: function connectTo(grid) {
	      if (grid instanceof _grid2['default'] === false) {
	        throw new Error('first argument must be a grid instance');
	      }
	      this.grid = grid;
	    }
	  }, {
	    key: 'validateX',

	    /**
	     * Validates X as a coordinate on the board
	     * @param {number} x - the desired new X coordinate
	     */
	    value: function validateX(x) {
	      return typeof x === 'number' && x < this.grid.columns && x >= 0 ? true : false;
	    }
	  }, {
	    key: 'validateY',

	    /**
	     * Validates Y as a coordinate on the board
	     * @param {number} y - the desired new Y coordinate
	     */
	    value: function validateY(y) {
	      return typeof y === 'number' && y < this.grid.rows && y >= 0 ? true : false;
	    }
	  }, {
	    key: 'validateF',

	    /**
	     * Validates F as a bearing reference contained in the config file
	     * @param {string} f - the uppercase compass direction
	     */
	    value: function validateF(f) {
	      return typeof f === 'string' && typeof _configConfigJson2['default'].headings[f] === 'object' ? true : false;
	    }
	  }, {
	    key: 'place',

	    /**
	     * Places the robot at an arbitrary point on the board
	     * @param {number} x - the X coordinate of the location
	     * @param {number} y - the Y coordinate of the location
	     * @param {string} f - the compass heading of the location
	     */
	    value: function place() {
	      var X = arguments[0] === undefined ? 0 : arguments[0];
	      var Y = arguments[1] === undefined ? 0 : arguments[1];
	      var F = arguments[2] === undefined ? 'NORTH' : arguments[2];

	      var x = parseInt(X);
	      var y = parseInt(Y);
	      var f = F.toUpperCase();
	      // X coordinate
	      this.position.x = this.validateX(x) ? x : _configConfigJson2['default'].robot.position.x;
	      // Y coordinate
	      this.position.y = this.validateY(y) ? y : _configConfigJson2['default'].robot.position.y;
	      // Heading
	      this.position.f = this.validateF(f) ? f : _configConfigJson2['default'].robot.position.f;
	      // Rotation
	      this.position.r = this.validateF(f) ? _configConfigJson2['default'].headings[f].r : _configConfigJson2['default'].headings[_configConfigJson2['default'].robot.position.f].r;
	      // Absolute rotation
	      this.position.a = this.validateF(f) ? _configConfigJson2['default'].headings[f].r : _configConfigJson2['default'].headings[_configConfigJson2['default'].robot.position.f].r;

	      if (this.placed === false) {
	        this.render();
	        this.placed = true;
	      }

	      this.animate();
	    }
	  }, {
	    key: 'move',

	    /**
	     * Moves the robot according to its current heading
	     */
	    value: function move() {
	      if (this.placed === true) {
	        var newPosition = _configConfigJson2['default'].headings[this.position.f];

	        this.position.x = this.validateX(this.position.x + newPosition.x) ? this.position.x + newPosition.x : this.position.x;
	        this.position.y = this.validateY(this.position.y + newPosition.y) ? this.position.y + newPosition.y : this.position.y;

	        this.animate();
	      } else {
	        throw new Error(this.name + ' has not been placed.');
	      }
	    }
	  }, {
	    key: 'rotate',

	    /**
	     * Rotates the robot to a new heading
	     * @param {string} heading - either 'left' or 'right'
	     */
	    value: function rotate(heading) {
	      if (this.placed === true) {
	        if (heading === 'left') {
	          this.position.a -= _configConfigJson2['default'].increment;
	          this.position.r -= _configConfigJson2['default'].increment;
	          if (this.position.r < 0) {
	            this.position.r += 360;
	          } else if (this.position.r >= 360) {
	            this.position.r -= 360;
	          }
	        } else if (heading === 'right') {
	          this.position.a += _configConfigJson2['default'].increment;
	          this.position.r += _configConfigJson2['default'].increment;
	          if (this.position.r < 0) {
	            this.position.r += 360;
	          } else if (this.position.r >= 360) {
	            this.position.r -= 360;
	          }
	        }

	        for (var key in _configConfigJson2['default'].headings) {
	          if (this.position.r === _configConfigJson2['default'].headings[key].r) {
	            this.position.f = key;
	          }
	        }

	        this.animate();
	      } else {
	        throw new Error(this.name + ' has not been placed.');
	      }
	    }
	  }, {
	    key: 'left',

	    /**
	     * Proxy function to rotate from speech and text parser
	     */
	    value: function left() {
	      this.rotate('left');
	    }
	  }, {
	    key: 'right',

	    /**
	     * Proxy function to rotate from speech and text parser
	     */
	    value: function right() {
	      this.rotate('right');
	    }
	  }, {
	    key: 'report',

	    /**
	     * Announces the position and bearing of the robot
	     */
	    value: function report() {
	      var log = { coords: false, message: false };

	      if (this.placed === true) {
	        log.coords = {
	          X: this.position.x,
	          Y: this.position.y,
	          F: this.position.f
	        };
	        log.message = '' + this.name + ' is at X' + this.position.x + ', Y' + this.position.y + ' and facing ' + this.position.f.toLowerCase();
	      } else {
	        log.coords = false;
	        log = '' + this.name + ' is not yet on the board';
	      }

	      var event = new CustomEvent('broadcast', { detail: log });
	      document.dispatchEvent(event);
	    }
	  }, {
	    key: 'listen',

	    /**
	     * Listens for arrow and space key events
	     */
	    value: function listen() {
	      document.addEventListener('keydown', this.handleKeypress.bind(this));
	      document.addEventListener('click', this.handleClick.bind(this));
	    }
	  }, {
	    key: 'handleKeypress',

	    /**
	     * Handles keypresses from arrow, enter and space key listener
	     * @param {Event} event - the keydown event
	     */
	    value: function handleKeypress(event) {
	      var mapping = _configConfigJson2['default'].mappings[event.which];

	      if (event.target.nodeName !== 'INPUT' && this.moving === false && mapping && typeof this[mapping.command] === 'function') {
	        event.preventDefault();
	        var args = mapping.arguments || [];
	        this[mapping.command].apply(this, mapping.arguments);
	      }
	    }
	  }, {
	    key: 'handleClick',

	    /**
	     * Handles clicks
	     * @param {Event} event - the click or touch event
	     */
	    value: function handleClick(event) {
	      if (event.target.getAttribute('data-action') && this.moving === false) {
	        event.preventDefault();
	        event.stopPropagation();

	        var command = event.target.getAttribute('data-action');
	        if (typeof this[command] === 'function') {
	          this[command]();
	        }
	      }
	    }
	  }, {
	    key: 'registerCommands',

	    /**
	     * Registers commands that pertain to this robot instance
	     * @param {Event} event - the keydown event
	     */
	    value: function registerCommands() {
	      var self = this;

	      var commands = _configConfigJson2['default'].commands.map(function (i) {
	        var cmd = {
	          name: i.name,
	          command: new RegExp(i.command, 'i'),
	          action: function action() {
	            self[i.action].apply(self, arguments);
	          }
	        };

	        return cmd;
	      });

	      return commands;
	    }
	  }]);

	  return Robot;
	})();

	exports['default'] = Robot;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	/**
	 * The reporter class
	 */

	var Reporter = (function () {
	  function Reporter(container) {
	    _classCallCheck(this, Reporter);

	    try {
	      this.container = document.querySelector(container);
	    } catch (e) {
	      return console.error('No container was specified for the reporter');
	    }
	  }

	  _createClass(Reporter, [{
	    key: 'report',
	    value: function report(event) {
	      console.log(event.detail.coords);
	      this.listItem(event.detail.message);
	    }
	  }, {
	    key: 'listItem',
	    value: function listItem(val) {
	      var li = document.createElement('li');
	      li.innerHTML = val;
	      this.container.insertBefore(li, this.container.firstChild);
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {
	      document.addEventListener('broadcast', this.report.bind(this));
	    }
	  }]);

	  return Reporter;
	})();

	exports['default'] = Reporter;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _configConfigJson = __webpack_require__(2);

	var _configConfigJson2 = _interopRequireDefault(_configConfigJson);

	var _mumbleJs = __webpack_require__(7);

	var _mumbleJs2 = _interopRequireDefault(_mumbleJs);

	var _robot = __webpack_require__(4);

	var _robot2 = _interopRequireDefault(_robot);

	Object.freeze(_configConfigJson2['default']);

	var TextParser = (function () {
	  function TextParser(robot) {
	    _classCallCheck(this, TextParser);

	    if (!robot instanceof _robot2['default']) {
	      throw new Error('Parser needs to connect to an instantiated robot');
	    }

	    this.queue = [];

	    this.robot = robot;

	    this.commands = this.robot.registerCommands();

	    this.digesting = true;

	    this.digest();
	  }

	  _createClass(TextParser, [{
	    key: 'digest',
	    value: function digest() {
	      var self = this;
	      setTimeout(function () {
	        requestAnimationFrame(self.digest.bind(self));
	        if (self.queue.length) {
	          self.readLn.call(self, self.queue[0]);
	          self.queue.shift();
	        }
	      }, _configConfigJson2['default'].digest);
	    }
	  }, {
	    key: 'cancelDigest',
	    value: function cancelDigest() {
	      this.digesting = false;
	    }
	  }, {
	    key: 'readLn',
	    value: function readLn(ln) {
	      var args = [];
	      var command = this.commands.filter(function (i) {
	        var match = ln.trim().match(i.command);
	        if (match) args = match.slice(1, match.length);
	        return match;
	      });
	      try {
	        command[0].action.apply(self.robot, args);
	      } catch (e) {
	        this.queue = [];
	        throw new Error(e.message);
	      }
	    }
	  }, {
	    key: 'enqueue',
	    value: function enqueue(event) {
	      this.queue = this.queue.concat(event.target.result.trim().split('\n'));
	    }
	  }, {
	    key: 'loadFile',
	    value: function loadFile(event) {
	      event.stopPropagation();
	      event.preventDefault();

	      document.documentElement.removeAttribute('data-file');

	      var file = event.dataTransfer.files[0];
	      var reader = new FileReader();

	      reader.onload = this.enqueue.bind(this);
	      reader.readAsText(file);
	    }
	  }, {
	    key: 'addDropState',
	    value: function addDropState(event) {
	      event.stopPropagation();
	      event.preventDefault();
	      document.documentElement.setAttribute('data-file', '');
	    }
	  }, {
	    key: 'removeDropState',
	    value: function removeDropState(event) {
	      event.stopPropagation();
	      event.preventDefault();
	      document.documentElement.removeAttribute('data-file');
	    }
	  }, {
	    key: 'listen',
	    value: function listen() {
	      document.documentElement.addEventListener('dragover', this.addDropState.bind(this));
	      document.documentElement.addEventListener('dragend', this.removeDropState.bind(this));
	      document.documentElement.addEventListener('dragleave', this.removeDropState.bind(this));
	      document.documentElement.addEventListener('drop', this.loadFile.bind(this));
	    }
	  }]);

	  return TextParser;
	})();

	exports['default'] = TextParser;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*!*
	 * mumble.js v1.0.1
	 * https://github.com/swemaniac/mumble
	 *
	 * A simple framework for adding voice commands to a web site using the web speech recognition API.
	 * Supports the CommonJs/node.js/AMD and global syntax.
	 *
	 * See https://github.com/swemaniac/mumble for a readme and some examples.
	 * Forked from and inspired by https://github.com/TalAter/annyang.
	 */

	/**
	 * Definition of a speech callback.
	 *
	 * @callback SpeechCallback
	 * @param {event} event The original event object.
	 */

	/**
	 * Definition of a command object.
	 *
	 * @typedef {object} Command
	 *
	 * @property {string} name The command identifier.
	 * @property {string|RegExp} command The command in regex form (can be string or object).
	 * @property {function} action A callback that will be run when the command matches speech with the matched parameters.
	 */

	/**
	 * Definition of an options object.
	 *
	 * @typedef {object} Options
	 *
	 * @property {string} [language=en-US] A 4-letter language code, e.g. en-US.
	 * @property {boolean} [autoRestart=true] Whether to allow auto restarting the speech recognizer.
	 * @property {boolean} [continuous] Whether the speech recognizer should act as a dictation device.
	 * @property {integer} [maxAlternatives=5] The max number of alternative transcripts from the speech recognizer (defaults to 5).
	 * @property {boolean} [debug=false] Whether to enable debug logging.
	 * @property {Command[]} [commands] An array of commands, can also be added with addCommand().
	 * @property {SpeechCallback[]} [callbacks] An object describing various callbacks to events (start, end, speech, recognizeMatch, recognizeNoMatch, error).
	 */

	(function(name, definition) {
		if (true) module.exports = definition();
		else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
		else this[name] = definition();
	}('Mumble',
		/**
		 * Module mumble.
		 * @module mumble
		 */
		function() {
			"use strict";

			/**
			 * Module entrypoint/constructor.
			 *
			 * @constructor
			 * @alias module:mumble
			 *
			 * @param {Options} options An options object.
			 */
			var Mumble = function(options) {
				var _recognizer = null;
				var _startTime = 0;
				var _aborted = false;
				var _commands = [];

				var _options = {
					language: 'en-US',
					autoRestart: true,
					continuous: window.location.protocol === 'http:',
					maxAlternatives: 5,
					debug: false,

					commands: [

					],

					callbacks: {
						start: null,
						end: null,
						speech: null,
						recognizeMatch: null,
						recognizeNoMatch: null,
						error: null
					}
				};

				var _self = this;

				/**
				 * Call to start listening for speech.
				 * @throws If the SpeechRecognition object wasn't supported.
				 */
				this.start = function() {
					if (!this.isAvailable()) {
						throw 'Speech recognition not supported in this browser';
					}

					_aborted = false;
					_startTime = new Date().getTime();

					_log('Starting with %d command(s) active', _commands.length);

					_recognizer.start();
				};

				/**
				 * Call to stop listening for speech.
				 */
				this.stop = function() {
					if (this.isAvailable()) {
						_aborted = true;
						_recognizer.abort();
					}
				};

				/**
				 * Check if the SpeechRecognition object is supported.
				 * @return {boolean}
				 */
				this.isAvailable = function() {
					return !!_recognizer;
				};

				/**
				 * Gets a reference to the SpeechRecognition object.
				 * @return {SpeechRecognition}
				 */
				this.getSpeechRecognitionObject = function() {
					return _recognizer;
				};

				/**
				 * Adds a command.
				 *
				 * The command syntax can be a string with or without any regex instructions,
				 * or a RegExp object. Either way it will be converted to a RegExp object with
				 * the ignoreCase flag set.
				 *
				 * **Example**
				 *
				 * `addCommand('appointment', /^book (.+) for me (today|tomorrow) at (\d+)$/, function(appointment, date, hour) { })`
				 *
				 * @param {string} name A command identifier.
				 * @param {string|RegExp} command The command in regex form (can be string or object).
				 * @param {function} action A callback that will be run when the command matches speech.
				 *
				 * @throws If a command with the same name already exists.
				 */
				this.addCommand = function(name, command, action) {
					if (this.getCommand(name)) {
						throw 'Command "' + name + '"" already exists';
					}

					// wrap the command in a RegExp object with the ignoreCase flag
					var commandSrc = typeof(command) == 'string' ? ('^' + command + '$') : command.source;
					var commandExp = new RegExp(commandSrc, 'i');

					_commands.push({
						name: name,
						command: commandExp,
						action: action
					});

					_log('Added command: "%s", %s', name, commandExp);
				};

				/**
				 * Removes a command.
				 * @param {string} name The command identifier.
				 */
				this.removeCommand = function(name) {
					var foundIndex = -1;

					_commands.some(function(command, index) {
						if (command.name == name) {
							foundIndex = index;
							return true;
						}

						return false;
					});

					if (foundIndex >= 0) {
						delete _commands[foundIndex];
						_log('Removed command "%s"', name);
					}
				};

				/**
				 * Gets a previously added command.
				 *
				 * @param {string} name A command identifier.
				 * @return {Command} A command.
				 */
				this.getCommand = function(name) {
					var found = null;

					_commands.some(function(command) {
						if (command.name == name) {
							found = command;
							return true;
						}

						return false;
					});

					return found;
				};

				/**
				 * Sets the language of the speech recognizer.
				 * @param {string} language A 4 letter language code (e.g. en-US).
				 */
				this.setLanguage = function(language) {
					_options.language = language;

					if (this.isAvailable()) {
						_recognizer.lang = _options.language;
					}
				};

				/**
				 * Sets whether the speech recognizer should be auto restarted
				 * after an "end" event.
				 *
				 * @param {boolean} autoRestart
				 */
				this.setAutoRestart = function(autoRestart) {
					_options.autoRestart = !!autoRestart;
				};

				/**
				 * Sets the max number of alternative transcripts that the
				 * speech recognizer should return.
				 *
				 * Mumble will try to match a command to each of these transcripts.
				 *
				 * @param {integer} maxAlternatives
				 */
				this.setMaxAlternatives = function(maxAlternatives) {
					_options.maxAlternatives = parseInt(maxAlternatives);

					if (this.isAvailable()) {
						_recognizer.maxAlternatives = _options.maxAlternatives;
					}
				};

				/**
				 * Sets whether the speech recognizer should act as a dictation device or
				 * a one-shot command device.
				 *
				 * In HTTPS, turn off continuous mode for faster results.
				 * In HTTP, turn on continuous mode for much slower results, but no repeating security notices.
				 *
				 * @param {boolean} continuous The mode of the speech recognizer.
				 */
				this.setContinuous = function(continuous) {
					_options.continuous = !!continuous;

					if (this.isAvailable()) {
						_recognizer.continuous = _options.continuous;
					}
				};

				/**
				 * Enables or disabled debug logging to the console.
				 * @param {boolean} debug
				 */
				this.setDebug = function(debug) {
					_options.debug = !!debug;
				};

				function _init(options) {
					_recognizer = _getRecognizerObject();

					if (!_self.isAvailable()) {
						return;
					}

					// merge default options with user options
					if (options) {
						for (var opt in _options) {
							if (options[opt]) {
								_options[opt] = options[opt];
							}
						}
					}

					_self.setLanguage(_options.language);
					_self.setContinuous(_options.continuous);
					_self.setAutoRestart(_options.autoRestart);
					_self.setMaxAlternatives(_options.maxAlternatives);
					_self.setDebug(_options.debug);

					// add commands
					_options.commands.forEach(function(command) {
						_self.addCommand(command.name, command.command, command.action);
					});

					// set callbacks
					_recognizer.onstart = _onStart;
					_recognizer.onend = _onEnd;
					_recognizer.onerror = _onError;
					_recognizer.onresult = _onResult;
				}

				function _onStart(event) {
					_log('Start listening..', event, _options);
					_callback(_options.callbacks.start, event, _self);
				}

				function _onEnd(event) {
					_log('Stop listening..', event);
					_callback(_options.callbacks.end, event, _self);

					if (_options.autoRestart && !_aborted) {
						_log('(Auto-restarting)');

						var timeSinceLastStarted = new Date().getTime() - _startTime;

						// allow at least 1s between restarts
						if (timeSinceLastStarted < 1000) {
							setTimeout(_self.start, 1000 - timeSinceLastStarted);
						} else {
							_self.start();
						}
					}
				}

				function _onError(event) {
					_log('Error occurred', event);
					_callback(_options.callbacks.error, event, _self);

					if (['not-allowed', 'service-not-allowed'].indexOf(event.error) !== -1) {
						_self.setAutoRestart(false);
					}
				}

				function _onResult(event) {
					_log('Got result', event);
					_callback(_options.callbacks.speech, event, _self);

					var results = event.results[event.resultIndex];
					var matchFound = false;

					// loop through the transcription results
					for (var i = 0; i < results.length; i++) {
						var result = results[i];
						var transcript = result.transcript.trim();

						_log('Recognized: "%s"', transcript);

						// check each command against the transcript, halting on the first match
						matchFound = _commands.some(function(command) {
							var match = command.command.exec(transcript);

							// we got a match
							if (match) {
								var parameters = match.slice(1);

								_log('Command matched: "%s", %s', command.name, command.command, parameters);

								// call the generic callback and the command action with any possible parameters from the regex
								_callback(_options.callbacks.recognizeMatch, event, _self);
								command.action.apply(_self, parameters);

								return true;
							}

							return false;
						});

						// don't go through the rest of the commands on a match
						if (matchFound) {
							break;
						}
					}

					if (!matchFound) {
						_callback(_options.callbacks.recognizeNoMatch, event, _self);
					}

					return matchFound;
				}

				function _callback(callback, event, context) {
					if (typeof(callback) == 'function') {
						callback.call(context, event);
					}
				}

				function _getRecognizerObject() {
					var SpeechRecognizer = window.SpeechRecognition ||
										window.webkitSpeechRecognition ||
										window.mozSpeechRecognition ||
										window.msSpeechRecognition ||
										window.oSpeechRecognition;

					if (SpeechRecognizer) {
						return new SpeechRecognizer();
					}

					_log('SpeechRecognition object not supported');

					return null;
				}

				function _log() {
					if (!!_options.debug) {
						var out = window.console || { log: function() { } };
						out.log.apply(out, arguments);
					}
				}

				_init(options);
			};

			return Mumble;
		}
	));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _configConfigJson = __webpack_require__(2);

	var _configConfigJson2 = _interopRequireDefault(_configConfigJson);

	var _mumbleJs = __webpack_require__(7);

	var _mumbleJs2 = _interopRequireDefault(_mumbleJs);

	var _robot = __webpack_require__(4);

	var _robot2 = _interopRequireDefault(_robot);

	Object.freeze(_configConfigJson2['default']);

	var SpeechParser = (function () {
	  function SpeechParser(robot) {
	    _classCallCheck(this, SpeechParser);

	    if (!robot instanceof _robot2['default']) {
	      throw new Error('Parser needs to connect to an instantiated robot');
	    }

	    this.robot = robot;

	    this.commands = this.robot.registerCommands();

	    this.mumble = new _mumbleJs2['default']({
	      language: _configConfigJson2['default'].language,
	      commands: this.commands
	    });
	  }

	  _createClass(SpeechParser, [{
	    key: 'listen',
	    value: function listen() {
	      this.mumble.start();
	    }
	  }]);

	  return SpeechParser;
	})();

	exports['default'] = SpeechParser;
	module.exports = exports['default'];

/***/ }
/******/ ]);