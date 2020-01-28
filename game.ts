import { Position as Snake } from "./types";

const SPEED = 1000
const CELL_SIZE = 20

type Move = { x: number; y: number }

const UP: Move = { x: 0, y: 1 };
const DOWN: Move = { x: 0, y: -1 }
const RIGHT: Move = { x: 1, y: 0 }
const LEFT: Move = { x: -1, y: 0 }

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d');

interface State {
  columns: number;
  rows: number;
  snake: Snake[];
  moves: Move[];
}

const initialState = (): State => ({
  columns: 80,
  rows: 40,
  snake: [{ x: 6, y: 6 }],
  moves: [RIGHT],
})

let state = initialState()

const draw = (): void => {
  state.snake.map(cell => context?.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE))
}

const crash = (state: State): boolean => {
  return false
}

const nextHead = (state: State): Snake => ({
  x: state.snake[0].x + state.moves[state.moves.length - 1].x,
  y: state.snake[0].y + state.moves[state.moves.length - 1].y
})

const nextSnake = (state: State): Snake[] => crash(state)
  ? []
  : [nextHead(state), ...state.snake]

const nextMoves = (state: State): Move[] => {
  return state.moves
}

const next = (state: State): State => ({
  ...state,
  moves: nextMoves(state),
  snake: nextSnake(state),
})

const action = (t1: number) => (t2: number): void => {
  if (t2 - t1 > SPEED) {
    state = next(state)
    draw()
    window.requestAnimationFrame(action(t2))
  } else {
    window.requestAnimationFrame(action(t1))
  }
}

const isValidMove = (state: State): boolean => {
  return true
}

const enqueue = (state: State, move: Move): State => isValidMove(state)
  ? { ...state, moves: state.moves.concat(move) }
  : state

window.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowUp': state = enqueue(state, UP); break
    case 'ArrowDown': state = enqueue(state, DOWN); break
    case 'ArrowRight': state = enqueue(state, RIGHT); break
    case 'ArrowLeft': state = enqueue(state, LEFT); break
  }
})

draw(); window.requestAnimationFrame(action(0))