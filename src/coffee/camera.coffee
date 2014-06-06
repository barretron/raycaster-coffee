{CIRCLE, MOBILE} = require './constants.coffee'

module.exports = Camera =
class Camera
  constructor: (canvas, @resolution, @fov) ->
    @ctx = canvas.getContext '2d'
    @width = canvas.width = window.innerWidth * 0.5
    @height = canvas.height = window.innerHeight * 0.5
    @spacing = @width / resolution
    @range = if MOBILE then 8 else 14
    @lightRange = 5
    @scale = (@width + @height) / 1200
    return

  render: (player, map) ->
    @drawSky player.direction, map.skybox, map.light
    @drawColumns player, map
    @drawWeapon player.weapon, player.paces
    return

  drawSky: (direction, sky, ambient) ->
    width = @width * (CIRCLE / @fov)
    left = -width * direction / CIRCLE

    @ctx.save()
    @ctx.drawImage sky.image, left, 0, width, @height

    if left < width - @width
      @ctx.drawImage sky.image, left + width, 0, width, @height

    if ambient > 0
      @ctx.fillStyle = '#ffffff'
      @ctx.globalAlpha = ambient * 0.1
      @ctx.fillRect 0, @height * 0.5, @width, @height * 0.5

    @ctx.restore()
    return

  drawColumns: (player, map) ->
    @ctx.save()

    for column in [0...@resolution]
      angle = @fov * (column / @resolution - 0.5)
      ray = map.cast player, player.direction + angle, @range
      @drawColumn column, ray, angle, map

    @ctx.restore()
    return

  drawWeapon: (weapon, paces) ->
    bobX = (Math.cos paces * 2) * @scale * 6
    bobY = (Math.sin paces * 4) * @scale * 6
    left = @width * 0.66 + bobX
    top = @height * 0.6 + bobY

    @ctx.drawImage  weapon.image,
                    left,
                    top,
                    weapon.width * @scale,
                    weapon.height * @scale
    return

  drawColumn: (column, ray, angle, map) ->
    ctx = @ctx
    texture = map.wallTexture
    left = Math.floor column * @spacing
    width = Math.ceil @spacing
    hit = 0

    hit += 1 while hit < ray.length and ray[hit].height <= 0

    for s in [ray.length - 1..0]
      step = ray[s]
      rainDrops = (Math.pow Math.random(), 3) * s
      rain = (rainDrops > 0) and @project 0.1, angle, step.distance

      if s is hit
        textureX = Math.floor texture.width * step.offset
        wall = @project step.height, angle, step.distance

        ctx.globalAlpha = 1

        ctx.drawImage texture.image,
                      textureX,
                      0,
                      1,
                      texture.height,
                      left,
                      wall.top,
                      width,
                      wall.height

        ctx.fillStyle = '#000000'
        ctx.globalAlpha = Math.max (step.distance + step.shading) /
          @lightRange - map.light, 0

        ctx.fillRect left,
                     wall.top,
                     width,
                     wall.height

      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.15

      while --rainDrops > 0
        ctx.fillRect left, Math.random() * rain.top, 1, rain.height

    return

  project: (height, angle, distance) ->
    z = distance * Math.cos angle
    wallHeight = @height * height / z
    bottom = @height / 2 * (1 + 1 / z)

    top: bottom - wallHeight
    height: wallHeight