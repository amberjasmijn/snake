export type Direction = "right" | "left" | "up" | "down"
export type Snake = { x: number; y: number }
export type Move = { x: number; y: number }
export type Position = { x: number; y: number }

export interface GameState {
  cols: number
  rows: number
  snake: Snake[]
  moves: Move[]
  apple: Position
}