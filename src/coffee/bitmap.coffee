module.exports = Bitmap =
class Bitmap
  constructor: (src, @width, @height) ->
    @image = new Image()
    @image.src = src

