export const OFFLINE_SALES_KEY = "offline_sales";

export function saveOfflineSale(data: any) {
  const existing = JSON.parse(localStorage.getItem(OFFLINE_SALES_KEY) || "[]");

  existing.push({
    ...data,
    offline_id: Date.now(),
  });

  localStorage.setItem(OFFLINE_SALES_KEY, JSON.stringify(existing));
}

export function getOfflineSales() {
  return JSON.parse(localStorage.getItem(OFFLINE_SALES_KEY) || "[]");
}

export function clearOfflineSales() {
  localStorage.removeItem(OFFLINE_SALES_KEY);
}
