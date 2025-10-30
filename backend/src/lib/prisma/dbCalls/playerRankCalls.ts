import { Lang, Season } from "../../../types/gameTypes";
import { prisma } from "../prisma";

export const addOrUpdatePlayerRankPoints = async (
  userId: string,
  lang: Lang,
  season: Season,
  pointsDelta: number
) => {
  try {
    const result = await prisma.playerRank.upsert({
      where: {
        userId_lang_season: { userId, lang, season },
      },
      create: {
        userId,
        lang,
        season,
        rankedPoints: 3000 + pointsDelta,
        lastPlayedAt: new Date(),
      },
      update: {
        rankedPoints: { increment: pointsDelta },
        lastPlayedAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error(
      `❌ [addOrUpdatePlayerRankPoints] Failed for user ${userId}:`,
      error
    );
    return null;
  }
};
