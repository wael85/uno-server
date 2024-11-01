import { Hand } from '../model/hand'

export interface GameInterface {
  players: string[]
  targetScore: number
  playerCount: number
  playerScores: number[]
  player: (player: number) => string
  score: (player: number) => number
  winner: () => number | undefined
  handAtPlay: Hand | undefined
  currentHand: () => Hand | undefined
}
