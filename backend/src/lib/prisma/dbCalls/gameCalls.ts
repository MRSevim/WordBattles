import {
  Board,
  EndReason,
  GameState,
  GameStatus,
  HistoryArray,
  LettersArray,
  Player,
} from "../../../types/gameTypes";
import { Lang } from "../../../types/types";
import { prisma, Prisma, Game as PrismaGame } from "../prisma";

const asJson = (value: any): Prisma.InputJsonValue => value;

export async function saveGameToDB(game: GameState) {
  try {
    await prisma.game.upsert({
      where: { roomId: game.roomId },
      update: fromGameState(game),
      create: {
        roomId: game.roomId,
        ...fromGameState(game),
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

    return toGameState(game);
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
      data: { currentRoomId: roomId ?? null },
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

    return games.map((game) => toGameState(game));
  } catch (error) {
    console.error("❌ [loadAllGamesFromDB] Failed to load games:", error);
    return [];
  }
}

const toGameState = (game: PrismaGame): GameState => {
  return {
    status: game.status as GameStatus,
    lang: game.lang as any as Lang,
    players: game.players as any as Player[],
    undrawnLetterPool: game.undrawnLetters as any as LettersArray,
    roomId: game.roomId,
    emptyLetterIds: game.emptyLetterIds as any as string[],
    board: game.board as any as Board,
    history: game.history as any as HistoryArray,
    winnerId: game.winnerId || undefined,
    endReason: game.endReason as EndReason,
    endingPlayerId: game.endingPlayerId || undefined,
    pointDiffAppliedToRanked: game.pointDiffAppliedToRanked,
  };
};

const fromGameState = (game: GameState) => {
  return {
    lang: game.lang,
    status: game.status,
    players: asJson(game.players),
    undrawnLetters: asJson(game.undrawnLetterPool),
    emptyLetterIds: game.emptyLetterIds,
    board: asJson(game.board),
    history: asJson(game.history),
    winnerId: game.winnerId,
    endReason: game.endReason,
    endingPlayerId: game.endingPlayerId,
    pointDiffAppliedToRanked: game.pointDiffAppliedToRanked,
  };
};
