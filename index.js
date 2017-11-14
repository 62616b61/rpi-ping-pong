const EventEmitter = require('events')
const Raspi = require('raspi-io')
const five = require('johnny-five')

const PingPong = require('./src/PingPong')
const Joystick = require('./src/Joystick')
const Matrix = require('./src/Matrix')

const events = new EventEmitter()

const board = new five.Board({
  repl: false,
  io: new Raspi({
    excludePins: [
      'P1-19',
      'P1-21',
      'P1-23',
      'P1-24'
    ]
  })
})

board.on('ready', () => {
  const register = new five.ShiftRegister({
    isAnode: true,
    pins: {
      data: 'P1-11',
      clock: 'P1-15',
      latch: 'P1-13',
      reset: 'P1-7'
    }
  })
  register.reset()


  const pingpong = new PingPong(events)
  const joystick0 = new Joystick(events, 0, 0)
  const joystick1 = new Joystick(events, 1, 1)
})
