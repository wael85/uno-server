import Game, { GameLooby} from './model/game/index'


export class GameStore {
    runningGames = new Map<string, Game>(); 
    loobies = new Map<string, GameLooby>();

    // Add a game to the running games
    StartGame(gameId: string): void {
        const looby = this.getLobby(gameId)
        const game = looby?.startGame()
        if(game) this.runningGames.set(gameId, game);
    }

    // Remove a game from the running games
    removeGame(gameId: string): boolean {
        return this.runningGames.delete(gameId);
    }

    // Get a game from the running games
    getGame(gameId: string): Game | undefined {
        return this.runningGames.get(gameId);
    }

    // Add a lobby to the lobbies
    addLobby(lobbyId: string, lobby: GameLooby): void {
        this.loobies.set(lobbyId, lobby);
    }

    // Remove a lobby from the lobbies
    removeLobby(lobbyId: string): boolean {
        return this.loobies.delete(lobbyId);
    }

    // Get a lobby from the lobbies
    getLobby(lobbyId: string): GameLooby | undefined {
        return this.loobies.get(lobbyId);
    }

    // List all running games
    listRunningGames(): Map<string, Game> {
        return this.runningGames;
    }

    // List all lobbies
    listLobbies(): Map<string, GameLooby> {
        return this.loobies;
    }
}