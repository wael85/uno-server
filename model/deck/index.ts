import type {
  validColors,
  SpecialCard,
  SkipCard,
  ReverseCard,
  Draw2Card,
  WildCard,
  Draw4Card,
  NormalCard
} from '../../interfaces/Cards'
import type { Card } from '../../interfaces/Deck'
import { colors } from '../../interfaces/Deck'
import type DeckInterface from '../../interfaces/Deck'
import type { Shuffler } from '../../utils/random_utils'

export class Deck implements DeckInterface {
  deck: Card[] = createInitialDeck()

  shuffle(shuffler: Shuffler<Card>) {
    shuffler(this.deck)
  }

  deal() {
    if (this.deck.length >= 1) {
      return this.deck.shift()
    }
  }
}

const buildColorCards: () => Array<NormalCard> = () => {
  const colors: Array<validColors> = ['BLUE', 'RED', 'YELLOW', 'GREEN']
  const cards: Array<NormalCard> = []
  for (const color of colors) {
    for (let i = 0; i < 19; i++) {
      const card: NormalCard = {
        type: 'NUMBERED',
        color: color,
        value: i > 9 ? i - 9 : i
      }
      cards.push(card)
    }
  }
  return cards
}

const buildSpecialCards: () => Array<SpecialCard> = () => {
  const cards: Array<SpecialCard> = []
  for (const color of colors) {
    for (let i = 0; i < 2; i++) {
      const skipcard: SkipCard = {
        type: 'SKIP',
        color: color,
        value: 20
      }
      const reversecard: ReverseCard = {
        type: 'REVERSE',
        color: color,
        value: 20
      }
      const draw2card: Draw2Card = {
        type: 'DRAW2',
        color: color,
        value: 20
      }

      cards.push(skipcard)
      cards.push(reversecard)
      cards.push(draw2card)
    }
    const wildCard: WildCard = {
      type: 'WILD',
      color: 'all',
      value: 50
    }
    const draw4Card: Draw4Card = {
      type: 'DRAW4',
      color: 'all',
      value: 50
    }
    cards.push(wildCard)
    cards.push(draw4Card)
  }
  return cards
}

export const createInitialDeck: () => Card[] = () => {
  const normalCards = buildColorCards()
  const specialCards = buildSpecialCards()
  return [...normalCards, ...specialCards]
}
