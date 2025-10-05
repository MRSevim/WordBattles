export const fetchFromBackend = async (endpoint: string, options = {}) => {
  return await fetch(`${process.env.BACKEND_URL}${endpoint}`, options);
};
