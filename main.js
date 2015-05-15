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

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _classesGrid = __webpack_require__(5);

	var _classesGrid2 = _interopRequireDefault(_classesGrid);

	var _classesRobot = __webpack_require__(2);

	var _classesRobot2 = _interopRequireDefault(_classesRobot);

	var _classesReporter = __webpack_require__(3);

	var _classesReporter2 = _interopRequireDefault(_classesReporter);

	var _classesSoundBoard = __webpack_require__(4);

	var _classesSoundBoard2 = _interopRequireDefault(_classesSoundBoard);

	var _classesTextParser = __webpack_require__(1);

	var _classesTextParser2 = _interopRequireDefault(_classesTextParser);

	var _classesSpeechParser = __webpack_require__(6);

	var _classesSpeechParser2 = _interopRequireDefault(_classesSpeechParser);

	var _fastclick = __webpack_require__(7);

	var _fastclick2 = _interopRequireDefault(_fastclick);

	if (window.location.hostname.indexOf('github.io') > -1 && window.location.window.location.protocol != 'https:') {
	  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
	}

	var grid = new _classesGrid2['default']({
	  container: '#board',
	  columns: 5,
	  rows: 5
	});

	var robot = new _classesRobot2['default']({
	  name: 'Roomba'
	});

	var reporter = new _classesReporter2['default']('#report');
	var soundBoard = new _classesSoundBoard2['default']();

	var textParser = new _classesTextParser2['default'](robot);
	var speechParser = new _classesSpeechParser2['default'](robot);

	document.addEventListener('DOMContentLoaded', function () {

	  _fastclick2['default'].attach(document.body);

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

	var _configConfigJson = __webpack_require__(9);

	var _configConfigJson2 = _interopRequireDefault(_configConfigJson);

	var _mumbleJs = __webpack_require__(10);

	var _mumbleJs2 = _interopRequireDefault(_mumbleJs);

	var _robot = __webpack_require__(2);

	var _robot2 = _interopRequireDefault(_robot);

	Object.freeze(_configConfigJson2['default']);

	/**
	 * The text parser class adds the ability to translate a file to commands
	 */

	var TextParser = (function () {

	  /**
	   * Bootstraps the text parser
	   * @param {Robot} robot - a Robot instance
	   */

	  function TextParser(robot) {
	    _classCallCheck(this, TextParser);

	    if (!(robot instanceof _robot2['default'])) {
	      throw new Error('Parser needs to connect to an instantiated robot');
	    }

	    this.robot = robot;
	    this.commands = this.robot.registerCommands();

	    this.queue = [];
	    this.parsing = false;
	    this.interval = null;
	  }

	  _createClass(TextParser, [{
	    key: 'digest',

	    /**
	     * Invokes a digest cycle for the interpreter
	     */
	    value: function digest() {
	      this.parsing = true;
	      this.interval = setInterval(this.tick.bind(this), _configConfigJson2['default'].digest);
	    }
	  }, {
	    key: 'tick',

	    /**
	     * Reads the queue line for line or cancels if it reaches zero lines
	     */
	    value: function tick() {
	      if (this.queue.length) {
	        this.readLn.call(this, this.queue[0]);
	        this.queue.shift();
	      } else {
	        this.parsing = false;
	        clearInterval(this.interval);
	      }
	    }
	  }, {
	    key: 'cancelDigest',

	    /**
	     * Allows manual clearing of the digest cycle
	     */
	    value: function cancelDigest() {
	      clearInterval(this.interval);
	      this.interval = null;
	    }
	  }, {
	    key: 'readLn',

	    /**
	     * Reads a line and relates it to a command
	     */
	    value: function readLn(ln) {
	      var args = [];

	      // Find the input command in the list of commands
	      var command = this.commands.filter(function (i) {
	        var match = ln.trim().match(i.command);
	        if (match) args = match.slice(1, match.length);
	        return match;
	      });

	      // Unfortunately we have to go imperative here as opposed to
	      // broadcasting an event as we need to know whether or not to
	      // clear an illegal text input queue on exception
	      try {
	        command[0].action.apply(self.robot, args);
	      } catch (e) {
	        this.queue = [];
	        throw new Error(e.message);
	      }
	    }
	  }, {
	    key: 'enqueue',

	    /**
	     * Creates a queue from the lines of an input file
	     * and invokes the digest cycle
	     * @param {Event} event - a file API onload event
	     */
	    value: function enqueue(event) {
	      this.queue = this.queue.concat(event.target.result.trim().split('\n'));
	      this.digest();
	    }
	  }, {
	    key: 'loadFile',

	    /**
	     * Loads a file via the drag and drop and file APIs
	     * @param {Event} event - a drop event
	     */
	    value: function loadFile(event) {
	      event.stopPropagation();
	      event.preventDefault();

	      if (this.parsing === false) {
	        document.documentElement.removeAttribute('data-file');

	        var file = event.dataTransfer.files[0];
	        var reader = new FileReader();

	        reader.onload = this.enqueue.bind(this);
	        reader.readAsText(file);
	      }
	    }
	  }, {
	    key: 'addDropState',

	    /**
	     * Adds a dragged-over state to the document element
	     * @param {Event} event - a dragover event
	     */
	    value: function addDropState(event) {
	      event.stopPropagation();
	      event.preventDefault();
	      if (this.parsing === false) document.documentElement.setAttribute('data-file', '');
	    }
	  }, {
	    key: 'removeDropState',

	    /**
	     * Removes a dragged-over state from the document element
	     * @param {Event} event - a dragover event
	     */
	    value: function removeDropState(event) {
	      event.stopPropagation();
	      event.preventDefault();
	      if (this.parsing === false) document.documentElement.removeAttribute('data-file');
	    }
	  }, {
	    key: 'listen',

	    /**
	     * Bootstraps event listeners
	     */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _configConfigJson = __webpack_require__(9);

	var _configConfigJson2 = _interopRequireDefault(_configConfigJson);

	var _grid = __webpack_require__(5);

	var _grid2 = _interopRequireDefault(_grid);

	var _objectAssign = __webpack_require__(8);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	Object.freeze(_configConfigJson2['default']);

	/**
	 * The robot class contains all the functions and parameters specific to the robot
	 */

	var Robot = (function () {

	  /**
	   * Overrides default robot settings and bootstraps the module
	   * @param {Object} args - overrides for the standard robot config
	   */

	  function Robot(args) {
	    _classCallCheck(this, Robot);

	    (0, _objectAssign2['default'])(this, _configConfigJson2['default'].robot, args);

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
	      this.robot.style.transform = this.robot.style.webkitTransform = this.robot.style.mozTransform = this.robot.style.msTransform = this.robot.style.oTransform = 'translate3d(' + this.position.x * this.grid.size + 'px, -' + this.position.y * this.grid.size + 'px, ' + _configConfigJson2['default'].robot.hover + 'px) rotate(' + this.position.a + 'deg)';

	      this.robot.setAttribute('data-heading', this.position.f.toLowerCase());
	    }
	  }, {
	    key: 'connectTo',

	    /**
	     * Attaches the robot to the grid of choice
	     * @param {Grid} grid - the instantiated grid object
	     */
	    value: function connectTo(grid) {
	      if (!(grid instanceof _grid2['default'])) {
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
	        var oldPosition = {};
	        var newPosition = _configConfigJson2['default'].headings[this.position.f];

	        (0, _objectAssign2['default'])(oldPosition, this.position);

	        this.position.x = this.validateX(this.position.x + newPosition.x) ? this.position.x + newPosition.x : this.position.x;
	        this.position.y = this.validateY(this.position.y + newPosition.y) ? this.position.y + newPosition.y : this.position.y;

	        if (oldPosition.x === this.position.x && oldPosition.y === this.position.y) {
	          this.broadcast('sound', this.sounds.error);
	        } else {
	          this.broadcast('sound', this.sounds.move);
	        }

	        this.animate();
	      } else {
	        throw new Error(this.name + ' has not been placed.');
	      }
	    }
	  }, {
	    key: 'clampRotation',

	    /**
	     * Clamps rotation to positive integers between 0 and 360
	     * @param {number} val - any number
	     */
	    value: function clampRotation(val) {
	      if (val < 0) {
	        return val + 360;
	      } else if (val >= 360) {
	        return val - 360;
	      } else {
	        return val;
	      }
	    }
	  }, {
	    key: 'rotate',

	    /**
	     * Rotates the robot to a new heading
	     * @param {string} heading - either 'left' or 'right'
	     */
	    value: function rotate() {
	      var heading = arguments[0] === undefined ? 'right' : arguments[0];

	      if (this.placed === true) {
	        if (heading === 'left') {
	          var newPos = this.position.r - _configConfigJson2['default'].increment;
	          this.position.a -= _configConfigJson2['default'].increment;
	          this.position.r = this.clampRotation(newPos);
	        } else {
	          var newPos = this.position.r + _configConfigJson2['default'].increment;
	          this.position.a += _configConfigJson2['default'].increment;
	          this.position.r = this.clampRotation(newPos);
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
	        log.message = '' + this.name + ' is not yet on the board';
	      }

	      this.broadcast('report', log);
	    }
	  }, {
	    key: 'broadcast',

	    /**
	     * Listens for arrow and space key events
	     * @param {string} type - the event type to broadcast (rendered as broadcast:type)
	     * @param {Object} detail - the detail object to send as an event argument
	     */
	    value: function broadcast(type, detail) {
	      var event = document.createEvent('CustomEvent');
	      event.initCustomEvent('broadcast:' + type, false, false, detail);
	      document.dispatchEvent(event);
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
	     * from a list of configurable regular expressions
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
	  }, {
	    key: 'listen',

	    /**
	     * Listens for arrow and space key events
	     */
	    value: function listen() {
	      document.addEventListener('keydown', this.handleKeypress.bind(this));
	      document.addEventListener('click', this.handleClick.bind(this));
	    }
	  }]);

	  return Robot;
	})();

	exports['default'] = Robot;
	module.exports = exports['default'];

/***/ },
/* 3 */
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
	  function Reporter() {
	    var container = arguments[0] === undefined ? '' : arguments[0];

	    _classCallCheck(this, Reporter);

	    try {
	      this.container = document.querySelector(container);
	    } catch (e) {
	      throw new Error('No container was specified for the reporter');
	    }
	  }

	  _createClass(Reporter, [{
	    key: 'report',
	    value: function report(event) {
	      if (event.detail.coords) console.log(event.detail.coords);
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
	      document.addEventListener('broadcast:report', this.report.bind(this));
	    }
	  }]);

	  return Reporter;
	})();

	exports['default'] = Reporter;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	/**
	 * The soundboard addition plays sounds broadcast to it by other classes
	 */

	var SoundBoard = (function () {

	  /**
	   * Bootstraps the class defaults
	   * @param {string} - a DOM string to use as a sound toggle
	   */

	  function SoundBoard(toggles) {
	    _classCallCheck(this, SoundBoard);

	    this.soundOn = true;
	    this.toggles = document.querySelector(toggles);
	    this.audio = new Audio();
	  }

	  _createClass(SoundBoard, [{
	    key: 'play',

	    /**
	     * The play function can be invoked from anywhere via
	     * a broadcast:sound event
	     * @param {Event} event - a broadcast event listener
	     */
	    value: function play(event) {
	      if (this.soundOn === true && event.detail !== this.audio.src.replace(window.location.href, '')) {
	        this.audio.src = event.detail;
	        this.audio.play();
	      }
	    }
	  }, {
	    key: 'toggleSound',

	    /**
	     * Toggles whether any sound should play
	     */
	    value: function toggleSound() {
	      this.soundOn = this.soundOn === true ? false : true;
	    }
	  }, {
	    key: 'reset',

	    /**
	     * Resets the src of the audio object
	     */
	    value: function reset() {
	      this.audio.src = '';
	    }
	  }, {
	    key: 'listen',

	    /**
	     * Rigs up relevant event listeners
	     */
	    value: function listen() {
	      document.addEventListener('broadcast:sound', this.play.bind(this));
	      this.audio.addEventListener('ended', this.reset.bind(this));
	      if (this.toggles) this.toggles.addEventListener('click', this.toggleSound.bind(this));
	    }
	  }]);

	  return SoundBoard;
	})();

	exports['default'] = SoundBoard;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _configConfigJson = __webpack_require__(9);

	var _configConfigJson2 = _interopRequireDefault(_configConfigJson);

	var _objectAssign = __webpack_require__(8);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	Object.freeze(_configConfigJson2['default']);

	var startX = null;
	var startY = null;

	var Grid = (function () {
	  function Grid(args) {
	    _classCallCheck(this, Grid);

	    (0, _objectAssign2['default'])(this, _configConfigJson2['default'].grid, args);
	    this.el = document.querySelector(this.container);
	    this.offsetX = 0;
	    this.offsetY = 0;
	  }

	  _createClass(Grid, [{
	    key: 'createCanvas',
	    value: function createCanvas() {
	      this.canvas = document.createElement('canvas');
	      this.el.appendChild(this.canvas);
	      this.canvas.width = this.columns * this.size;
	      this.canvas.height = this.rows * this.size;
	      this.ctx = this.canvas.getContext('2d');
	    }
	  }, {
	    key: 'layout',
	    value: function layout() {
	      this.ctx.strokeStyle = this.lines.color;
	      this.ctx.lineWidth = this.lines.width;
	      if (!this.ctx || !(this.ctx instanceof CanvasRenderingContext2D)) {
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
	      if (event.target === this.canvas || event.target === this.canvas.parentNode) {
	        event.preventDefault();
	        startX = this.checkTouch(event).pageX - this.offsetX;
	        startY = this.checkTouch(event).pageY - this.offsetY;
	        document.documentElement.setAttribute('data-dragging', '');
	      }
	    }
	  }, {
	    key: 'stopRotate',
	    value: function stopRotate(event) {
	      if (startX !== null || startY !== null) {
	        event.preventDefault();
	        startX = null;
	        startY = null;
	        document.documentElement.removeAttribute('data-dragging');
	      }
	    }
	  }, {
	    key: 'rotate',
	    value: function rotate(event) {
	      if (startX !== null && startY !== null) {
	        event.preventDefault();

	        this.offsetX = this.clamp(this.checkTouch(event).pageX - startX, this.angle.x[0], this.angle.x[1]);
	        this.offsetY = this.clamp(this.checkTouch(event).pageY - startY, this.angle.y[0], this.angle.y[1]);

	        this.canvas.parentNode.style.transform = this.canvas.parentNode.style.webkitTransform = this.canvas.parentNode.style.mozTransform = this.canvas.parentNode.style.msTransform = this.canvas.parentNode.style.oTransform = 'perspective(1000px) rotateX(' + this.offsetY + 'deg) rotateZ(' + this.offsetX + 'deg)';
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
	      document.addEventListener('mousedown', this.startRotate.bind(this), true);
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _configConfigJson = __webpack_require__(9);

	var _configConfigJson2 = _interopRequireDefault(_configConfigJson);

	var _mumbleJs = __webpack_require__(10);

	var _mumbleJs2 = _interopRequireDefault(_mumbleJs);

	var _robot = __webpack_require__(2);

	var _robot2 = _interopRequireDefault(_robot);

	Object.freeze(_configConfigJson2['default']);

	var SpeechParser = (function () {
	  function SpeechParser(robot) {
	    _classCallCheck(this, SpeechParser);

	    if (!(robot instanceof _robot2['default'])) {
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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;;(function () {
		'use strict';

		/**
		 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
		 *
		 * @codingstandard ftlabs-jsv2
		 * @copyright The Financial Times Limited [All Rights Reserved]
		 * @license MIT License (see LICENSE.txt)
		 */

		/*jslint browser:true, node:true*/
		/*global define, Event, Node*/


		/**
		 * Instantiate fast-clicking listeners on the specified layer.
		 *
		 * @constructor
		 * @param {Element} layer The layer to listen on
		 * @param {Object} [options={}] The options to override the defaults
		 */
		function FastClick(layer, options) {
			var oldOnClick;

			options = options || {};

			/**
			 * Whether a click is currently being tracked.
			 *
			 * @type boolean
			 */
			this.trackingClick = false;


			/**
			 * Timestamp for when click tracking started.
			 *
			 * @type number
			 */
			this.trackingClickStart = 0;


			/**
			 * The element being tracked for a click.
			 *
			 * @type EventTarget
			 */
			this.targetElement = null;


			/**
			 * X-coordinate of touch start event.
			 *
			 * @type number
			 */
			this.touchStartX = 0;


			/**
			 * Y-coordinate of touch start event.
			 *
			 * @type number
			 */
			this.touchStartY = 0;


			/**
			 * ID of the last touch, retrieved from Touch.identifier.
			 *
			 * @type number
			 */
			this.lastTouchIdentifier = 0;


			/**
			 * Touchmove boundary, beyond which a click will be cancelled.
			 *
			 * @type number
			 */
			this.touchBoundary = options.touchBoundary || 10;


			/**
			 * The FastClick layer.
			 *
			 * @type Element
			 */
			this.layer = layer;

			/**
			 * The minimum time between tap(touchstart and touchend) events
			 *
			 * @type number
			 */
			this.tapDelay = options.tapDelay || 200;

			/**
			 * The maximum time for a tap
			 *
			 * @type number
			 */
			this.tapTimeout = options.tapTimeout || 700;

			if (FastClick.notNeeded(layer)) {
				return;
			}

			// Some old versions of Android don't have Function.prototype.bind
			function bind(method, context) {
				return function() { return method.apply(context, arguments); };
			}


			var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
			var context = this;
			for (var i = 0, l = methods.length; i < l; i++) {
				context[methods[i]] = bind(context[methods[i]], context);
			}

			// Set up event handlers as required
			if (deviceIsAndroid) {
				layer.addEventListener('mouseover', this.onMouse, true);
				layer.addEventListener('mousedown', this.onMouse, true);
				layer.addEventListener('mouseup', this.onMouse, true);
			}

			layer.addEventListener('click', this.onClick, true);
			layer.addEventListener('touchstart', this.onTouchStart, false);
			layer.addEventListener('touchmove', this.onTouchMove, false);
			layer.addEventListener('touchend', this.onTouchEnd, false);
			layer.addEventListener('touchcancel', this.onTouchCancel, false);

			// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
			// layer when they are cancelled.
			if (!Event.prototype.stopImmediatePropagation) {
				layer.removeEventListener = function(type, callback, capture) {
					var rmv = Node.prototype.removeEventListener;
					if (type === 'click') {
						rmv.call(layer, type, callback.hijacked || callback, capture);
					} else {
						rmv.call(layer, type, callback, capture);
					}
				};

				layer.addEventListener = function(type, callback, capture) {
					var adv = Node.prototype.addEventListener;
					if (type === 'click') {
						adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
							if (!event.propagationStopped) {
								callback(event);
							}
						}), capture);
					} else {
						adv.call(layer, type, callback, capture);
					}
				};
			}

			// If a handler is already declared in the element's onclick attribute, it will be fired before
			// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
			// adding it as listener.
			if (typeof layer.onclick === 'function') {

				// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
				// - the old one won't work if passed to addEventListener directly.
				oldOnClick = layer.onclick;
				layer.addEventListener('click', function(event) {
					oldOnClick(event);
				}, false);
				layer.onclick = null;
			}
		}

		/**
		* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
		*
		* @type boolean
		*/
		var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

		/**
		 * Android requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


		/**
		 * iOS requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


		/**
		 * iOS 4 requires an exception for select elements.
		 *
		 * @type boolean
		 */
		var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


		/**
		 * iOS 6.0-7.* requires the target element to be manually derived
		 *
		 * @type boolean
		 */
		var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

		/**
		 * BlackBerry requires exceptions.
		 *
		 * @type boolean
		 */
		var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

		/**
		 * Determine whether a given element requires a native click.
		 *
		 * @param {EventTarget|Element} target Target DOM element
		 * @returns {boolean} Returns true if the element needs a native click
		 */
		FastClick.prototype.needsClick = function(target) {
			switch (target.nodeName.toLowerCase()) {

			// Don't send a synthetic click to disabled inputs (issue #62)
			case 'button':
			case 'select':
			case 'textarea':
				if (target.disabled) {
					return true;
				}

				break;
			case 'input':

				// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
				if ((deviceIsIOS && target.type === 'file') || target.disabled) {
					return true;
				}

				break;
			case 'label':
			case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
			case 'video':
				return true;
			}

			return (/\bneedsclick\b/).test(target.className);
		};


		/**
		 * Determine whether a given element requires a call to focus to simulate click into element.
		 *
		 * @param {EventTarget|Element} target Target DOM element
		 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
		 */
		FastClick.prototype.needsFocus = function(target) {
			switch (target.nodeName.toLowerCase()) {
			case 'textarea':
				return true;
			case 'select':
				return !deviceIsAndroid;
			case 'input':
				switch (target.type) {
				case 'button':
				case 'checkbox':
				case 'file':
				case 'image':
				case 'radio':
				case 'submit':
					return false;
				}

				// No point in attempting to focus disabled inputs
				return !target.disabled && !target.readOnly;
			default:
				return (/\bneedsfocus\b/).test(target.className);
			}
		};


		/**
		 * Send a click event to the specified element.
		 *
		 * @param {EventTarget|Element} targetElement
		 * @param {Event} event
		 */
		FastClick.prototype.sendClick = function(targetElement, event) {
			var clickEvent, touch;

			// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
			if (document.activeElement && document.activeElement !== targetElement) {
				document.activeElement.blur();
			}

			touch = event.changedTouches[0];

			// Synthesise a click event, with an extra attribute so it can be tracked
			clickEvent = document.createEvent('MouseEvents');
			clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			clickEvent.forwardedTouchEvent = true;
			targetElement.dispatchEvent(clickEvent);
		};

		FastClick.prototype.determineEventType = function(targetElement) {

			//Issue #159: Android Chrome Select Box does not open with a synthetic click event
			if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
				return 'mousedown';
			}

			return 'click';
		};


		/**
		 * @param {EventTarget|Element} targetElement
		 */
		FastClick.prototype.focus = function(targetElement) {
			var length;

			// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
			if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
				length = targetElement.value.length;
				targetElement.setSelectionRange(length, length);
			} else {
				targetElement.focus();
			}
		};


		/**
		 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
		 *
		 * @param {EventTarget|Element} targetElement
		 */
		FastClick.prototype.updateScrollParent = function(targetElement) {
			var scrollParent, parentElement;

			scrollParent = targetElement.fastClickScrollParent;

			// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
			// target element was moved to another parent.
			if (!scrollParent || !scrollParent.contains(targetElement)) {
				parentElement = targetElement;
				do {
					if (parentElement.scrollHeight > parentElement.offsetHeight) {
						scrollParent = parentElement;
						targetElement.fastClickScrollParent = parentElement;
						break;
					}

					parentElement = parentElement.parentElement;
				} while (parentElement);
			}

			// Always update the scroll top tracker if possible.
			if (scrollParent) {
				scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
			}
		};


		/**
		 * @param {EventTarget} targetElement
		 * @returns {Element|EventTarget}
		 */
		FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

			// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
			if (eventTarget.nodeType === Node.TEXT_NODE) {
				return eventTarget.parentNode;
			}

			return eventTarget;
		};


		/**
		 * On touch start, record the position and scroll offset.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchStart = function(event) {
			var targetElement, touch, selection;

			// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
			if (event.targetTouches.length > 1) {
				return true;
			}

			targetElement = this.getTargetElementFromEventTarget(event.target);
			touch = event.targetTouches[0];

			if (deviceIsIOS) {

				// Only trusted events will deselect text on iOS (issue #49)
				selection = window.getSelection();
				if (selection.rangeCount && !selection.isCollapsed) {
					return true;
				}

				if (!deviceIsIOS4) {

					// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
					// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
					// with the same identifier as the touch event that previously triggered the click that triggered the alert.
					// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
					// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
					// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
					// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
					// random integers, it's safe to to continue if the identifier is 0 here.
					if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
						event.preventDefault();
						return false;
					}

					this.lastTouchIdentifier = touch.identifier;

					// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
					// 1) the user does a fling scroll on the scrollable layer
					// 2) the user stops the fling scroll with another tap
					// then the event.target of the last 'touchend' event will be the element that was under the user's finger
					// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
					// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
					this.updateScrollParent(targetElement);
				}
			}

			this.trackingClick = true;
			this.trackingClickStart = event.timeStamp;
			this.targetElement = targetElement;

			this.touchStartX = touch.pageX;
			this.touchStartY = touch.pageY;

			// Prevent phantom clicks on fast double-tap (issue #36)
			if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
				event.preventDefault();
			}

			return true;
		};


		/**
		 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.touchHasMoved = function(event) {
			var touch = event.changedTouches[0], boundary = this.touchBoundary;

			if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
				return true;
			}

			return false;
		};


		/**
		 * Update the last position.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchMove = function(event) {
			if (!this.trackingClick) {
				return true;
			}

			// If the touch has moved, cancel the click tracking
			if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
				this.trackingClick = false;
				this.targetElement = null;
			}

			return true;
		};


		/**
		 * Attempt to find the labelled control for the given label element.
		 *
		 * @param {EventTarget|HTMLLabelElement} labelElement
		 * @returns {Element|null}
		 */
		FastClick.prototype.findControl = function(labelElement) {

			// Fast path for newer browsers supporting the HTML5 control attribute
			if (labelElement.control !== undefined) {
				return labelElement.control;
			}

			// All browsers under test that support touch events also support the HTML5 htmlFor attribute
			if (labelElement.htmlFor) {
				return document.getElementById(labelElement.htmlFor);
			}

			// If no for attribute exists, attempt to retrieve the first labellable descendant element
			// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
			return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
		};


		/**
		 * On touch end, determine whether to send a click event at once.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onTouchEnd = function(event) {
			var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

			if (!this.trackingClick) {
				return true;
			}

			// Prevent phantom clicks on fast double-tap (issue #36)
			if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
				this.cancelNextClick = true;
				return true;
			}

			if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
				return true;
			}

			// Reset to prevent wrong click cancel on input (issue #156).
			this.cancelNextClick = false;

			this.lastClickTime = event.timeStamp;

			trackingClickStart = this.trackingClickStart;
			this.trackingClick = false;
			this.trackingClickStart = 0;

			// On some iOS devices, the targetElement supplied with the event is invalid if the layer
			// is performing a transition or scroll, and has to be re-detected manually. Note that
			// for this to function correctly, it must be called *after* the event target is checked!
			// See issue #57; also filed as rdar://13048589 .
			if (deviceIsIOSWithBadTarget) {
				touch = event.changedTouches[0];

				// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
				targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
				targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
			}

			targetTagName = targetElement.tagName.toLowerCase();
			if (targetTagName === 'label') {
				forElement = this.findControl(targetElement);
				if (forElement) {
					this.focus(targetElement);
					if (deviceIsAndroid) {
						return false;
					}

					targetElement = forElement;
				}
			} else if (this.needsFocus(targetElement)) {

				// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
				// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
				if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
					this.targetElement = null;
					return false;
				}

				this.focus(targetElement);
				this.sendClick(targetElement, event);

				// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
				// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
				if (!deviceIsIOS || targetTagName !== 'select') {
					this.targetElement = null;
					event.preventDefault();
				}

				return false;
			}

			if (deviceIsIOS && !deviceIsIOS4) {

				// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
				// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
				scrollParent = targetElement.fastClickScrollParent;
				if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
					return true;
				}
			}

			// Prevent the actual click from going though - unless the target node is marked as requiring
			// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
			if (!this.needsClick(targetElement)) {
				event.preventDefault();
				this.sendClick(targetElement, event);
			}

			return false;
		};


		/**
		 * On touch cancel, stop tracking the click.
		 *
		 * @returns {void}
		 */
		FastClick.prototype.onTouchCancel = function() {
			this.trackingClick = false;
			this.targetElement = null;
		};


		/**
		 * Determine mouse events which should be permitted.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onMouse = function(event) {

			// If a target element was never set (because a touch event was never fired) allow the event
			if (!this.targetElement) {
				return true;
			}

			if (event.forwardedTouchEvent) {
				return true;
			}

			// Programmatically generated events targeting a specific element should be permitted
			if (!event.cancelable) {
				return true;
			}

			// Derive and check the target element to see whether the mouse event needs to be permitted;
			// unless explicitly enabled, prevent non-touch click events from triggering actions,
			// to prevent ghost/doubleclicks.
			if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

				// Prevent any user-added listeners declared on FastClick element from being fired.
				if (event.stopImmediatePropagation) {
					event.stopImmediatePropagation();
				} else {

					// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
					event.propagationStopped = true;
				}

				// Cancel the event
				event.stopPropagation();
				event.preventDefault();

				return false;
			}

			// If the mouse event is permitted, return true for the action to go through.
			return true;
		};


		/**
		 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
		 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
		 * an actual click which should be permitted.
		 *
		 * @param {Event} event
		 * @returns {boolean}
		 */
		FastClick.prototype.onClick = function(event) {
			var permitted;

			// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
			if (this.trackingClick) {
				this.targetElement = null;
				this.trackingClick = false;
				return true;
			}

			// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
			if (event.target.type === 'submit' && event.detail === 0) {
				return true;
			}

			permitted = this.onMouse(event);

			// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
			if (!permitted) {
				this.targetElement = null;
			}

			// If clicks are permitted, return true for the action to go through.
			return permitted;
		};


		/**
		 * Remove all FastClick's event listeners.
		 *
		 * @returns {void}
		 */
		FastClick.prototype.destroy = function() {
			var layer = this.layer;

			if (deviceIsAndroid) {
				layer.removeEventListener('mouseover', this.onMouse, true);
				layer.removeEventListener('mousedown', this.onMouse, true);
				layer.removeEventListener('mouseup', this.onMouse, true);
			}

			layer.removeEventListener('click', this.onClick, true);
			layer.removeEventListener('touchstart', this.onTouchStart, false);
			layer.removeEventListener('touchmove', this.onTouchMove, false);
			layer.removeEventListener('touchend', this.onTouchEnd, false);
			layer.removeEventListener('touchcancel', this.onTouchCancel, false);
		};


		/**
		 * Check whether FastClick is needed.
		 *
		 * @param {Element} layer The layer to listen on
		 */
		FastClick.notNeeded = function(layer) {
			var metaViewport;
			var chromeVersion;
			var blackberryVersion;
			var firefoxVersion;

			// Devices that don't support touch don't need FastClick
			if (typeof window.ontouchstart === 'undefined') {
				return true;
			}

			// Chrome version - zero for other browsers
			chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

			if (chromeVersion) {

				if (deviceIsAndroid) {
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport) {
						// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// Chrome 32 and above with width=device-width or less don't need FastClick
						if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}

				// Chrome desktop doesn't need FastClick (issue #15)
				} else {
					return true;
				}
			}

			if (deviceIsBlackBerry10) {
				blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

				// BlackBerry 10.3+ does not require Fastclick library.
				// https://github.com/ftlabs/fastclick/issues/251
				if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
					metaViewport = document.querySelector('meta[name=viewport]');

					if (metaViewport) {
						// user-scalable=no eliminates click delay.
						if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
							return true;
						}
						// width=device-width (or less than device-width) eliminates click delay.
						if (document.documentElement.scrollWidth <= window.outerWidth) {
							return true;
						}
					}
				}
			}

			// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
			if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}

			// Firefox version - zero for other browsers
			firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

			if (firefoxVersion >= 27) {
				// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

				metaViewport = document.querySelector('meta[name=viewport]');
				if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
					return true;
				}
			}

			// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
			// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
			if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
				return true;
			}

			return false;
		};


		/**
		 * Factory method for creating a FastClick object
		 *
		 * @param {Element} layer The layer to listen on
		 * @param {Object} [options={}] The options to override the defaults
		 */
		FastClick.attach = function(layer, options) {
			return new FastClick(layer, options);
		};


		if (true) {

			// AMD. Register as an anonymous module.
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return FastClick;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = FastClick.attach;
			module.exports.FastClick = FastClick;
		} else {
			window.FastClick = FastClick;
		}
	}());


/***/ },
/* 8 */
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
/* 9 */
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
			},
			"angle": {
				"x": [
					60,
					60
				],
				"y": [
					65,
					0
				]
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
			"hover": 7,
			"sounds": {
				"move": "sounds/vacuum.mp3",
				"error": "sounds/nonono.mp3"
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
/* 10 */
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

/***/ }
/******/ ]);