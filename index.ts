import { Direction } from "./types"

const WIDTH = 30 // number of horizontal tiles
const HEIGHT = 20 // number of vertical tiles
const CELL_SIZE = 20 // width of one cell
const SNAKE_COLOR = "red"
const SPEED = 1000

class Cell {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Worm {
  public game: Game

  private head: Cell;
  private tail: Cell[]
  private directions: Direction[]

  private readonly INITIAL_POSITION = { x: 0, y: 0 }
  private readonly INITIAL_DIRECTION: Direction = "right"

  constructor(game: Game) {
    this.game = game
    this.head = new Cell(this.INITIAL_POSITION.x, this.INITIAL_POSITION.y)
    this.tail = []
    this.directions = [this.INITIAL_DIRECTION]
  }

  draw(context: CanvasRenderingContext2D): void {
    // Head
    context.fillStyle = SNAKE_COLOR;
    context.fillRect(this.head.x * CELL_SIZE, this.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

    // Tail
    context.fillStyle = SNAKE_COLOR;
    this.tail.forEach((cell: Cell) => context.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE))
  }

  setDirection(direction: Direction): void {
    const lastDirection = this.directions[this.directions.length - 1];

    if (lastDirection == 'up' && (direction == 'down' || direction == 'up')) {
      return;
    }
    if (lastDirection == 'down' && (direction == 'up' || direction == 'down')) {
      return;
    }
    if (lastDirection == 'left' && (direction == 'right' || direction == 'left')) {
      return;
    }
    if (lastDirection == 'right' && (direction == 'left' || direction == 'right')) {
      return;
    }
    this.directions.push(direction)
  }


  nextPosition(): Cell {
    const direction = this.directions.length > 1 ? this.directions.splice(0, 1)[0] : this.directions[0];

    switch (direction) {
      case "right":
        return new Cell(this.head.x + 1, this.head.y)
      case "left":
        return new Cell(this.head.x - 1, this.head.y)
      case "up":
        return new Cell(this.head.x, this.head.y - 1)
      case "down":
        return new Cell(this.head.x, this.head.y + 1)
    }
  }

  move(): void {
    this.tail.push(this.head);
    this.head = this.nextPosition()
  }
}

class Grid {
  public game: Game;

  constructor(game: Game) {
    this.game = game
    this.createGrid(game.context)
  }

  createGrid(context: CanvasRenderingContext2D | null): void {
    if (!context) return

    context.canvas.width = WIDTH * CELL_SIZE
    context.canvas.height = HEIGHT * CELL_SIZE

    let loop = 0

    for (let y = 0; y <= context.canvas.height; y += CELL_SIZE) {
      for (let x = 0; x <= context.canvas.width; x += CELL_SIZE) {
        context.beginPath();
        context.rect(x, y, CELL_SIZE, CELL_SIZE);
        if (loop % 2 === 0) {
          context.fillStyle = "#f6f6f6";
        } else {
          context.fillStyle = "#f0f0f0";
        }
        context.fill();
        context.closePath();
        loop++
      }
    }
  }
}

class Game {
  public context: CanvasRenderingContext2D | null
  public grid: Grid;
  public worm: Worm;

  private canvas: HTMLCanvasElement;
  private running = false
  private nextMove: number

  constructor() {
    // Create Canvas
    this.canvas = document.createElement('canvas') as HTMLCanvasElement
    document.body.appendChild(this.canvas)

    // Get context
    this.context = this.canvas.getContext('2d')

    // Initialize game elements
    this.grid = new Grid(this)
    this.worm = new Worm(this)

    this.nextMove = 0

    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }

  start(): void {
    this.running = true
    this.nextMove = 0
    requestAnimationFrame(this.loop.bind(this))
  }

  loop(time: number): void {
    if (this.running) {
      requestAnimationFrame(this.loop.bind(this))

      if (time >= this.nextMove) {
        this.nextMove = time + SPEED;
        this.worm.move()
        // this.update()
      }
    }
  }

  update(): void {
    const context = this.canvas.getContext("2d");
    if (context) {
      this.worm.draw(context)
    } else {
      throw new Error("Context is not defined.")
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.worm.setDirection('right');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.worm.setDirection('left');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.worm.setDirection('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.worm.setDirection('down');
        break;
    }
  }
}

new Game().start()

