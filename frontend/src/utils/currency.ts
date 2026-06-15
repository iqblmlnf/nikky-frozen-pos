export const fmt = (
  value: number
): string => {
  return (
    "Rp. " +
    Number(value).toLocaleString("id-ID")
  );
};