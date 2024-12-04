import { Color } from './interfaces/Deck';
import ServerGame from './model/game/index'
import * as gameDB from './model/GameDAO';
import { WebSocket } from 'ws';

export type Error = {type: "Error"| "Exception", message: any};
export class GameStore {
    runningGames = new Map<string, ServerGame>(); 
    constructor(){
        this.init();
    }
    init = async () => {
        try{
            const games = await gameDB.getAllGames();
            for(let game of games){
                const serverGame = new ServerGame(game.players[0], new WebSocket(''), game.targetScore, game.playerCount);
                serverGame.gameId = game.id;
                serverGame.players = game.players;
                serverGame.playerScores = game.playerScores;
                serverGame.handAtPlay = game.handAtPlay;
                serverGame.theWinner = game.theWinner;
                serverGame.cardsPerPlayer = game.cardsPerPlayer;
                serverGame.dealer = game.dealer;
                serverGame.status = game.status;
                this.runningGames.set(game.id, serverGame);
            }
        }catch(e){
            console.error(e);
    }
}
    createGame = async (creator: string, creatorSocket:WebSocket, score: number, numberOfPlayers: number): Promise<{game:ServerGame | undefined,gameId:string}> =>{
        try{
            const newGame = await gameDB.createGame('Waiting',[],score,numberOfPlayers,[],undefined,undefined,7,0);
            const serverGame = new ServerGame(creator, creatorSocket, score, numberOfPlayers);
            if(newGame){
                this.runningGames.set(newGame.gameId, serverGame);
                return {game:serverGame,gameId:newGame.gameId};
            }
            return {game:serverGame,gameId:''};
        }catch(e){
            console.error(e);
            return {game:undefined,gameId:''};
        }
    }
    getGame = (gameId: string): ServerGame | undefined =>{
        console.log(this.runningGames);
        return this.runningGames.get(gameId);
    }
    deleteGame = (gameId: string): boolean =>{
        return this.runningGames.delete(gameId);
    }
    getGamePlayersSocket = (gameId: string): WebSocket[] | undefined =>{
        const game = this.getGame(gameId);
        if(game){
            return game.playersSocket;
        }
        return undefined;
    }
    getGamePlayers = (gameId: string): string[] | undefined =>{
        const game = this.getGame(gameId);
        if(game){
            return game.players;
        }
        return undefined;
    }
    playCard = (gameId: string, cardIndex: number,color?:Color): ServerGame | Error =>{
        try{
            const game = this.getGame(gameId);
            
            if(game && game.status === 'Playing'){
                if(cardIndex < 0 ) throw new Error('Invalid card index: -1');
                game.handAtPlay?.play(cardIndex,color)
                return game;
            }
            return {type:'Error',message:'Game not found or not playing'}
        }catch(e){
            console.error(e);
            return {type:'Exception',message: {e}};
        }

    }

    draw = (gameId: string,): ServerGame | Error =>{
        try{
            const game = this.getGame(gameId);
            
            if(game && game.status === 'Playing'){
                
                game.handAtPlay?.draw()
                return game;
            }
            return {type:'Error',message:'Game not found or not playing'}
        }catch(e){
            console.error(e);
            return {type:'Exception',message: {e}};
        }

    }
    

    getGameByPlayer = (player: string): ServerGame | undefined =>{
        for(let game of this.runningGames.values()){
            if(game.players.includes(player)){
                return game;
            }
        }
        return undefined;
    }
    getGameByPlayerSocket = (playerSocket: WebSocket): ServerGame | undefined =>{
        for(let game of this.runningGames.values()){
            if(game.playersSocket.includes(playerSocket)){
                return game;
            }
        }
        return undefined;
    }
    getGamesByStatus = (status: string): ServerGame[] =>{
        const games: ServerGame[] = [];
        for(let game of this.runningGames.values()){
            if(game.status === status){
                games.push(game);}
            }
        return games;
    }
    joinGame = (gameId: string, player: string, playerSocket: WebSocket): boolean =>{
        try{
            const game = this.getGame(gameId);
            if(game){
                game.join(player, playerSocket);
                return true;
            }
            return false;
        }catch(e){
            console.error(e);
            return false;
        }   
    }
    saveGame = async (gameId: string): Promise<boolean> =>{
        try{
            const game = this.getGame(gameId);
            const gameData = game?.getGameJson();
            if(game){
                await gameDB.updateGame(gameId,{...gameData});
                return true;
            }
            return false;
        }catch(e){
            console.error(e);
            return false;
        }
    }
}