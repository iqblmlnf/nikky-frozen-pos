// src/utils/product.ts

import type { Product } from "../types/product";
import { daysUntilExpiry } from "./date";

export const getLowStockProducts = (
  products: Product[]
) =>
  products.filter(
    p => p.stock <= 10
  );

export const getExpiringProducts = (
  products: Product[]
) =>
  products.filter(
    p => daysUntilExpiry(p.expiry) <= 7
  );