Player = require './player.coffee'
Map = require './map.coffee'
Controls = require './controls.coffee'
Camera = require './camera.coffee'
GameLoop = require './gameloop.coffee'
Bitmap = require './bitmap.coffee'
{MOBILE} = require './constants.coffee'


display = document.getElementById 'display'
player = new Player 15.3, -1.2, Math.PI * 0.3
map = new Map 32
controls = new Controls()
camera = new Camera display, (if MOBILE then 160 else 320), Math.PI * 0.4
gameloop = new GameLoop()

map.randomize()

gameloop.start frame = (seconds) ->
  map.update seconds
  player.update controls.states, map, seconds
  camera.render player, map
  return