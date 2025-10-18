//Helper funt to return error messages compitable with ts
export const returnErrorFromUnknown = (error: unknown) => {
  if (error instanceof Error) return { error: error.message };
  return { error: "" };
};

export const setCookie = (name: string, value: string, days: number = 7) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )};path=/;max-age=${maxAge}`;
};

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
};

export const removeCookie = (name: string) => {
  // Set cookie with past max-age to delete it
  document.cookie = `${encodeURIComponent(name)}=;path=/;max-age=0`;
};
