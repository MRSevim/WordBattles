import { prisma } from "../lib/prisma/prisma";

export function applyRankDecay(intervalMs = 7 * 24 * 60 * 60 * 1000) {
  async function run() {
    const decayAmount = 20;

    const now = new Date();
    const threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const result = await prisma.playerRank.updateMany({
      where: { season: "Season1", lastPlayedAt: { lt: threshold } },
      data: {
        rankedPoints: { decrement: decayAmount },
        lastPlayedAt: now, // update lastPlayedAt so decay isn’t immediately repeated
      },
    });

    if (result.count > 0) {
      console.log(`Rank decay applied to ${result.count} player(s)`);
    } else {
      console.log("No players needed rank decay");
    }
  }

  run(); // run immediately
  setInterval(run, intervalMs); // repeat on interval
}

export function clearOldGames(intervalMs = 24 * 60 * 60 * 1000) {
  async function run() {
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const oldGames = await prisma.game.findMany({
      where: { createdAt: { lt: threshold } },
      select: { id: true },
    });

    if (oldGames.length === 0) {
      console.log("No old games to delete");
      return;
    }

    const result = await prisma.game.deleteMany({
      where: { id: { in: oldGames.map((g) => g.id) } },
    });

    console.log(`Deleted ${result.count} old game(s) older than 30 days`);
  }

  run(); // run immediately
  setInterval(run, intervalMs); // repeat on interval
}
