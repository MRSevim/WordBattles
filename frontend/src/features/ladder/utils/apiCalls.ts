"use server";

import { fetchFromBackend } from "@/utils/fetcher";

export const fetchLadder = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await fetchFromBackend(
    `/api/ladder/ladder?page=${page}&limit=${limit}`
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
  return json;
};
