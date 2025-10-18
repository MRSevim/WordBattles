import {
  Board,
  GameState,
  GameStatus,
  HistoryArray,
  Lang,
  LettersArray,
  Player,
} from "../../../types/gameTypes";
import { prisma, Prisma } from "../prisma";

const asJson = (value: any): Prisma.InputJsonValue => value;

export async function saveGameToDB(game: GameState) {
  try {
    await prisma.game.upsert({
      where: { roomId: game.roomId },
      update: {
        status: game.status,
        lang: game.lang,
        players: asJson(game.players),
        undrawnLetters: asJson(game.undrawnLetterPool),
        passCount: game.passCount,
        emptyLetterIds: game.emptyLetterIds,
        board: asJson(game.board),
        history: asJson(game.history),
      },
      create: {
        roomId: game.roomId,
        lang: game.lang,
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
): Promise<GameState | null> {
  try {
    const game = await prisma.game.findUnique({ where: { roomId } });
    if (!game) return null;

    return {
      status: game.status as GameStatus,
      players: game.players as any as Player[],
      lang: game.lang as any as Lang,
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

export async function updateCurrentRoomIdInDB(
  userId: string | undefined,
  roomId: string | undefined
) {
  if (!userId) return;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { currentRoomId: roomId },
    });
  } catch (error) {
    console.error(
      `❌ [updateCurrentRoomIdInDB] Failed for user ${userId}:`,
      error
    );
  }
}

export async function loadAllGamesFromDB(): Promise<GameState[]> {
  try {
    const games = await prisma.game.findMany();

    return games.map((game) => ({
      status: game.status as GameStatus,
      lang: game.lang as any as Lang,
      players: game.players as any as Player[],
      undrawnLetterPool: game.undrawnLetters as any as LettersArray,
      roomId: game.roomId,
      passCount: game.passCount,
      emptyLetterIds: game.emptyLetterIds as any as string[],
      board: game.board as any as Board,
      history: game.history as any as HistoryArray,
    }));
  } catch (error) {
    console.error("❌ [loadAllGamesFromDB] Failed to load games:", error);
    return [];
  }
}
