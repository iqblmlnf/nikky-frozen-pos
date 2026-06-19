import type { Product } from "./product";
import type { Branch } from "./branch";

export interface Stock {
  id: number;
  stock: number;
  product: Product;
  branch: Branch;
}