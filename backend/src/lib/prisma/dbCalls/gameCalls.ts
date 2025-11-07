import {
  Board,
  EndReason,
  GameState,
  GameStatus,
  HistoryArray,
  LettersArray,
  Player,
  Lang,
  GameType,
  Season,
} from "../../../types/gameTypes";
import { prisma, Prisma, Game as PrismaGame } from "../prisma";

const asJson = (value: any): Prisma.InputJsonValue => value;

export async function saveGameToDB(game: GameState) {
  try {
    const dbGame = await prisma.game.upsert({
      where: { roomId: game.roomId },
      update: fromGameState(game),
      create: {
        roomId: game.roomId,
        ...fromGameState(game),
      },
    });

    // Filter only players who are logged in (have email)
    const loggedInPlayers = game.players.filter((p) => p.email);

    // Upsert GamePlayer entries for logged-in users
    await Promise.all(
      loggedInPlayers.map(async (player) => {
        const user = await prisma.user.findUnique({
          where: { email: player.email },
        });
        if (!user) return;
        await prisma.gamePlayer.upsert({
          where: {
            gameId_userId: {
              gameId: dbGame.id,
              userId: user.id,
            },
          },
          create: {
            gameId: dbGame.id,
            userId: user.id,
          },
          update: {}, // no additional updates for now
        });
      })
    );
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
    undrawnLetterPool: game.undrawnLetterPool as any as LettersArray,
    roomId: game.roomId,
    emptyLetterIds: game.emptyLetterIds as any as string[],
    board: game.board as any as Board,
    history: game.history as any as HistoryArray,
    winnerId: game.winnerId || undefined,
    endReason: game.endReason as EndReason,
    endingPlayerId: game.endingPlayerId || undefined,
    type: game.type as GameType,
    season: game.season as Season,
  };
};

const fromGameState = (game: GameState) => {
  return {
    lang: game.lang,
    status: game.status,
    players: asJson(game.players),
    undrawnLetterPool: asJson(game.undrawnLetterPool),
    emptyLetterIds: game.emptyLetterIds,
    board: asJson(game.board),
    history: asJson(game.history),
    winnerId: game.winnerId,
    endReason: game.endReason,
    endingPlayerId: game.endingPlayerId,
    type: game.type,
    season: game.season,
  };
};
