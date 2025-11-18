export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  sku?: string;
}

export interface DeliveryCompany {
  id: string;
  name: string;
  cost: number;
  logo?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface SalesOrder {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  deliveryCompany: DeliveryCompany | null;
  subtotal: number;
  deliveryCost: number;
  total: number;
}
