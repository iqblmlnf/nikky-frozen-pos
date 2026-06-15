// src/utils/date.ts

export const daysFromNow = (
  date: string
): number => {
  return Math.ceil(
    (new Date(date).getTime() - Date.now()) /
      86400000
  );
};

export const daysUntilExpiry = (
  date: string
): number => {
  return Math.ceil(
    (new Date(date).getTime() - Date.now()) /
      86400000
  );
};