const random = (x, y) => Math.floor(Math.random() * y) + x

module.exports = class PingPong {
  constructor (events) {
    this.events = events

    this.worldSize = 8
    this.speed = {x: -1, y: -1}

    this.rackets = [6, 0]
    this.racketSize = 2

    this.updateBall()
    this.subscribe()
    this.loop()
  }

  loop () {
    setInterval(() => {
      this.checkCollision()
      this.updateBall()
      this.emit()
    }, 500)
  }

  checkCollision () {
    const nextPosX = this.ball.x + this.speed.x
    const nextPosY = this.ball.y + this.speed.y

    if (nextPosX < 0 || nextPosX >= this.worldSize) {
      this.speed.x *= -1
    }

    if (nextPosY < 0 || nextPosY >= this.worldSize) {
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

      world[x][y] = 1
      world[x+1][y] = 1
    })

    return world
  }

  subscribe () {
    this.events.on('move', (direction, player) => this.move(direction, player))
  }

  emit () {
    //this.events.emit('display', this.world())

    //console.log("\x1B[2J")
    console.log(this.world())
  }
}
