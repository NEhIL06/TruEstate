"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTransactionStore } from "@/store/use-transaction-store"

export function DateRangeFilter() {
  const { dateFrom, dateTo, setDateRange } = useTransactionStore()
  const [open, setOpen] = useState(false)

  const handleClear = () => {
    setDateRange(undefined, undefined)
    setOpen(false)
  }

  const hasValue = dateFrom || dateTo

  const getDisplayText = () => {
    if (!hasValue) return "Date Range"
    if (dateFrom && dateTo) {
      return `${format(new Date(dateFrom), "MMM d")} - ${format(new Date(dateTo), "MMM d")}`
    }
    if (dateFrom) return `From ${format(new Date(dateFrom), "MMM d")}`
    if (dateTo) return `To ${format(new Date(dateTo), "MMM d")}`
    return "Date Range"
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 justify-between gap-2 min-w-[160px] bg-transparent">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="truncate text-sm">{getDisplayText()}</span>
          </div>
          {hasValue && (
            <X
              className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-from" className="text-sm font-medium">
              From Date
            </Label>
            <Input
              id="date-from"
              type="date"
              value={dateFrom || ""}
              onChange={(e) => setDateRange(e.target.value || undefined, dateTo)}
              max={dateTo || undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-to" className="text-sm font-medium">
              To Date
            </Label>
            <Input
              id="date-to"
              type="date"
              value={dateTo || ""}
              onChange={(e) => setDateRange(dateFrom, e.target.value || undefined)}
              min={dateFrom || undefined}
            />
          </div>
          <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleClear}>
            Clear Dates
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
