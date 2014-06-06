(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Bitmap;

module.exports = Bitmap = Bitmap = (function() {
  function Bitmap(src, width, height) {
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = src;
  }

  return Bitmap;

})();


},{}],2:[function(require,module,exports){
var CIRCLE, Camera, MOBILE, _ref;

_ref = require('./constants.coffee'), CIRCLE = _ref.CIRCLE, MOBILE = _ref.MOBILE;

module.exports = Camera = Camera = (function() {
  function Camera(canvas, resolution, fov) {
    this.resolution = resolution;
    this.fov = fov;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width = window.innerWidth * 0.5;
    this.height = canvas.height = window.innerHeight * 0.5;
    this.spacing = this.width / resolution;
    this.range = MOBILE ? 8 : 14;
    this.lightRange = 5;
    this.scale = (this.width + this.height) / 1200;
    return;
  }

  Camera.prototype.render = function(player, map) {
    this.drawSky(player.direction, map.skybox, map.light);
    this.drawColumns(player, map);
    this.drawWeapon(player.weapon, player.paces);
  };

  Camera.prototype.drawSky = function(direction, sky, ambient) {
    var left, width;
    width = this.width * (CIRCLE / this.fov);
    left = -width * direction / CIRCLE;
    this.ctx.save();
    this.ctx.drawImage(sky.image, left, 0, width, this.height);
    if (left < width - this.width) {
      this.ctx.drawImage(sky.image, left + width, 0, width, this.height);
    }
    if (ambient > 0) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = ambient * 0.1;
      this.ctx.fillRect(0, this.height * 0.5, this.width, this.height * 0.5);
    }
    this.ctx.restore();
  };

  Camera.prototype.drawColumns = function(player, map) {
    var angle, column, ray, _i, _ref1;
    this.ctx.save();
    for (column = _i = 0, _ref1 = this.resolution; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; column = 0 <= _ref1 ? ++_i : --_i) {
      angle = this.fov * (column / this.resolution - 0.5);
      ray = map.cast(player, player.direction + angle, this.range);
      this.drawColumn(column, ray, angle, map);
    }
    this.ctx.restore();
  };

  Camera.prototype.drawWeapon = function(weapon, paces) {
    var bobX, bobY, left, top;
    bobX = (Math.cos(paces * 2)) * this.scale * 6;
    bobY = (Math.sin(paces * 4)) * this.scale * 6;
    left = this.width * 0.66 + bobX;
    top = this.height * 0.6 + bobY;
    this.ctx.drawImage(weapon.image, left, top, weapon.width * this.scale, weapon.height * this.scale);
  };

  Camera.prototype.drawColumn = function(column, ray, angle, map) {
    var ctx, hit, left, rain, rainDrops, s, step, texture, textureX, wall, width, _i, _ref1;
    ctx = this.ctx;
    texture = map.wallTexture;
    left = Math.floor(column * this.spacing);
    width = Math.ceil(this.spacing);
    hit = 0;
    while (hit < ray.length && ray[hit].height <= 0) {
      hit += 1;
    }
    for (s = _i = _ref1 = ray.length - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; s = _ref1 <= 0 ? ++_i : --_i) {
      step = ray[s];
      rainDrops = (Math.pow(Math.random(), 3)) * s;
      rain = (rainDrops > 0) && this.project(0.1, angle, step.distance);
      if (s === hit) {
        textureX = Math.floor(texture.width * step.offset);
        wall = this.project(step.height, angle, step.distance);
        ctx.globalAlpha = 1;
        ctx.drawImage(texture.image, textureX, 0, 1, texture.height, left, wall.top, width, wall.height);
        ctx.fillStyle = '#000000';
        ctx.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - map.light, 0);
        ctx.fillRect(left, wall.top, width, wall.height);
      }
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.15;
      while (--rainDrops > 0) {
        ctx.fillRect(left, Math.random() * rain.top, 1, rain.height);
      }
    }
  };

  Camera.prototype.project = function(height, angle, distance) {
    var bottom, wallHeight, z;
    z = distance * Math.cos(angle);
    wallHeight = this.height * height / z;
    bottom = this.height / 2 * (1 + 1 / z);
    return {
      top: bottom - wallHeight,
      height: wallHeight
    };
  };

  return Camera;

})();


},{"./constants.coffee":3}],3:[function(require,module,exports){
var CIRCLE, MOBILE;

exports.CIRCLE = CIRCLE = Math.PI * 2;

exports.MOBILE = MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);


},{}],4:[function(require,module,exports){
var Controls;

module.exports = Controls = Controls = (function() {
  function Controls() {
    this.codes = {
      37: 'left',
      39: 'right',
      38: 'forward',
      40: 'backward'
    };
    this.states = {
      left: false,
      right: false,
      forward: false,
      backward: false
    };
    document.addEventListener('keydown', this.onKey.bind(this, true), false);
    document.addEventListener('keyup', this.onKey.bind(this, false), false);
    document.addEventListener('touchstart', this.onTouch.bind(this), false);
    document.addEventListener('touchmove', this.onTouch.bind(this), false);
    document.addEventListener('touchend', this.onTouchEnd.bind(this), false);
  }

  Controls.prototype.onTouch = function(e) {
    var t;
    t = e.touches[0];
    this.onTouchEnd(e);
    if (t.pageY < window.innerHeight * 0.5) {
      this.onKey(true, {
        keyCode: 38
      });
    } else if (t.pageX < window.innerWidth * 0.5) {
      this.onKey(true, {
        keyCode: 37
      });
    } else if (t.pageY > window.innerWidth * 0.5) {
      this.onKey(true, {
        keyCode: 39
      });
    }
  };

  Controls.prototype.onTouchEnd = function(e) {
    this.states = {
      left: false,
      right: false,
      forward: false,
      backward: false
    };
    e.preventDefault();
    e.stopPropagation();
  };

  Controls.prototype.onKey = function(val, e) {
    var state;
    state = this.codes[e.keyCode];
    if (state == null) {
      return;
    }
    this.states[state] = val;
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
  };

  return Controls;

})();


},{}],5:[function(require,module,exports){
var GameLoop;

module.exports = GameLoop = GameLoop = (function() {
  function GameLoop() {
    this.frame = this.frame.bind(this);
    this.lastTime = 0;
    this.callback = function() {
      return void 0;
    };
    return;
  }

  GameLoop.prototype.start = function(callback) {
    this.callback = callback;
    requestAnimationFrame(this.frame);
  };

  GameLoop.prototype.frame = function(time) {
    var seconds;
    seconds = (time - this.lastTime) / 1000;
    this.lastTime = time;
    if (seconds < 0.2) {
      this.callback(seconds);
    }
    requestAnimationFrame(this.frame);
  };

  return GameLoop;

})();


},{}],6:[function(require,module,exports){
var Bitmap, Map;

Bitmap = require('./bitmap.coffee');

module.exports = Map = Map = (function() {
  function Map(size) {
    this.size = size;
    this.wallGrid = new Uint8Array(Math.pow(this.size, 2));
    this.skybox = new Bitmap('./img/deathvalley_panorama.jpg', 4000, 1290);
    this.wallTexture = new Bitmap('./img/wall_texture.jpg', 1024, 1024);
    this.light = 0;
    return;
  }

  Map.prototype.get = function(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) {
      return -1;
    }
    return this.wallGrid[y * this.size + x];
  };

  Map.prototype.randomize = function() {
    var i, _i, _ref;
    for (i = _i = 0, _ref = Math.pow(this.size, 2); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      this.wallGrid[i] = Math.random() < 0.3 ? 1 : 0;
    }
  };

  Map.prototype.cast = function(point, angle, range) {
    var cos, inspect, noWall, ray, self, sin, step;
    ray = function(origin) {
      var nextStep, stepX, stepY;
      stepX = step(sin, cos, origin.x, origin.y);
      stepY = step(cos, sin, origin.y, origin.x, true);
      nextStep = stepX.length2 < stepY.length2 ? inspect(stepX, 1, 0, origin.distance, stepX.y) : inspect(stepY, 0, 1, origin.distance, stepY.x);
      if (nextStep.distance > range) {
        return [origin];
      }
      return [origin].concat(ray(nextStep));
    };
    step = function(rise, run, x, y, inverted) {
      var dx, dy;
      if (run === 0) {
        return noWall;
      }
      dx = run > 0 ? (Math.floor(x + 1)) - x : (Math.ceil(x - 1)) - x;
      dy = dx * (rise / run);
      return {
        x: inverted ? y + dy : x + dx,
        y: inverted ? x + dx : y + dy,
        length2: dx * dx + dy * dy
      };
    };
    inspect = function(step, shiftX, shiftY, distance, offset) {
      var dx, dy;
      dx = cos < 0 ? shiftX : 0;
      dy = sin < 0 ? shiftY : 0;
      step.height = self.get(step.x - dx, step.y - dy);
      step.distance = distance + Math.sqrt(step.length2);
      if (shiftX) {
        step.shading = cos < 0 ? 2 : 0;
      } else {
        step.shading = sin < 0 ? 2 : 1;
      }
      step.offset = offset - Math.floor(offset);
      return step;
    };
    self = this;
    sin = Math.sin(angle);
    cos = Math.cos(angle);
    noWall = {
      length2: Infinity
    };
    return ray({
      x: point.x,
      y: point.y,
      height: 0,
      distance: 0
    });
  };

  Map.prototype.update = function(seconds) {
    if (this.light > 0) {
      this.light = Math.max(this.light - 10 * seconds, 0);
    } else if (Math.random() * 5 < seconds) {
      this.light = 2;
    }
  };

  return Map;

})();


},{"./bitmap.coffee":1}],7:[function(require,module,exports){
var Bitmap, CIRCLE, Player;

Bitmap = require('./bitmap.coffee');

CIRCLE = require('./constants.coffee').CIRCLE;

module.exports = Player = Player = (function() {
  function Player(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.weapon = new Bitmap('./img/knife_hand.png', 319, 320);
    this.paces = 0;
    return;
  }

  Player.prototype.rotate = function(angle) {
    this.direction = (this.direction + angle + CIRCLE) % CIRCLE;
  };

  Player.prototype.walk = function(distance, map) {
    var dx, dy;
    dx = (Math.cos(this.direction)) * distance;
    dy = (Math.sin(this.direction)) * distance;
    if ((map.get(this.x + dx, this.y)) <= 0) {
      this.x += dx;
    }
    if ((map.get(this.x, this.y + dy)) <= 0) {
      this.y += dy;
    }
    this.paces += distance;
  };

  Player.prototype.update = function(controls, map, seconds) {
    if (controls.left) {
      this.rotate(-Math.PI * seconds);
    }
    if (controls.right) {
      this.rotate(Math.PI * seconds);
    }
    if (controls.forward) {
      this.walk(3 * seconds, map);
    }
    if (controls.backward) {
      this.walk(-3 * seconds, map);
    }
  };

  return Player;

})();


},{"./bitmap.coffee":1,"./constants.coffee":3}],8:[function(require,module,exports){
var Bitmap, Camera, Controls, GameLoop, MOBILE, Map, Player, camera, controls, display, frame, gameloop, map, player;

Player = require('./player.coffee');

Map = require('./map.coffee');

Controls = require('./controls.coffee');

Camera = require('./camera.coffee');

GameLoop = require('./gameloop.coffee');

Bitmap = require('./bitmap.coffee');

MOBILE = require('./constants.coffee').MOBILE;

display = document.getElementById('display');

player = new Player(15.3, -1.2, Math.PI * 0.3);

map = new Map(32);

controls = new Controls();

camera = new Camera(display, (MOBILE ? 160 : 320), Math.PI * 0.4);

gameloop = new GameLoop();

map.randomize();

gameloop.start(frame = function(seconds) {
  map.update(seconds);
  player.update(controls.states, map, seconds);
  camera.render(player, map);
});


},{"./bitmap.coffee":1,"./camera.coffee":2,"./constants.coffee":3,"./controls.coffee":4,"./gameloop.coffee":5,"./map.coffee":6,"./player.coffee":7}]},{},[8])