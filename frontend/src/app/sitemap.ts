import { routeStrings } from "@/utils/routeStrings";
import { fetchFromBackend } from "@/utils/serverHelpers";
import type { MetadataRoute } from "next";
import { getBaseUrlFromSubdomain } from "@/features/language/helpers/helpersServer";

const EN_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_EN!;
const TR_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_TR!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [promise, BASE_URL] = await Promise.all([
    fetchFromBackend("/user"),
    getBaseUrlFromSubdomain(),
  ]);
  const { data: users }: { data: Record<string, any>[] } = await promise.json();

  const mappedUsers = users.map((user) => {
    const lastModified = user.updatedAt;
    const userId = user.id;
    return {
      url: BASE_URL + routeStrings.userPage(userId),
      lastModified,
      changeFrequency: "weekly" as "weekly",
      priority: 0.5,
      alternates: {
        languages: {
          en: EN_BASE_URL + routeStrings.userPage(userId),
          tr: TR_BASE_URL + routeStrings.userPage(userId),
        },
      },
    };
  });

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: EN_BASE_URL,
          tr: TR_BASE_URL,
        },
      },
    },
    {
      url: BASE_URL + routeStrings.game,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: EN_BASE_URL + routeStrings.game,
          tr: TR_BASE_URL + routeStrings.game,
        },
      },
    },
    {
      url: BASE_URL + routeStrings.signin,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          en: EN_BASE_URL + routeStrings.signin,
          tr: TR_BASE_URL + routeStrings.signin,
        },
      },
    },
    {
      url: BASE_URL + routeStrings.about,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          en: EN_BASE_URL + routeStrings.about,
          tr: TR_BASE_URL + routeStrings.about,
        },
      },
    },
    {
      url: BASE_URL + routeStrings.contact,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          en: EN_BASE_URL + routeStrings.contact,
          tr: TR_BASE_URL + routeStrings.contact,
        },
      },
    },
    {
      url: BASE_URL + routeStrings.ladder,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
      alternates: {
        languages: {
          en: EN_BASE_URL + routeStrings.ladder,
          tr: TR_BASE_URL + routeStrings.ladder,
        },
      },
    },
    ...mappedUsers,
  ];
}
