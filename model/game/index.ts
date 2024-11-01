import type { Card } from '../../interfaces/Deck'
import type { GameInterface } from '../../interfaces/Uno'
import type { Randomizer, Shuffler } from '../../utils/random_utils'
import { standardRandomizer, standardShuffler } from '../../utils/random_utils'
import { Hand } from '../hand/index'

export default class Game implements GameInterface {
  players: string[]
  targetScore: number
  playerCount: number
  playerScores: number[] = []
  handAtPlay: Hand | undefined
  theWinner: number | undefined = undefined
  randomizer: Randomizer
  shuffler: Shuffler<Card>
  cardsPerPlayer: number
  dealer: number

  constructor(
    players: string[] = ['A', 'B'],
    targetScore: number = 500,
    randomizer: Randomizer = standardRandomizer,
    shuffler: Shuffler<Card> = standardShuffler,
    cardsPerPlayer: number = 7
  ) {
    if (players.length < 2) {
      throw new Error('You must be at least 2 players to play!')
    }
    if (players.length > 10) {
      throw new Error('You must be less than 10 players to play!')
    }
    if (targetScore <= 0) {
      throw new Error('Target score must be bigger than 0!')
    }
    this.players = players
    this.randomizer = randomizer
    this.shuffler = shuffler
    this.cardsPerPlayer = cardsPerPlayer
    this.targetScore = targetScore
    this.playerCount = players.length
    for (let i = 0; i < players.length; i++) {
      this.playerScores.push(0)
    }
    this.dealer = players.length - 1
    this.handAtPlay = new Hand(players, this.dealer, shuffler, cardsPerPlayer)
  }

  player(player: number) {
    if (player < 0 || player >= this.players.length) {
      throw new Error('Invalid index')
    }
    return this.players[player]
  }

  score(player: number) {
    return this.playerScores[player]
  }

  winner() {
    return this.theWinner
  }

  currentHand() {
    return this.handAtPlay
  }

  checkEndOfHand() {
    if (this.handAtPlay!.hasEnded()) {
      const handWinner = this.handAtPlay!.winner()
      if (handWinner !== undefined) {
        this.playerScores[handWinner] += this.handAtPlay!.score()
      }
      for (let i = 0; i < this.players.length; i++) {
        if (this.playerScores[i] >= this.targetScore) {
          this.theWinner = i
          this.handAtPlay = undefined
          return
        }
      }
      if (this.theWinner === undefined) {
        this.handAtPlay = new Hand(this.players, this.dealer, this.shuffler, this.cardsPerPlayer)
      } else {
        this.handAtPlay = undefined
      }
    }
  }
}
