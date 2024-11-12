import express from 'express';
import { WebSocketServer, WebSocket } from 'ws'
import * as DB from './DbAccess'
import Game, { GameLooby }  from './model/game/index'
import * as userDB from './model/UserDAO'
import * as gameDB from './model/GameDAO'


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
type LoginData = {username: string, password: string}
type MakeMove = {key: string, message: any}
type Message = {topic: string, message: any}
type CreateGame = { looby: GameLooby}
interface ClientMap extends Record<string, (data: any, ws: WebSocket) => void> {
    login( data: LoginData, ws: WebSocket): void
    signup(data: LoginData, ws: WebSocket): void
    createGame(data: CreateGame, ws: WebSocket): void
    subscribe(data: KeyData, ws: WebSocket): void
    unsubscribe(data: KeyData, ws: WebSocket): void
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
          var newGame = await gameDB.createGame('Waiting',game.looby.players.map(x=>x.userName),500,0,[],undefined,undefined,7,0)
          //subscribers(newGame{_id}).add(ws);
          ws.send(JSON.stringify({ topic: 'game key', message: newGame}))

      }catch(e){    
        console.error(e);
        ws.send(JSON.stringify({ topic: 'createGame', message: 'Fail' }));
      }
        
   
    }
    const subscribe = async ({ key }: KeyData, ws: WebSocket) => {
        if(key ==="New Game"){
           var game = await gameDB.createGame('Waiting',[],500,0,[],undefined,undefined,7,0)
        }
        subscribers(key).add(ws);
        ws.send(JSON.stringify({ topic: 'game key', message: key }))
    }


    const unsubscribe = ({ key }: KeyData, ws: WebSocket) => subscribers(key).delete(ws);

    const send = ({ topic, message }: { topic: string, message: {} }, _: WebSocket) => {
        for (let ws of subscribers(topic))
            if (ws.readyState === WebSocket.OPEN)
                ws.send(JSON.stringify({ topic, message }));
    };

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
    const startGame = (makeMove: MakeMove, ws: WebSocket) => {
        subscribers(makeMove.key).forEach(connectedPlayer => {
            if (connectedPlayer.readyState === WebSocket.OPEN) {
                connectedPlayer.send(JSON.stringify({ topic: 'makeMove', message: makeMove.message }));
            }
        });
    };
    const makeMove = (makeMove: MakeMove, ws: WebSocket) => {
        subscribers(makeMove.key).forEach(connectedPlayer => {
            if (connectedPlayer.readyState === WebSocket.OPEN) {
                connectedPlayer.send(JSON.stringify({ topic: 'makeMove', message: makeMove.message }));
            }
        });
    };

    const cachUno = ({ key }: KeyData, ws: WebSocket) => {
        subscribers(key).add(ws);
    };

    const sayUno = ({ key }: KeyData, ws: WebSocket) => {
        subscribers(key).add(ws);
    };

    const close = (_: unknown, ws: WebSocket) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.close();
        for (let k in clients)
            clients[k].delete(ws);
    };

    return { subscribe, unsubscribe, send, login, signup, makeMove, cachUno, sayUno, close ,createGame};
};

const clients = clientMap();

type Command = { type: string } & Record<string, unknown>


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
