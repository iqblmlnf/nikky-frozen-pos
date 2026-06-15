// src/data/helpers.ts

export const D = (n: number): string => {
  const d = new Date();

  d.setDate(d.getDate() + n);

  return d.toISOString().split("T")[0];
};