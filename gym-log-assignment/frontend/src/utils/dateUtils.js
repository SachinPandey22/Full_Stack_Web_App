export const getDaysSince = (timestamp) => {
  if (!timestamp) return null;
  const updated = new Date(timestamp);
  if (Number.isNaN(updated.getTime())) return null;
  const now = new Date();
  const diffMs = now - updated;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};
