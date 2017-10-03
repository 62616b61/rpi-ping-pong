const random = (x, y) => Math.floor(Math.random() * y) + x

module.exports = class Snake {
  constructor (events) {
    this.events = events

    this.worldSize = 6
    this.speed = {x: -1, y: 0}

    this.total = 0

    this.updateSnake()
    this.updateFood()

    this.subscribe()
    this.loop()
  }

  loop () {
    setInterval(() => {
      this.eatFood()
      this.updateSnake()
      this.emit()
    }, 500)
  }

  eatFood () {
    if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
      this.updateFood()
      this.total++
    }
  }

  isSnake (x, y) {
    return !!this.snake.find(s => s.x === x && s.y === y)
  }

  updateSnake () {
    if (!this.snake) {
      const randomX = random(1, this.worldSize - 1)
      const randomY = random(1, this.worldSize - 1)

      this.snake = [{x: randomX, y: randomY}]
    }

    const nextPosX = this.snake[0].x + this.speed.x
    const nextPosY = this.snake[0].y + this.speed.y

    if (nextPosX >= 0 && nextPosX < this.worldSize &&
      nextPosY >= 0 && nextPosY < this.worldSize) {
      this.snake.unshift({x: nextPosX, y: nextPosY})
    }

    this.snake.length = this.total + 1
  }

  updateFood () {
    const randomX = random(1, this.worldSize - 1)
    const randomY = random(1, this.worldSize - 1)

    if (this.isSnake(randomX, randomY)) this.updateFood()
    else this.food = {x: randomX, y: randomY}
  }

  move (direction) {
    switch (direction) {
      case 'up':
        this.speed.x = -1
        this.speed.y = 0
        break
      case 'down':
        this.speed.x = 1
        this.speed.y = 0
        break
      case 'right':
        this.speed.x = 0
        this.speed.y = 1
        break
      case 'left':
        this.speed.x = 0
        this.speed.y = -1
        break
    }

    console.log('dir', direction)
  }

  world () {
    const world = new Array(this.worldSize)
    for (let x = 0; x < this.worldSize; x++) world[x] = new Array(this.worldSize).fill(0)

    this.snake.forEach(s => {world[s.x][s.y] = 1})

    world[this.food.x][this.food.y] = 2

    return world
  }

  subscribe () {
    this.events.on('move', (direction) => this.move(direction))
  }

  emit () {
    //this.events.emit('display', this.world())

    //console.log("\x1B[2J")
    console.log(this.world())
  }
}
