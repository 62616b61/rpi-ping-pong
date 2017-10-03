const EventEmitter = require('events')

const PingPong = require('./src/PingPong')
const Keyboard = require('./src/Keyboard')

const events = new EventEmitter()

const pingpong = new PingPong(events)
const keyboard = new Keyboard(events)
