// src/utils/product.ts

import type { Product } from "../types/product";
import { daysUntilExpiry } from "./date";

export const getLowStockProducts = (
  products: Product[]
) =>
  products.filter(
    p => (p.stocks?.reduce((sum: number, item: any) => sum + Number(item.stock), 0) ?? 0) <= 10
  );

export const getExpiringProducts = (
  products: Product[]
) =>
  products.filter(
    p => daysUntilExpiry(p.expiry) <= 7
  );