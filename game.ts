import { Snake } from './types'

const SPEED = 100

type Move = { x: number; y: number }
type Position = { x: number; y: number }

const UP: Move = { x: 0, y: -1 }
const DOWN: Move = { x: 0, y: 1 }
const RIGHT: Move = { x: 1, y: 0 }
const LEFT: Move = { x: -1, y: 0 }

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d')

interface State {
  cols: number
  rows: number
  snake: Snake[]
  moves: Move[]
  apple: Position
}

const initialState = (): State => ({
  cols: 30,
  rows: 20,
  snake: [{ x: 6, y: 6 }],
  moves: [RIGHT],
  apple: { x: 10, y: 6 }
})

let state = initialState()

const removeFirst = (x: Move[]): Move[] => x.slice(1)
const removeLast = (x: Move[]): Move[] => x.slice(0, x.length - 1)
const random = (min: number) => (max: number) =>
  Math.ceil(Math.random() * (max - min) + min)

const randomPos = (state: State) => ({
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
    context.fillStyle = '#004777'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Snake
    context.fillStyle = '#00AFB5'
    state.snake.map(cell => context.fillRect(x(cell.x), y(cell.y), x(1), y(1)))

    // Apple
    context.fillStyle = '#FF7700'
    context.fillRect(x(state.apple.x), x(state.apple.y), x(1), y(1))
  }
}

const isValidMove = (state: State) => (move: Move): boolean =>
  move.x + state.moves[0].x !== 0 || move.y + state.moves[0].y !== 0

const positionExist = (p1: Position) => (p2: Position): boolean =>
  p1.x === p2.x && p1.y === p2.y

const nextHead = (state: State): Snake => ({
  x: withinGrid(state.snake[0].x + state.moves[state.moves.length - 1].x)(
    state.cols
  ),
  y: withinGrid(state.snake[0].y + state.moves[state.moves.length - 1].y)(
    state.rows
  )
})

const nextApple = (state: State) =>
  willEat(state) ? randomPos(state) : state.apple

const willCrash = (state: State) =>
  state.snake.find(positionExist(nextHead(state)))

const willEat = (state: State) => positionExist(nextHead(state))(state.apple)

const nextSnake = (state: State): Snake[] => {
  return willCrash(state)
    ? []
    : willEat(state)
    ? [nextHead(state)].concat(state.snake)
    : [nextHead(state)].concat(removeLast(state.snake))
}

const nextMoves = (state: State): Move[] =>
  state.moves.length > 1 ? removeFirst(state.moves) : state.moves

const next = (state: State): State => ({
  ...state,
  moves: nextMoves(state),
  snake: nextSnake(state),
  apple: nextApple(state)
})

const step = (t1: number) => (t2: number): void => {
  if (t2 - t1 > SPEED) {
    state = next(state)
    draw()
    window.requestAnimationFrame(step(t2))
  } else {
    window.requestAnimationFrame(step(t1))
  }
}

const enqueue = (state: State, move: Move): State =>
  isValidMove(state)(move)
    ? { ...state, moves: state.moves.concat([move]) }
    : state

window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowUp':
      state = enqueue(state, UP)
      break
    case 'ArrowDown':
      state = enqueue(state, DOWN)
      break
    case 'ArrowRight':
      state = enqueue(state, RIGHT)
      break
    case 'ArrowLeft':
      state = enqueue(state, LEFT)
      break
  }
})

draw()
window.requestAnimationFrame(step(0))
