Bitmap = require './bitmap.coffee'
{CIRCLE} = require './constants.coffee'

module.exports = Player =
class Player
  constructor: (@x, @y, @direction) ->
    @weapon = new Bitmap './img/knife_hand.png', 319, 320
    @paces = 0
    return

  rotate: (angle) ->
    @direction = (@direction + angle + CIRCLE) % (CIRCLE)
    return

  walk: (distance, map) ->
    dx = (Math.cos @direction) * distance
    dy = (Math.sin @direction) * distance

    @x += dx if (map.get @x + dx, @y) <= 0
    @y += dy if (map.get @x, @y + dy) <= 0

    @paces += distance
    return

  update: (controls, map, seconds) ->
    @rotate -Math.PI * seconds  if controls.left
    @rotate  Math.PI * seconds  if controls.right

    @walk    3 * seconds, map   if controls.forward
    @walk   -3 * seconds, map   if controls.backward
    return