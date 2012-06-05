module.exports = function tap(dest) {
  var source = this
  var open = true

  function writeDest(data) {
    if (dest.writable && open) {
      open = dest.write(data)
    }
  }

  function endDest() {
    cleanup()
    dest.end()
  }

  function maybeThrow(error) {
   cleanup()
    if (this.listeners('error').length === 0) {
      throw error
    }
  }

  function openDest() { open = true }

  function destroyDest() {
    cleanup()
    dest.destroy()
  }

  if (!dest._isStdio) {
    source.on('end', endDest)
    source.on('close', destroyDest)
  }

  source.on('data', writeDest)
  source.on('error', maybeThrow)
  source.on('end', cleanup)
  source.on('close', cleanup)

  dest.on('drain', openDest)
  dest.on('error', cleanup)
  dest.on('end', cleanup)
  dest.on('close', cleanup)

  function cleanup() {
    source.removeListener('data', writeDest)
    source.removeListener('end', endDest)
    source.removeListener('close', destroyDest)
    source.removeListener('end', cleanup)
    source.removeListener('close', cleanup)
    source.removeListener('error', maybeThrow)

    dest.removeListener('drain', openDest)
    dest.removeListener('end', cleanup)
    dest.removeListener('close', cleanup)
    dest.removeListener('error', cleanup)
  }

  return source
}