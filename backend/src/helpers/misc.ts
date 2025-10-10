export function generateGuestId(prefix = "konuk") {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // readable characters
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${suffix}`;
}
