export interface Transaction {
  id: number;
  transaction_id: string | null;
  date: string; 
  customer_id: string | null;
  customer_name: string | null;
  phone_number: string | null;
  gender: string | null;
  age: number | null;
  customer_region: string | null;
  customer_type: string | null;
  product_id: string | null;
  product_name: string | null;
  brand: string | null;
  product_category: string | null;
  tags: string[] | null;
  quantity: number | null;
  price_per_unit: number | null;
  discount_percentage: number | null;
  total_amount: number | null;
  final_amount: number | null;
  payment_method: string | null;
  order_status: string | null;
  delivery_type: string | null;
  store_id: string | null;
  store_location: string | null;
  salesperson_id: string | null;
  employee_name: string | null;
}

export type SortField = "date" | "quantity" | "customerName";


//dates are in ISO format
export interface TransactionQueryParams {
  search?: string;
  customerRegions?: string[];
  genders?: string[];
  ageMin?: number;
  ageMax?: number;
  productCategories?: string[];
  tags?: string[];
  paymentMethods?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: SortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}
