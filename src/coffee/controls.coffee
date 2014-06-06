module.exports = Controls =
class Controls
  constructor: ->
    @codes =
      37: 'left'
      39: 'right'
      38: 'forward'
      40: 'backward'

    @states =
      left: false
      right: false
      forward: false
      backward: false

    document.addEventListener 'keydown', (@onKey.bind this, true), false
    document.addEventListener 'keyup', (@onKey.bind this, false), false
    document.addEventListener 'touchstart', (@onTouch.bind this), false
    document.addEventListener 'touchmove', (@onTouch.bind this), false
    document.addEventListener 'touchend', (@onTouchEnd.bind this), false

  onTouch: (e) ->
    t = e.touches[0]

    @onTouchEnd e

    if t.pageY < window.innerHeight * 0.5
      @onKey true,
        keyCode: 38

    else if t.pageX < window.innerWidth * 0.5
      @onKey true,
        keyCode: 37

    else if t.pageY > window.innerWidth * 0.5
      @onKey true,
        keyCode: 39

    return

  onTouchEnd: (e) ->
    @states =
      left: false
      right: false
      forward: false
      backward: false

    e.preventDefault()
    e.stopPropagation()
    return

  onKey: (val, e) ->
    state = @codes[e.keyCode]

    return if not state?

    @states[state] = val

    e.preventDefault?()
    e.stopPropagation?()
    return