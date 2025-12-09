import type { TransactionFilters, TransactionResponse } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function fetchTransactions(params: TransactionFilters): Promise<TransactionResponse> {
  const searchParams = new URLSearchParams()

  if (params.search) searchParams.set("search", params.search)
  if (params.customerRegions?.length) {
    searchParams.set("customerRegions", params.customerRegions.join(","))
  }
  if (params.genders?.length) {
    searchParams.set("genders", params.genders.join(","))
  }
  if (params.ageMin !== undefined) {
    searchParams.set("ageMin", params.ageMin.toString())
  }
  if (params.ageMax !== undefined) {
    searchParams.set("ageMax", params.ageMax.toString())
  }
  if (params.productCategories?.length) {
    searchParams.set("productCategories", params.productCategories.join(","))
  }
  if (params.tags?.length) {
    searchParams.set("tags", params.tags.join(","))
  }
  if (params.paymentMethods?.length) {
    searchParams.set("paymentMethods", params.paymentMethods.join(","))
  }
  if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom)
  if (params.dateTo) searchParams.set("dateTo", params.dateTo)
  if (params.sortBy) searchParams.set("sortBy", params.sortBy)
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder)
  if (params.page) searchParams.set("page", params.page.toString())
  if (params.pageSize) searchParams.set("pageSize", params.pageSize.toString())

  const response = await fetch(`${API_BASE_URL}/api/transactions?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

export async function fetchFilterOptions(): Promise<{
  regions: string[]
  genders: string[]
  categories: string[]
  tags: string[]
  paymentMethods: string[]
}> {
  
  return {
    regions: ["North", "South", "East", "West", "Central"],
    genders: ["Male", "Female", "Other"],
    categories: ["Electronics", "Clothing", "Food", "Home", "Sports", "Beauty"],
    tags: ["Premium", "Sale", "New", "Popular", "Limited"],
    paymentMethods: ["Cash", "Credit Card", "Debit Card", "Digital Wallet"],
  }
}
