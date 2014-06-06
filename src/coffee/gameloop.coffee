module.exports = GameLoop =
class GameLoop
  constructor: ->
    @frame = @frame.bind this
    @lastTime = 0
    @callback = ->
      undefined
    return

  start: (callback) ->
    @callback = callback
    requestAnimationFrame @frame
    return

  frame: (time) ->
    seconds = (time - @lastTime) / 1000
    @lastTime = time
    @callback seconds if seconds < 0.2
    requestAnimationFrame @frame
    return