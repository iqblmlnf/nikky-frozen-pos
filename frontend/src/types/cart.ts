// src/types/cart.ts

import type { Product } from "./product";

export interface CartItem {
  product: Product;
  qty: number;
}