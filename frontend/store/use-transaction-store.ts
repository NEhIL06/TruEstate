import { create } from "zustand"

interface TransactionStore {
  
  search: string
  setSearch: (search: string) => void

  
  customerRegions: string[]
  setCustomerRegions: (regions: string[]) => void

  genders: string[]
  setGenders: (genders: string[]) => void

  ageMin: number | undefined
  ageMax: number | undefined
  setAgeRange: (min: number | undefined, max: number | undefined) => void

  productCategories: string[]
  setProductCategories: (categories: string[]) => void

  tags: string[]
  setTags: (tags: string[]) => void

  paymentMethods: string[]
  setPaymentMethods: (methods: string[]) => void

  dateFrom: string | undefined
  dateTo: string | undefined
  setDateRange: (from: string | undefined, to: string | undefined) => void

  
  sortBy: "date" | "quantity" | "customerName"
  sortOrder: "asc" | "desc"
  setSorting: (sortBy: "date" | "quantity" | "customerName", sortOrder: "asc" | "desc") => void

  
  page: number
  pageSize: number
  setPage: (page: number) => void

    
  resetFilters: () => void

    
  getParams: () => {
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
    sortBy: "date" | "quantity" | "customerName"
    sortOrder: "asc" | "desc"
    page: number
    pageSize: number
  }
}

const initialState = {
  search: "",
  customerRegions: [],
  genders: [],
  ageMin: undefined,
  ageMax: undefined,
  productCategories: [],
  tags: [],
  paymentMethods: [],
  dateFrom: undefined,
  dateTo: undefined,
  sortBy: "date" as const,
  sortOrder: "desc" as const,
  page: 1,
  pageSize: 10,
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  ...initialState,

  setSearch: (search) => set({ search, page: 1 }),

  setCustomerRegions: (customerRegions) => set({ customerRegions, page: 1 }),

  setGenders: (genders) => set({ genders, page: 1 }),

  setAgeRange: (ageMin, ageMax) => set({ ageMin, ageMax, page: 1 }),

  setProductCategories: (productCategories) => set({ productCategories, page: 1 }),

  setTags: (tags) => set({ tags, page: 1 }),

  setPaymentMethods: (paymentMethods) => set({ paymentMethods, page: 1 }),

  setDateRange: (dateFrom, dateTo) => set({ dateFrom, dateTo, page: 1 }),

  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder, page: 1 }),

  setPage: (page) => set({ page }),

  resetFilters: () => set({ ...initialState }),

  getParams: () => {
    const state = get()
    return {
      search: state.search || undefined,
      customerRegions: state.customerRegions.length ? state.customerRegions : undefined,
      genders: state.genders.length ? state.genders : undefined,
      ageMin: state.ageMin,
      ageMax: state.ageMax,
      productCategories: state.productCategories.length ? state.productCategories : undefined,
      tags: state.tags.length ? state.tags : undefined,
      paymentMethods: state.paymentMethods.length ? state.paymentMethods : undefined,
      dateFrom: state.dateFrom,
      dateTo: state.dateTo,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      page: state.page,
      pageSize: state.pageSize,
    }
  },
}))
