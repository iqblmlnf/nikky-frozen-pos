export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  expiry: string;
  image?: string;

  stocks?: {
    id: number;
    stock: number;
    branch_id: number;

    branch?: {
      id: number;
      name: string;
    };
  }[];
}
