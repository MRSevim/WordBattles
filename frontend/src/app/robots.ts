import { getBaseUrlFromSubdomain } from "@/features/language/utils/helpersServer";
import { routeStrings } from "@/utils/routeStrings";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const BASE_URL = await getBaseUrlFromSubdomain();
  return {
    rules: {
      userAgent: "*",
      disallow: routeStrings.profile,
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
