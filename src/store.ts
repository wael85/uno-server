import ServerGame from './model/game/index'
import * as gameDB from './model/GameDAO';
import { WebSocket } from 'ws';


export class GameStore {
    runningGames = new Map<string, ServerGame>(); 

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
        return this.runningGames.get(gameId);
    }
    deleteGame = (gameId: string): boolean =>{
        return this.runningGames.delete(gameId);
    }
    getGameIds = (): string[] =>{
        return Array.from(this.runningGames.keys());
    }
    getGames = (): ServerGame[] =>{
        return Array.from(this.runningGames.values());
    }
    getGameCount = (): number =>{
        return this.runningGames.size;
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
        return this.getGames().filter(game => game.status === status);
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