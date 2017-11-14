const Mcp3008 = require('mcp3008.js')
const adc = new Mcp3008()

module.exports = class Joystick {
  constructor (events, player, channel) {
    this.events = events
    this.player = player
    this.channel = channel

    this.current = null

    this.emitLock = false
    this.lock = false

    setInterval(() => this.loop(), 1)
  }

  loop () {
    adc.read(this.channel, value => {
      this.check(value)
    })

    this.emit()
  }

  check (value) {
    if (value > 750) {
      this.lock = true
      this.current = 'down'
    }
    else if (value < 250) {
      this.lock = true
      this.current = 'up'
    }
    else {
      this.emitLock = false
      this.lock = false
      this.current = null
    }
  }

  emit () {
    if (!this.emitLock && this.current) {
      this.emitLock = true

      this.events.emit('move', this.current, this.player)
    }
  }
}
