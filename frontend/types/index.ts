export interface Transaction {
  transactionId: string
  date: string
  customerId: string
  customerName: string
  phoneNumber: string
  gender: string
  age: number
  productCategory: string
  quantity: number
  totalAmount: number
  discount: number
  customerRegion: string
  productId: string
  employeeName: string
  tags?: string[]
  paymentMethod?: string
}

export interface TransactionResponse {
  success: boolean
  data: Transaction[]
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
  }
  summary?: {
    totalUnits: number
    totalAmount: number
    totalDiscount: number
  }
}


export interface TransactionFilters {
  search?: string
  customerRegions?: string[]
  genders?: string[]
  ageMin?: number
  ageMax?: number
  productCategories?: string[]
  tags?: string[]
  paymentMethods?: string[]
  dateFrom?: string
  dateTo?: string
  sortBy?: "date" | "quantity" | "customerName"
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
}

export interface FilterOptions {
  regions: string[]
  genders: string[]
  categories: string[]
  tags: string[]
  paymentMethods: string[]
}
