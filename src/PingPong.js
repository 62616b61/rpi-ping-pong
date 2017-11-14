const random = (x, y) => Math.floor(Math.random() * y) + x

module.exports = class PingPong {
  constructor (events) {
    this.events = events

    this.worldSize = 8
    this.racketSize = 2

    this.start()
    this.subscribe()
    this.loop()
  }

  loop () {
    setInterval(() => {
      this.checkWallsCollision()
      this.checkRacketsCollision()
      this.updateBall()
      this.emit()
    }, 250)
  }

  start () {
    this.ball = false
    this.speed = {x: -1, y: -1}
    this.rackets = [0, 0]

    this.updateBall()
  }

  ballNextPosition () {
    return {
      x: this.ball.x + this.speed.x,
      y: this.ball.y + this.speed.y
    }
  }

  checkWallsCollision () {
    const nextPos = this.ballNextPosition()

    // horizontal walls - bounce
    if (nextPos.x < 0 || nextPos.x >= this.worldSize) {
      this.speed.x *= -1
    }

    // vertical walls (behind rackets) - restart the game
    if (nextPos.y < 0 || nextPos.y >= this.worldSize) {
      this.start()
    }
  }

  checkRacketsCollision () {
    const nextPos = this.ballNextPosition()

    const racketCells = []
    this.rackets.forEach((x, racket) => {
      const y = racket === 0 ? 0 : this.worldSize - 1

      // racket size
      for (let i = 0; i < this.racketSize; i++) {
        racketCells.push({x: x + i, y})
      }
    })

    const isNext = !!racketCells.find(
      cell => cell.x === nextPos.x && cell.y === nextPos.y
    )
    if (isNext) {
      this.speed.y *= -1
    }

  }

  updateBall () {
    if (!this.ball) {
      const randomX = random(1, this.worldSize - 1)
      const randomY = random(1, this.worldSize - 1)

      this.ball = {x: randomX, y: randomY}
    } else {
      this.ball.x += this.speed.x
      this.ball.y += this.speed.y
    }
  }

  move (direction, player) {
    switch (direction) {
      case 'up':
        if (this.rackets[player] > 0)
          this.rackets[player]--
        break
      case 'down':
        if (this.rackets[player] < this.worldSize - this.racketSize)
          this.rackets[player]++
        break
    }
  }

  world () {
    // create 2d array for the world
    const world = new Array(this.worldSize)
    for (let x = 0; x < this.worldSize; x++) {
      world[x] = new Array(this.worldSize).fill(0)
    }

    // draw the ball
    world[this.ball.x][this.ball.y] = 1

    // draw rackets
    this.rackets.forEach((x, racket) => {
      const y = racket === 0 ? 0 : this.worldSize - 1

      // racket size
      for (let i = 0; i < this.racketSize; i++) {
        world[x + i][y] = 1
      }
    })

    return world
  }

  subscribe () {
    this.events.on('move', (direction, player) => this.move(direction, player))
  }

  emit () {
    this.events.emit('display', this.world())
  }
}
