"use client"

import { ArrowDownAZ, ArrowUpDown, Calendar, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTransactionStore } from "@/store/use-transaction-store"

const sortOptions = [
  { value: "date", label: "Date", icon: Calendar },
  { value: "quantity", label: "Quantity", icon: Hash },
  { value: "customerName", label: "Customer Name (A-Z)", icon: ArrowDownAZ },
] as const

export function SortDropdown() {
  const { sortBy, sortOrder, setSorting } = useTransactionStore()

  const currentOption = sortOptions.find((o) => o.value === sortBy)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2 bg-transparent">
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">Sort:</span>
          <span className="text-sm">{currentOption?.label || "Date"}</span>
          <span className="text-xs text-muted-foreground">({sortOrder === "asc" ? "Asc" : "Desc"})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(value) => setSorting(value as "date" | "quantity" | "customerName", sortOrder)}
        >
          {sortOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} className="gap-2">
              <option.icon className="h-4 w-4" />
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sortOrder}
          onValueChange={(value) => setSorting(sortBy, value as "asc" | "desc")}
        >
          <DropdownMenuRadioItem value="desc">Newest First</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="asc">Oldest First</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
