"use client"

import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTransactionStore } from "@/store/use-transaction-store"

export function SearchBar() {
  const { search, setSearch } = useTransactionStore()
  const [localSearch, setLocalSearch] = useState(search)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, setSearch])

  // Sync with store
  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by customer name or phone..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="pl-10 pr-10"
      />
      {localSearch && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={() => setLocalSearch("")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}
