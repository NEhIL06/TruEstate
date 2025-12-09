"use client"

import { SummaryCards } from "@/components/summary-cards"
import { FilterBar } from "@/components/filter-bar"
import { TransactionTable } from "@/components/transaction-table"
import { PaginationControls } from "@/components/pagination-controls"
import { TableSkeleton } from "@/components/table-skeleton"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"
import { useTransactions } from "@/hooks/use-transactions"

export function DashboardContent() {
  const { transactions, isLoading, error, totalItems, totalPages, currentPage, summary, refetch } = useTransactions()

  return (
    <div className="space-y-6">
      
      <SummaryCards
        totalUnits={summary.totalUnits}
        totalAmount={summary.totalAmount}
        totalDiscount={summary.totalDiscount}
        isLoading={isLoading}
      />

      <FilterBar />

      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : transactions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <TransactionTable transactions={transactions} />
          <PaginationControls totalPages={totalPages} totalItems={totalItems} currentPage={currentPage} />
        </>
      )}
    </div>
  )
}
