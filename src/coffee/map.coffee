Bitmap = require './bitmap.coffee'

module.exports = Map =
class Map
  constructor: (@size) ->
    @wallGrid = new Uint8Array @size ** 2
    @skybox = new Bitmap './img/deathvalley_panorama.jpg', 4000, 1290
    @wallTexture = new Bitmap './img/wall_texture.jpg', 1024, 1024
    @light = 0
    return

  get: (x, y) ->
    x = Math.floor x
    y = Math.floor y

    return -1 if x < 0 or x > @size - 1 or y < 0 or y > @size - 1

    @wallGrid[y * @size + x]

  randomize: ->
    for i in [0...@size ** 2]
      @wallGrid[i] = if Math.random() < 0.3 then 1 else 0
    return

  cast: (point, angle, range) ->
    ray = (origin) ->
      stepX = step sin, cos, origin.x, origin.y
      stepY = step cos, sin, origin.y, origin.x, true

      nextStep = if stepX.length2 < stepY.length2
        inspect stepX, 1, 0, origin.distance, stepX.y
      else
        inspect stepY, 0, 1, origin.distance, stepY.x

      return [origin] if nextStep.distance > range

      [origin].concat ray nextStep

    step = (rise, run, x, y, inverted) ->
      return noWall if run is 0

      dx = if run > 0 then (Math.floor x + 1) - x else (Math.ceil x - 1) - x
      dy = dx * (rise / run)

      x: if inverted then y + dy else x + dx
      y: if inverted then x + dx else y + dy
      length2: dx * dx + dy * dy

    inspect = (step, shiftX, shiftY, distance, offset) ->
      dx = if cos < 0 then shiftX else 0
      dy = if sin < 0 then shiftY else 0

      step.height = self.get step.x - dx, step.y - dy
      step.distance = distance + Math.sqrt step.length2

      if shiftX
        step.shading = if cos < 0 then 2 else 0
      else
        step.shading = if sin < 0 then 2 else 1

      step.offset = offset - Math.floor offset
      step

    self    = this
    sin     = Math.sin angle
    cos     = Math.cos angle
    noWall  = length2: Infinity

    ray
      x:        point.x
      y:        point.y
      height:   0
      distance: 0

  update: (seconds) ->
    if @light > 0
      @light = Math.max @light - 10 * seconds, 0
    else if Math.random() * 5 < seconds
      @light = 2
    return