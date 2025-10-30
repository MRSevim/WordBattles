import { prisma } from "../prisma";
import { GameState, Player } from "../../../types/gameTypes";

export async function applyPlayerStats(game: GameState) {
  const everyoneIsUser = game.players.every((player) => player.email);
  const isRanked = game.type === "ranked";
  if (
    !isRanked ||
    game.status !== "ended" ||
    !game.players?.length ||
    !everyoneIsUser
  )
    return;

  const winnerId = game.winnerId;
  const season = game.season;
  const lang = game.lang;
  const isTie =
    game.players.length === 2 &&
    game.players[0].points === game.players[1].points;

  try {
    // Prepare an array of promises for updating/creating stats
    const updatePromises = game.players.map(async (player) => {
      if (!player.id) return;

      const isWinner = !isTie && player.id === winnerId;
      const isLoser = !isTie && player.id !== winnerId;

      // Load existing stats for this user/lang/season
      const existing = await prisma.playerStats.findUnique({
        where: {
          userId_lang_season: {
            userId: player.id,
            lang,
            season,
          },
        },
      });

      const updatedStats = calculateUpdatedStats(
        existing,
        player,
        isWinner,
        isLoser,
        isTie
      );

      if (existing) {
        return prisma.playerStats.update({
          where: {
            userId_lang_season: {
              userId: player.id,
              lang,
              season,
            },
          },
          data: updatedStats,
        });
      } else {
        return prisma.playerStats.create({
          data: {
            userId: player.id,
            lang,
            season,
            ...updatedStats,
          },
        });
      }
    });

    // Run all updates in parallel
    await Promise.all(updatePromises);
  } catch (error) {
    console.error(
      `❌ [applyPlayerStats] Failed for room ${game.roomId}:`,
      error
    );
  }
}

function calculateUpdatedStats(
  existing: any,
  player: Player,
  isWinner: boolean,
  isLoser: boolean,
  isTie: boolean
) {
  // Start from existing or fresh defaults
  let totalGames = (existing?.totalGames ?? 0) + 1;
  let wins = (existing?.wins ?? 0) + (isWinner ? 1 : 0);
  let losses = (existing?.losses ?? 0) + (isLoser ? 1 : 0);
  let ties = (existing?.ties ?? 0) + (isTie ? 1 : 0);

  let totalPoints = (existing?.totalPoints ?? 0) + player.points;
  let totalWords = (existing?.totalWords ?? 0) + player.totalWords;
  let totalPointsDiff = (existing?.totalPointsDiff ?? 0) + player.pointsDiff;

  // Handle streak continuation logic
  let currentStreakType = existing?.currentStreakType ?? "none";
  let currentStreak = existing?.currentStreak ?? 0;
  let longestWinStreak = existing?.longestWinStreak ?? 0;
  let longestLossStreak = existing?.longestLossStreak ?? 0;

  if (isWinner) {
    if (currentStreakType === "win") {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
    currentStreakType = "win";
    if (currentStreak > longestWinStreak) longestWinStreak = currentStreak;
  } else if (isLoser) {
    if (currentStreakType === "loss") {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }
    currentStreakType = "loss";
    if (currentStreak > longestLossStreak) longestLossStreak = currentStreak;
  } else if (isTie) {
    currentStreak = 0;
    currentStreakType = "none";
  }

  return {
    totalGames,
    wins,
    losses,
    ties,
    totalPoints,
    totalWords,
    totalPointsDiff,
    currentStreak,
    currentStreakType,
    longestWinStreak,
    longestLossStreak,
    updatedAt: new Date(),
  };
}
