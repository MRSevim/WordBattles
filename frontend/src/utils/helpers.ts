export const fetchFromBackend = async (endpoint: string, options = {}) => {
  return await fetch(`${process.env.BACKEND_URL}${endpoint}`, options);
};

//Helper funt to return error messages compitable with ts
export const returnErrorFromUnknown = (error: unknown) => {
  if (error instanceof Error) return { error: error.message };
  return { error: "" };
};
