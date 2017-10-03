const keypress = require('keypress')
keypress(process.stdin)

module.exports = class Joystick {
  constructor (events) {
    this.events = events

    this.subscribe()
  }

  subscribe () {
    process.stdin.on('keypress', (ch, key) => {
      switch (key.name) {
        case 'w':
          this.emit('up', 0)
          break
        case 's':
          this.emit('down', 0)
          break
        case 'up':
          this.emit('up', 1)
          break
        case 'down':
          this.emit('down', 1)
          break
      }
    })
  }

  emit (direction, player) {
    this.events.emit('move', direction, player)
  }
}
