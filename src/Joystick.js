const Mcp3008 = require('mcp3008.js')
const adc = new Mcp3008()

module.exports = class Joystick {
  constructor (events) {
    this.events = events
    this.current = null

    this.emitLock = false
    this.lockX = false
    this.lockY = false

    setInterval(() => this.loop(), 1)
  }

  loop () {
    adc.read(1, value => {
      this.checkX(value)
    })
    adc.read(0, value => {
      this.checkY(value)
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

  checkY (y) {
    if (this.lockX) return

    if (y > 750) {
      this.lockY = true
      this.current = 'up' 
    }
    else if (y < 250) {
      this.lockY = true
      this.current = 'down'
    }
    else {
      this.emitLock = false
      this.lockY = false
      this.current = null
    }
  }

  emit () {
    if (!this.emitLock && this.current) {
      this.emitLock = true
      
      this.events.emit('move', this.current)
    }
  }
}
