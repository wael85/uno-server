import type { Shuffler } from '../utils/random_utils'
import type { SpecialCard, NormalCard } from './Cards'

export type Card = SpecialCard | NormalCard
export type Color = NormalCard['color']
export type Type = Card['type']
export const colors: Array<Color> = ['BLUE', 'RED', 'YELLOW', 'GREEN'] as const

export default interface DeckInterface {
  deck: Array<Card>
  shuffle: (shuffler: Shuffler<Card>) => void
  deal: () => Card | undefined
}
