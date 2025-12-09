"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTransactionStore } from "@/store/use-transaction-store"

interface PaginationControlsProps {
  totalPages: number
  totalItems: number
  currentPage: number
}

export function PaginationControls({ totalPages, totalItems, currentPage }: PaginationControlsProps) {
  const { setPage, pageSize } = useTransactionStore()

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push("...")
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...")
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
        Showing {totalItems} {totalItems === 1 ? "result" : "results"}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t bg-card px-4 py-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          disabled={currentPage === 1}
          onClick={() => setPage(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(page)}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <span className="px-3 text-sm sm:hidden">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          disabled={currentPage === totalPages}
          onClick={() => setPage(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  )
}
