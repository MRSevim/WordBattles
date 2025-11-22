import { routeStrings } from "@/utils/routeStrings";
import { fetchFromBackend } from "@/utils/serverHelpers";
import type { MetadataRoute } from "next";
import { Lang } from "../../../types";

const EN_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_EN!;
const TR_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_TR!;

export const dynamic = "force-dynamic";

export async function generateSitemaps() {
  // Generate sitemaps for each language
  return [{ id: "en" }, { id: "tr" }];
}

export default async function sitemap({
  id,
}: {
  id: Lang;
}): Promise<MetadataRoute.Sitemap> {
  const promise = await fetchFromBackend("/user");
  const { data: users }: { data: Record<string, any>[] } = await promise.json();

  const BASE_URL = id === "tr" ? TR_BASE_URL : EN_BASE_URL;

  const mappedUsers = users.map((user) => {
    const lastModified = user.updatedAt;
    const userId = user.id;
    return {
      url: BASE_URL + routeStrings.userPage(userId),
      lastModified,
      changeFrequency: "daily" as "daily",
      priority: 0.5,
      alternates: {
        languages: {
          en: EN_BASE_URL,
          tr: TR_BASE_URL,
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
          en: EN_BASE_URL,
          tr: TR_BASE_URL,
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
          en: EN_BASE_URL,
          tr: TR_BASE_URL,
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
          en: EN_BASE_URL,
          tr: TR_BASE_URL,
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
          en: EN_BASE_URL,
          tr: TR_BASE_URL,
        },
      },
    },
    {
      url: BASE_URL + routeStrings.ladder,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
      alternates: {
        languages: {
          en: EN_BASE_URL,
          tr: TR_BASE_URL,
        },
      },
    },
    ...mappedUsers,
  ];
}
