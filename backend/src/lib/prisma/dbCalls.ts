import {
  Board,
  gameState,
  HistoryArray,
  LettersArray,
  Player,
} from "../../types/gameTypes";
import { prisma, Prisma } from "./prisma";

const asJson = (value: any): Prisma.InputJsonValue => value;

export async function saveGameToDB(game: gameState) {
  try {
    await prisma.game.upsert({
      where: { roomId: game.roomId },
      update: {
        status: game.status,
        players: asJson(game.players),
        undrawnLetters: asJson(game.undrawnLetterPool),
        passCount: game.passCount,
        emptyLetterIds: game.emptyLetterIds,
        board: asJson(game.board),
        history: asJson(game.history),
      },
      create: {
        roomId: game.roomId,
        status: game.status,
        players: asJson(game.players),
        undrawnLetters: asJson(game.undrawnLetterPool),
        passCount: game.passCount,
        emptyLetterIds: game.emptyLetterIds,
        board: asJson(game.board),
        history: asJson(game.history),
      },
    });
  } catch (error) {
    console.error(`❌ [saveGameToDB] Failed for room ${game.roomId}:`, error);
  }
}

export async function loadGameFromDB(
  roomId: string
): Promise<gameState | null> {
  try {
    const game = await prisma.game.findUnique({ where: { roomId } });
    if (!game) return null;

    return {
      status: game.status,
      players: game.players as any as Player[],
      undrawnLetterPool: game.undrawnLetters as any as LettersArray,
      roomId: game.roomId,
      passCount: game.passCount,
      emptyLetterIds: game.emptyLetterIds as any as string[],
      board: game.board as any as Board,
      history: game.history as any as HistoryArray,
    };
  } catch (error) {
    console.error(`❌ [loadGameFromDB] Failed for room ${roomId}:`, error);

    return null;
  }
}

export async function removeGameFromDB(roomId: string) {
  try {
    await prisma.game.delete({
      where: { roomId },
    });
  } catch (error: any) {
    console.error(`❌ [removeGameFromDB] Failed for room ${roomId}:`, error);
  }
}
