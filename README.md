CoffeeScript Raycaster Engine
=============================

This is a CoffeeScript port of PlayfulJS's [Raycaster Demo](https://github.com/hunterloftis/playfuljs/blob/master/content/demos/raycaster.html). Two focuses here are to:

* modularize the original JavaScript code.
* port the JavaScript code to idiomatic CoffeeScript (rather than an automated port).

Check out [PlayfulJS's article](http://www.playfuljs.com/a-first-person-engine-in-265-lines/) for and in-depth guide.

Dev Requirements
----------------

If you just want to run the demo, point your browser to `app/index.html`.

If you want to hack on the engine, install the following:

* CoffeeScript
* Browserify 
* Coffeeify

`npm install` will compile and Browserify the CoffeeScript 
and copy `src/index.html` and `src/img` to `app`.