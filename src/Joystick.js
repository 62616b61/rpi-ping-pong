const Mcp3008 = require('mcp3008.js')
const adc = new Mcp3008()

module.exports = class Joystick {
  constructor (events, player, channel) {
    this.events = events
    this.player = player
    this.channel = channel

    this.current = null

    this.emitLock = false
    this.lockX = false

    setInterval(() => this.loop(), 1)
  }

  loop () {
    adc.read(this.channel, value => {
      this.checkX(value)
    })

    this.emit()
  }

  checkX (x) {
    if (this.lockY) return

    if (x > 750) {
      this.lockX = true
      this.current = 'right'
    }
    else if (x < 250) {
      this.lockX = true
      this.current = 'left'
    }
    else {
      this.emitLock = false
      this.lockX = false
      this.current = null
    }
  }

  emit () {
    if (!this.emitLock && this.current) {
      this.emitLock = true

      this.events.emit('move', this.current, player)
    }
  }
}
