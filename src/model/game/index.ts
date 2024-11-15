import type { Card } from '../../interfaces/Deck'
import type { GameInterface } from '../../interfaces/Uno'
import type { Randomizer, Shuffler } from '../../utils/random_utils'
import { standardRandomizer, standardShuffler } from '../../utils/random_utils'
import { GameStatus } from '../GameDAO'
import { Hand } from '../hand/index'
import { WebSocket } from 'ws'

export default class ServerGame implements GameInterface {
  gameId: string | undefined
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
  playersSocket: WebSocket[] = []
  status: GameStatus = 'Waiting'

  constructor(
    creator: string,
    creatorSocket: WebSocket,
    targetScore: number = 500,
    numberOfPlayers: number = 4,
    randomizer: Randomizer = standardRandomizer,
    shuffler: Shuffler<Card> = standardShuffler,
    cardsPerPlayer: number = 7
  ) {
    this.players = [creator]
    this.playersSocket = [creatorSocket]
    if (targetScore <= 0) {
      throw new Error('Target score must be bigger than 0!')
    }
    this.randomizer = randomizer
    this.shuffler = shuffler
    this.cardsPerPlayer = cardsPerPlayer
    this.targetScore = targetScore
    this.playerCount = numberOfPlayers
    this.playerScores = [0]
    this.dealer = numberOfPlayers - 1
   
  }
  join(player: string, playerSocket: WebSocket) {
    if (this.players.length >= this.playerCount) {
      throw new Error('Game is full')
    }
    this.players.push(player)
    this.playersSocket.push(playerSocket)
    this.playerScores.push(0)
  }
  start() {
    if(this.status === 'Playing'){
      throw new Error('Game is already playing')
    }
    if(this.status === 'Finished'){
      throw new Error('Game is already finished')
    }
    if(this.handAtPlay === undefined){
     this.handAtPlay = new Hand(this.players, this.dealer, this.shuffler, this.cardsPerPlayer) 
     this.status = 'Playing'
    }
  }
  getGameJson(){
    return {
      gameId: this.gameId,
      players: this.players,
      targetScore: this.targetScore,
      playerCount: this.playerCount,
      playerScores: this.playerScores,
      handAtPlay: this.handAtPlay,
      theWinner: this.theWinner,
      cardsPerPlayer: this.cardsPerPlayer,
      dealer: this.dealer,
      status: this.status
    }
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