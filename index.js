const EventEmitter = require('events')

const PingPong = require('./src/PingPong')
const Joystick = require('./src/Joystick')

const events = new EventEmitter()

const pingpong = new PingPong(events)
const joystick0 = new Joystick(events, 0, 0)
const joystick1 = new Joystick(events, 1, 1)
