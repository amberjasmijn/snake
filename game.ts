import { Snake } from './types'

const SPEED = 500

type Move = { x: number; y: number }
type Position = { x: number; y: number }

const UP: Move = { x: 0, y: -1 }
const DOWN: Move = { x: 0, y: 1 }
const RIGHT: Move = { x: 1, y: 0 }
const LEFT: Move = { x: -1, y: 0 }

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d')

interface State {
  cols: number;
  rows: number;
  snake: Snake[];
  moves: Move[];
}

const initialState = (): State => ({
  cols: 30,
  rows: 20,
  snake: [{ x: 6, y: 6 }],
  moves: [RIGHT]
})

let state = initialState()

const x = (x1: number): number => Math.round(x1 * (canvas.width / state.cols))
const y = (y1: number): number => Math.round(y1 * (canvas.height / state.rows))

const draw = (): void => {
  if (context) {
    // Canvas
    context.fillStyle = 'blue'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Snake
    context.fillStyle = 'white'
    state.snake.map(cell => context.fillRect(x(cell.x), y(cell.y), x(1), y(1)))
  }
}

const positionExist = (p1: Position) => (p2: Position): boolean =>
  p1.x === p2.x && p2.y === p2.y

const nextHead = (state: State): Snake => ({
  x: state.snake[0].x + state.moves[state.moves.length - 1].x,
  y: state.snake[0].y + state.moves[state.moves.length - 1].y
})

const crash = (state: State): boolean => {
  return false
}

const removeFirst = (x: Move[]): Move[] => x.slice(1);
const removeLast = (x: Move[]): Move[] => x.slice(0, x.length - 1);

const isValidMove = (state: State) => (move: Move): boolean =>
  move.x + state.moves[0].x !== 0 || move.y + state.moves[0].y !== 0

const nextSnake = (state: State): Snake[] =>
  crash(state) ? [] : [nextHead(state)].concat(removeLast(state.snake))

const nextMoves = (state: State): Move[] => state.moves.length > 1
  ? removeFirst(state.moves)
  : state.moves

const next = (state: State): State => ({
  ...state,
  moves: nextMoves(state),
  snake: nextSnake(state)
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
  isValidMove(state)(move) ? { ...state, moves: state.moves.concat([move]) } : state

window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowUp': state = enqueue(state, UP); break
    case 'ArrowDown': state = enqueue(state, DOWN); break
    case 'ArrowRight': state = enqueue(state, RIGHT); break
    case 'ArrowLeft': state = enqueue(state, LEFT); break
  }
})

draw()
window.requestAnimationFrame(step(0))
