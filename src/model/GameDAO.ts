import mongoose, { Schema, Document, Model } from 'mongoose';
import { Hand } from './hand/index';

// Define the Game schema
interface IGame extends Document {
  players: string[];
  targetScore: number;
  playerCount: number;
  playerScores: number[];
  handAtPlay: Hand | undefined;
  theWinner: number | undefined;
  cardsPerPlayer: number;
  dealer: number;
  status: GameStatus;
}
export type GameStatus = 'Waiting'| 'Playing'| 'Finished';
// Status: "Waiting", "Playing", "Finished"
const GameSchema: Schema = new Schema({
  status: { type: String, required: true },
  players: { type: [String], required: true },
  targetScore: { type: Number, required: false },
  playerCount: { type: Number, required: false },
  playerScores: { type: [Number], required: false },
  handAtPlay: { type: Schema.Types.Mixed, required: false },
  theWinner: { type: Number, required: false },
  cardsPerPlayer: { type: Number, required: false },
  dealer: { type: Number, required: false },
}, { collection: 'uno-game.Game' });

const Game: Model<IGame> = mongoose.model<IGame>('Game', GameSchema);

// Create a new game
async function createGame(
  status: GameStatus,
  players: string[],
  targetScore: number,
  playerCount: number,
  playerScores: number[],
  handAtPlay: Hand | undefined,
  theWinner: number | undefined,
  cardsPerPlayer: number,
  dealer: number,

): Promise<{ gameId: string, game: IGame }> {
  const game = new Game({
    status,
    players,
    targetScore,
    playerCount,
    playerScores,
    handAtPlay,
    theWinner,
    cardsPerPlayer,
    dealer,
  
  });
  const savedGame = await game.save();
  return { gameId:savedGame.id.toString(), game: savedGame };
}
async function getAllGames(): Promise<IGame[]> {
  let games =  await Game.find();
  console.log(games);
  return games;
}
// Get a game by ID
async function getGameById(gameId: string): Promise<IGame | null> {
  return await Game.findById(gameId);
}

// Update a game by ID
async function updateGame(gameId: string, updateData: Partial<IGame>): Promise<IGame | null> {
  return await Game.findByIdAndUpdate(gameId, updateData, { new: true });
}

// Delete a game by ID
async function deleteGame(gameId: string): Promise<IGame | null> {
  return await Game.findByIdAndDelete(gameId);
}

// Add a player to a game
async function addPlayer(gameId: string, player: string): Promise<IGame | null> {
  return await Game.findByIdAndUpdate(
    gameId,
    { $push: { players: player } },
    { new: true }
  );
}

// Get all user games where status is not "Finished"
async function getUserGames(username: string): Promise<IGame[]> {
  return await Game.find({ players: username, status: { $ne: 'Finished' } });
}

export { Game, IGame, createGame, getGameById, updateGame, deleteGame, addPlayer, getUserGames ,getAllGames};