import type { Card, Color, Deck } from '../../interfaces/Deck'
import type { EventFunction, HandInterface } from '../../interfaces/Hand'
import type { Shuffler } from '../../utils/random_utils'
import { Deck } from '../deck/index'

export class Hand implements HandInterface {
  playerCount: number
  dealer: number
  shuffler: Shuffler<Card>
  cardsPerPlayer?: number
  players: string[]
  playerHands: Card[][] = []
  deck: Deck
  discardPile: Card[] = []
  turn: number
  direction: 'left' | 'right'
  currentColor: Color
  theWinner: number | undefined = undefined
  shouldSayUno: boolean[] = []
  callbacks: EventFunction[] = []
  ended: boolean = false

  constructor(players: string[], dealer: number, shuffler: Shuffler<Card>, cardsPerPlayer: number) {
    if (players.length < 2) {
      throw new Error('You must be at least 2 players to play!')
    }
    if (players.length > 10) {
      throw new Error('You must be less than 10 players to play!')
    }
    this.playerCount = players.length
    this.players = players
    this.dealer = dealer
    this.turn = dealer
    this.shuffler = shuffler
    this.cardsPerPlayer = cardsPerPlayer
    this.direction = 'left'
    this.deck = new Deck()
    this.deck.shuffle(shuffler)
    for (const player of players) {
      const playerHand = []
      for (let i = 0; i < cardsPerPlayer; i++) {
        const cardToGive = this.deck.deal()
        //because we are limiting players to 10, we know that it will never be undefined
        if (cardToGive != undefined) {
          playerHand.push(cardToGive)
        }
      }
      this.playerHands.push(playerHand)
      this.shouldSayUno.push(false)
    }
    const cardToStart = this.deck.deal()
    //because we are limiting players to 10, we know that it will never be undefined
    if (cardToStart != undefined) {
      this.discardPile.push(cardToStart)
    }
    //if the card is a wild card put it back in the deck and reshuffle
    while (this.discardPile[0].type === 'WILD' || this.discardPile[0].type === 'DRAW4') {
      const wildCard = this.discardPile.pop()
      //we know is not undefined because we just put it there
      if (wildCard != undefined) {
        this.deck.deck.push(wildCard)
      }
      this.deck.shuffle(shuffler)
      const cardToStart = this.deck.deal()
      if (cardToStart != undefined) {
        this.discardPile.push(cardToStart)
      }
    }
    this.currentColor = this.discardPile[0].color
    if (this.discardPile[0].type === 'SKIP') {
      this.nextTurn()
    }
    if (this.discardPile[0].type === 'REVERSE') {
      this.reverseDirecction()
    }

    this.nextTurn()

    if (this.discardPile[0].type === 'DRAW2') {
      for (let i = 0; i < 2; i++) {
        this.drawBecauseOfCard()
      }
      this.nextTurn()
    }
  }

  nextTurn() {
    this.hasEnded()
    for (let i = 0; i < this.players.length; i++) {
      if (this.playerHands[i].length === 1) {
        this.shouldSayUno[i] = true
      }
    }

    if (this.direction === 'left') {
      this.turn = this.turn + 1 > this.players.length - 1 ? 0 : this.turn + 1
    }
    if (this.direction === 'right') {
      this.turn = this.turn === 0 ? this.players.length - 1 : this.turn - 1
    }
  }

  reverseDirecction() {
    this.direction = this.direction === 'left' ? 'right' : 'left'
  }

  player(player: number) {
    if (player < 0 || player >= this.players.length) {
      throw new Error('Invalid index')
    }
    return this.players[player]
  }

  playerHand(player: number) {
    if (player < 0 || player >= this.players.length) {
      throw new Error('Invalid index')
    }
    return this.playerHands[player]
  }

  drawPile() {
    return this.deck
  }

  playerInTurn() {
    return this.turn
  }

  play: (cardInPlayerHand: number, color?: Color) => Card = (
    cardInPlayerHand: number,
    color?: Color
  ) => {
    if (this.hasEnded()) {
      throw new Error("The hand is finished you can't play")
    }
    const playerHand = this.playerHands[this.playerInTurn()]
    const playingCard = playerHand[cardInPlayerHand]
    if (playingCard.color !== 'all' && color !== undefined) {
      throw new Error("Can't choose a color")
    }
    if (this.canPlay(cardInPlayerHand)) {
      this.playerHands[this.playerInTurn()].splice(cardInPlayerHand, 1)
      this.discardPile.push(playingCard)
      if (playingCard.type === 'SKIP') {
        this.nextTurn()
      }
      if (playingCard.type === 'REVERSE') {
        this.playerCount === 2 ? this.nextTurn() : this.reverseDirecction()
      }
      if (playingCard.type === 'DRAW2') {
        this.nextTurn()
        for (let i = 0; i < 2; i++) {
          this.drawBecauseOfCard()
        }
      }
      if (playingCard.color !== 'all') {
        this.currentColor = playingCard.color
      }
      if (playingCard.type === 'WILD') {
        if (color) {
          this.currentColor = color
        } else {
          throw new Error('You need to choose a color')
        }
      }
      if (playingCard.type === 'DRAW4') {
        if (color) {
          this.currentColor = color
        } else {
          throw new Error('You need to choose a color')
        }
        this.nextTurn()
        for (let i = 0; i < 4; i++) {
          this.drawBecauseOfCard()
        }
      }
      this.nextTurn()
      return playingCard
    } else {
      throw new Error('Illegal play')
    }
  }

