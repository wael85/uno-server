import express from 'express';
import { WebSocketServer, WebSocket } from 'ws'
import * as DB from './DbAccess'
import Game  from './model/game/index'
import * as userDB from './model/UserDAO'
import * as gameDB from './model/GameDAO'
import { GameStore } from './store';
import { Color } from './interfaces/Deck';
import ServerGame from './model/game/index';


const webSocketServer = new WebSocketServer({ port: 9090, path: '/publish' },async ()=>{
    console.log('Pub/Sub server listening on 9090')
    try{
        await DB.connectToDatabase();
        console.log('Server Connected to Database')
    }catch(e){
        console.error('Failed to connect to Database')
        console.error(e)
    }
})
// type gameStat = {gameId: number, game: Game}
// type Lobby = { lobbyId: number,maxPlayers:number, score:number ,players: string[]}
type KeyData = {key: string}
type Command = { type: string } & Record<string, unknown>
type LoginData = {username: string, password: string}
type MakeMove = {key: string,action: 'DROW'|'PLAY', cardIndex?: number,color?:Color }
type Message = {topic: string, message: any}
type CreateGame = { creator: string,score: number, numberOfPlayers: number }
type JoinGame = { gameId: string, player: string }
type SayUno = { gameId: string, player: string }
interface ClientMap extends Record<string, (data: any, ws: WebSocket) => void> {
    login( data: LoginData, ws: WebSocket): void
    signup(data: LoginData, ws: WebSocket): void
    createGame(data: CreateGame, ws: WebSocket): void
    joinGame(data: JoinGame, ws: WebSocket): void
    startGame(data: KeyData, ws: WebSocket): void
    send(message: Message, ws: WebSocket): void
    makeMove(data:KeyData, ws: WebSocket): void
    cachUno( data:KeyData, ws: WebSocket): void
    sayUno(data:KeyData, ws: WebSocket): void
    close(message: any, ws: WebSocket): void
}


const clientMap = (): ClientMap => {
    const clients: Record<string, Set<WebSocket>> = {};

    const subscribers = (key: string) => {
        clients[key] ??= new Set();
        return clients[key];
    };
    const createGame = async (game: CreateGame, ws: WebSocket) => {
      try{
         
          const result = await store.createGame(game.creator, ws, game.score, game.numberOfPlayers);
          if(result.game){
              let game = result.game.getGameJson();
              game = {...game, gameId: result.gameId}
              ws.send(JSON.stringify({ topic: 'game key', message: {game} }))
           }else{
                ws.send(JSON.stringify({ topic: 'createGame', message: 'Fail' }));
            }

      }catch(e){    
        console.error(e);
        ws.send(JSON.stringify({ topic: 'createGame', message: 'Fail' }));
      }
    }
    const joinGame = (data: JoinGame, ws: WebSocket) =>{
        try{
            const game = store.getGame(data.gameId);
            if(game){
                game.join(data.player, ws);
                const players = game.players;
                const sockets = game.playersSocket;
                sockets.forEach(pws => {
                    pws.send(JSON.stringify({ topic: 'joinGame', message: {players} }));
                });
            }else{
                ws.send(JSON.stringify({ topic: 'joinGame', message: 'Fail' }));
            }
        }catch(e){
            console.error(e);
            ws.send(JSON.stringify({ topic: 'joinGame', message: 'Fail' }));
        }
    }
    const login = async (data: LoginData, ws: WebSocket) => {
        try{
            const user =await DB.login(data.username, data.password);
            if(user){
                ws.send(JSON.stringify({ topic: 'login', message: 'Success' }));
                return;
            }else{
                ws.send(JSON.stringify({ topic: 'login', message: 'Fail , UserName Or Password is not correct' }));
                return;
            }
        }catch(e){
            console.error(e);
            ws.send(JSON.stringify({ topic: 'login', message: 'Fail' }));
            return;
        }
    };
    const signup = async (data: LoginData, ws: WebSocket) => {
        // Add user to db
        console.log(data)
        try{
            const user = await userDB.createUser(data.username, data.password);
            if(user){
                ws.send(JSON.stringify({ topic: 'signup', message: user}));
                return;
            }
        }catch(e){  
            console.error(e);
            ws.send(JSON.stringify({ topic: 'signup', message: 'Fail' }));
            return;
        }
   
    };
    const startGame = (key: KeyData, ws: WebSocket) => {
        const game = store.getGame(key.key);
        if(game){
            game.start();
            store.saveGame(key.key);
            const result = game.getGameJson();
            const sockets = game.playersSocket;
            sockets.forEach(pws => {
                pws.send(JSON.stringify({ topic: 'startGame', message: {result} }));
            });
        }else{
            ws.send(JSON.stringify({ topic: 'startGame', message: 'Fail' }));
        }
    };
   
    const send = ({ topic, message }: { topic: string, message: {} }, _: WebSocket) => {
        // for (let ws of subscribers(topic))
        //     if (ws.readyState === WebSocket.OPEN)
        //         ws.send(JSON.stringify({ topic, message }));
    };

    const makeMove = (makeMove: MakeMove, ws: WebSocket) => {
        let result: any;
        if(makeMove.action === 'DROW'){
            result = store.getGame(makeMove.key)?.handAtPlay?.draw();

        }else if(makeMove.action === 'PLAY'){
            result = store.playCard(makeMove.key, makeMove.cardIndex?? -1, makeMove.color);
            if(result.type === 'Error' || result.type === 'Exception'){
            ws.send(JSON.stringify(result));
            return;
            }else{
                 if ('status' in result && result.status === 'Finished'){
                    const sockets = store.getGamePlayersSocket(makeMove.key);
                    const theWinner = result.theWinner;
                    sockets?.forEach(pws => pws.send(JSON.stringify({ topic: 'gameOver', message: {theWinner} })));
                 }else{
                    const sockets = store.getGamePlayersSocket(makeMove.key);
                    const resultJson = result.getGameJson();
                    sockets?.forEach(pws => pws.send(JSON.stringify({ topic: 'gameState', message: {resultJson} })));
                 }
            }
        }
    }

    const cachUno = ({ key }: KeyData, ws: WebSocket) => {
    };

    const sayUno = ({ key }: KeyData, ws: WebSocket) => {
    };

    const close = (_: unknown, ws: WebSocket) => {
        if (ws.readyState === WebSocket.OPEN){
            ws.close();
           //We need to remove the player from the game
        }
       
    };

    return { send, login, signup, makeMove, cachUno, sayUno, close ,createGame ,joinGame, startGame};
};
const store = new GameStore();
const clients = clientMap();



/**
 * After the server is created, we listen for new connections.
 * To join Looby send  {  "type": "subscribe",  "key": "15", "userName": "user1" }
 */

webSocketServer.on('connection', (ws, req) => {
    ws.on('message', message => {
        try {
            const { type, ...params } = JSON.parse(message.toString()) as Command;
            if (clients[type] !== undefined) {
                clients[type](params, ws);
            } else {
                console.error(`Incorrect message: '${message}' from ${req.socket.remoteAddress} (${req.socket.remoteFamily})`);
            }
        } catch (e) {
            console.error(e);
        }
    });
    ws.on('close', () => clients.close({}, ws));
});
