//Helper funt to return error messages compitable with ts
export const returnErrorFromUnknown = (error: unknown) => {
  if (error instanceof Error) return { error: error.message };
  return { error: "" };
};
