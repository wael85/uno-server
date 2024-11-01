import type { Deck } from '../model/deck'
import type { Shuffler } from '../utils/random_utils'
import type { Card, Color } from './Deck'

export type EventFunction = (e: Event) => void

export interface HandInterface {
  playerCount: number
  players: string[]
  playerHands: Card[][]
  dealer: number
  shuffler?: Shuffler<Card>
  cardsPerPlayer?: number
  player: (player: number) => string
  playerHand: (player: number) => Card[]
  deck: Deck
  discardPile: Card[]
  drawPile: () => Deck
  turn: number
  playerInTurn: () => number
  direction: 'left' | 'right'
  play: (cardInPlayerHand: number, color?: Color) => Card
  canPlay: (cardInPlayerHand: number) => boolean
  canPlayAny: () => boolean
  currentColor: Color
  draw: () => Card | undefined
  sayUno: (player: number) => void
  catchUnoFailure: (accusation: { accused: number; accuser: number }) => boolean
  hasEnded: () => boolean
  winner: () => number | undefined
  score: () => number
  onEnd: (callback: EventFunction) => void
  shouldSayUno: boolean[]
}
