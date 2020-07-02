import { Snake, Move, Position } from './types'

const SPEED = 500
const WIDTH = 30
const HEIGHT = 20
const BACKGROUND = '#4274ff'
const SNAKE_COLOR = '#75D4BE'
const APPLE_COLOR = '#e01dee'

const UP: Move = { x: 0, y: -1 }
const DOWN: Move = { x: 0, y: 1 }
const RIGHT: Move = { x: 1, y: 0 }
const LEFT: Move = { x: -1, y: 0 }

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d')

interface GameState {
  cols: number
  rows: number
  snake: Snake[]
  moves: Move[]
  apple: Position
}

const initialState = (): GameState => ({
  cols: WIDTH,
  rows: HEIGHT,
  snake: [{ x: 6, y: 6 }],
  moves: [RIGHT],
  apple: { x: 10, y: 6 }
})

let state = initialState()

const removeFirst = (x: Move[]): Move[] => x.slice(1)
const removeLast = (x: Move[]): Move[] => x.slice(0, x.length - 1)

const random = (min: number) => (max: number) =>
  Math.ceil(Math.random() * (max - min) + min)

const randomPosition = (state: GameState) => ({
  x: random(0)(state.cols - 1),
  y: random(0)(state.rows - 1)
})

const withinGrid = (newPos: number) => (boundaries: number): number => {
  if (newPos >= boundaries) {
    return 0
  } else if (newPos < 0) {
    return boundaries
  } else return newPos
}

const x = (x1: number): number => Math.round(x1 * (canvas.width / state.cols))
const y = (y1: number): number => Math.round(y1 * (canvas.height / state.rows))

const draw = (): void => {
  if (context) {
    // Canvas
    context.fillStyle = BACKGROUND
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Snake
    context.fillStyle = SNAKE_COLOR
    state.snake.map(cell => context.fillRect(x(cell.x), y(cell.y), x(1), y(1)))

    // Apple
    context.fillStyle = APPLE_COLOR
    context.fillRect(x(state.apple.x), x(state.apple.y), x(1), y(1))
  }
}

const isValidMove = (state: GameState) => (move: Move): boolean =>
  move.x + state.moves[0].x !== 0 || move.y + state.moves[0].y !== 0

const positionExist = (p1: Position) => (p2: Position): boolean =>
  p1.x === p2.x && p1.y === p2.y

const nextHead = (state: GameState): Snake => ({
  x: withinGrid(state.snake[0].x + state.moves[state.moves.length - 1].x)(
    state.cols
  ),
  y: withinGrid(state.snake[0].y + state.moves[state.moves.length - 1].y)(
    state.rows
  )
})

const nextApple = (state: GameState) =>
  willEat(state) ? randomPosition(state) : state.apple

const willCrash = (state: GameState) =>
  state.snake.find(positionExist(nextHead(state)))

const willEat = (state: GameState) => positionExist(nextHead(state))(state.apple)

const nextSnake = (state: GameState): Snake[] => {
  return willCrash(state)
    ? []
    : willEat(state)
    ? [nextHead(state)].concat(state.snake)
    : [nextHead(state)].concat(removeLast(state.snake))
}

const nextMoves = (state: GameState): Move[] =>
  state.moves.length > 1 ? removeFirst(state.moves) : state.moves

const next = (state: GameState): GameState => ({
  ...state,
  moves: nextMoves(state),
  snake: nextSnake(state),
  apple: nextApple(state)
})

const nextStep = (t1: number) => (t2: number): void => {
  if (t2 - t1 > SPEED) {
    state = next(state)
    draw()
    window.requestAnimationFrame(nextStep(t2))
  } else {
    window.requestAnimationFrame(nextStep(t1))
  }
}

const enqueueMove = (state: GameState, move: Move): GameState =>
  isValidMove(state)(move)
    ? { ...state, moves: state.moves.concat([move]) }
    : state

window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowUp':
      state = enqueueMove(state, UP)
      break
    case 'ArrowDown':
      state = enqueueMove(state, DOWN)
      break
    case 'ArrowRight':
      state = enqueueMove(state, RIGHT)
      break
    case 'ArrowLeft':
      state = enqueueMove(state, LEFT)
      break
  }
})

window.requestAnimationFrame(nextStep(0))
