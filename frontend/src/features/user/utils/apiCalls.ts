import { fetchFromBackend } from "@/utils/fetcher";

export const fetchUser = async (id: string) => {
  const response = await fetchFromBackend("/user/" + id);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message);
  }
  return json;
};
