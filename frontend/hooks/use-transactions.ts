"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { fetchTransactions } from "@/services/api"
import { useTransactionStore } from "@/store/use-transaction-store"
import type { Transaction, TransactionResponse } from "@/types"

interface UseTransactionsReturn {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  totalItems: number
  totalPages: number
  currentPage: number
  summary: {
    totalUnits: number
    totalAmount: number
    totalDiscount: number
  }
  refetch: () => void
}

export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  })
  const [summary, setSummary] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
  })

  const search = useTransactionStore((state) => state.search)
  const customerRegions = useTransactionStore((state) => state.customerRegions)
  const genders = useTransactionStore((state) => state.genders)
  const ageMin = useTransactionStore((state) => state.ageMin)
  const ageMax = useTransactionStore((state) => state.ageMax)
  const productCategories = useTransactionStore((state) => state.productCategories)
  const tags = useTransactionStore((state) => state.tags)
  const paymentMethods = useTransactionStore((state) => state.paymentMethods)
  const dateFrom = useTransactionStore((state) => state.dateFrom)
  const dateTo = useTransactionStore((state) => state.dateTo)
  const sortBy = useTransactionStore((state) => state.sortBy)
  const sortOrder = useTransactionStore((state) => state.sortOrder)
  const page = useTransactionStore((state) => state.page)
  const pageSize = useTransactionStore((state) => state.pageSize)

  const isMounted = useRef(true)

  const loadTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const params = {
      search: search || undefined,
      customerRegions: customerRegions.length ? customerRegions : undefined,
      genders: genders.length ? genders : undefined,
      ageMin,
      ageMax,
      productCategories: productCategories.length ? productCategories : undefined,
      tags: tags.length ? tags : undefined,
      paymentMethods: paymentMethods.length ? paymentMethods : undefined,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      page,
      pageSize,
    }

    try {
      const response: TransactionResponse = await fetchTransactions(params)

      if (!isMounted.current) return

      if (response.success) {
        setTransactions(response.data)
        setMeta({
          totalItems: response.meta.totalItems,
          totalPages: response.meta.totalPages,
          currentPage: response.meta.currentPage,
        })

        if (response.summary) {
          setSummary(response.summary)
        } else {
          const calculatedSummary = response.data.reduce(
            (acc, t) => ({
              totalUnits: acc.totalUnits + t.quantity,
              totalAmount: acc.totalAmount + t.totalAmount,
              totalDiscount: acc.totalDiscount + (t.discount || 0),
            }),
            { totalUnits: 0, totalAmount: 0, totalDiscount: 0 },
          )
          setSummary(calculatedSummary)
        }
      } else {
        setError("Failed to fetch transactions")
      }
    } catch (err) {
      if (!isMounted.current) return
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [
    search,
    customerRegions,
    genders,
    ageMin,
    ageMax,
    productCategories,
    tags,
    paymentMethods,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page,
    pageSize,
  ])

  useEffect(() => {
    isMounted.current = true
    loadTransactions()

    return () => {
      isMounted.current = false
    }
  }, [loadTransactions])

  return {
    transactions,
    isLoading,
    error,
    totalItems: meta.totalItems,
    totalPages: meta.totalPages,
    currentPage: meta.currentPage,
    summary,
    refetch: loadTransactions,
  }
}