  canPlay: (cardInPlayerHand: number) => boolean = (cardInPlayerHand: number) => {
    if (this.hasEnded()) {
      return false
    }
    const cardInDiscard = this.discardPile[this.discardPile.length - 1]
    const playerHand = this.playerHands[this.playerInTurn()]
    if (cardInPlayerHand < 0 || cardInPlayerHand > playerHand.length - 1) {
      return false
    }

    const playingCard = playerHand[cardInPlayerHand]
    if (playingCard.color === this.currentColor) {
      return true
    }
    if (playingCard.color === 'all') {
      return true
    }
    if (cardInDiscard.type === 'NUMBERED') {
      if (playingCard.type === 'NUMBERED') {
        if (playingCard.value === cardInDiscard.value) {
          return true
        }
      }
    }
    if (cardInDiscard.type === 'REVERSE') {
      if (playingCard.type === 'REVERSE') {
        return true
      }
    }
    if (cardInDiscard.type === 'SKIP') {
      if (playingCard.type === 'SKIP') {
        return true
      }
    }
    if (cardInDiscard.type === 'DRAW2') {
      if (playingCard.type === 'DRAW2') {
        return true
      }
    }
    return false
  }

  canPlayAny() {
    if (this.hasEnded()) {
      return false
    }
    const playerHand = this.playerHands[this.playerInTurn()]
    for (let i = 0; i < playerHand.length; i++) {
      if (this.canPlay(i) === true) {
        return true
      }
    }
    return false
  }

  drawCard(player: number) {
    const cardToDraw = this.deck.deal()
    if (cardToDraw != undefined) {
      this.playerHands[player].push(cardToDraw)
    }
    if (this.deck.deck.length === 0) {
      const cardToRetain = this.discardPile.pop()
      this.deck.deck = this.discardPile
      if (this.shuffler) {
        this.deck.shuffle(this.shuffler)
      }
      if (cardToRetain) {
        this.discardPile = [cardToRetain]
      }
    }
    return cardToDraw
  }

  draw() {
    if (this.hasEnded()) {
      throw new Error("The hand is finished you can't draw")
    }
    const cardToDraw = this.drawCard(this.playerInTurn())
    if (!this.canPlay(this.playerHands[this.turn].length - 1)) {
      this.nextTurn()
    }
    return cardToDraw
  }

  drawBecauseOfCard() {
    this.drawCard(this.playerInTurn())
  }

  sayUno(player: number) {
    if (this.hasEnded()) {
      throw new Error("The hand is finished you can't say uno")
    }
    if (player < 0 || player >= this.players.length) {
      throw new Error('Invalid index')
    }
    if (this.shouldSayUno[player] === true) {
      this.shouldSayUno[player] = false
    }
  }

  catchUnoFailure(accusation: { accused: number; accuser: number }) {
    if (this.hasEnded()) {
      throw new Error("The hand is finished you can't catch uno")
    }
    if (
      accusation.accused < 0 ||
      accusation.accused >= this.players.length ||
      accusation.accuser < 0 ||
      accusation.accuser >= this.players.length
    ) {
      throw new Error('Invalid index')
    }
    if (this.shouldSayUno[accusation.accused] === true) {
      for (let i = 0; i < 4; i++) {
        this.drawCard(accusation.accused)
      }
      this.shouldSayUno[accusation.accused] = false
      return true
    } else {
      for (let i = 0; i < 4; i++) {
        this.drawCard(accusation.accuser)
      }
    }
    return false
  }

  hasEnded = () => {
    for (let i = 0; i < this.playerHands.length; i++) {
      if (this.playerHands[i].length === 0) {
        this.ended = true
        this.theWinner = i
        const event = new CustomEvent(`Winner: ${i}, Score: ${this.score()}`)
        for (let i = 0; i < this.callbacks.length; i++) {
          const myfunction = this.callbacks[i]
          myfunction(event)
        }
        this.callbacks = []
        return true
      }
    }
    return false
  }

  winner() {
    return this.theWinner
  }

  score() {
    let score: number = 0
    if (this.ended === true) {
      for (let i = 0; i < this.playerCount; i++) {
        for (let j = 0; j < this.playerHand(i).length; j++) {
          score += this.playerHand(i)[j].value
        }
      }
    }
    return score
  }

  onEnd(callback: (e: Event) => void) {
    this.callbacks.push(callback)
  }
}
