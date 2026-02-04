import pkg from "pg";
const { Client } = pkg;

async function applyRankDecay(client) {
  const decayAmount = 20;
  const now = new Date();
  const threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const res = await client.query(
    `
    UPDATE "player_rank"
    SET "rankedPoints" = GREATEST("rankedPoints" - $1, 0),
        "lastPlayedAt" = $2
    WHERE "season" = 'Season1'
      AND "lastPlayedAt" < $3
    RETURNING id
    `,
    [decayAmount, now, threshold]
  );

  if (res.rowCount > 0) {
    console.log(`Rank decay applied to ${res.rowCount} player(s)`);
  } else {
    console.log("No players needed rank decay");
  }
}

async function clearOldGames(client) {
  const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Delete old games in one query
  const res = await client.query(
    `
    DELETE FROM "game"
    WHERE "createdAt" < $1
    RETURNING id
    `,
    [threshold]
  );

  if (res.rowCount > 0) {
    console.log(`Deleted ${res.rowCount} old game(s) older than 30 days`);
  } else {
    console.log("No old games to delete");
  }
}

export const handler = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URI,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    await applyRankDecay(client);
    await clearOldGames(client);

    await client.end();
    console.log("Job complete");
  } catch (err) {
    console.error("Error running cron:", err);
    await client.end();
  }
};
