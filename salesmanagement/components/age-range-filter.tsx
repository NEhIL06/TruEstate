"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { useTransactionStore } from "@/store/use-transaction-store"

export function AgeRangeFilter() {
  const { ageMin, ageMax, setAgeRange } = useTransactionStore()
  const [localMin, setLocalMin] = useState<string>(ageMin?.toString() || "")
  const [localMax, setLocalMax] = useState<string>(ageMax?.toString() || "")
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setLocalMin(ageMin?.toString() || "")
    setLocalMax(ageMax?.toString() || "")
  }, [ageMin, ageMax])

  const handleApply = () => {
    const min = localMin ? Number.parseInt(localMin) : undefined
    const max = localMax ? Number.parseInt(localMax) : undefined

    if (min !== undefined && max !== undefined && min > max) {
      setError("Min age cannot be greater than max age")
      return
    }

    setError(null)
    setAgeRange(min, max)
    setOpen(false)
  }

  const handleClear = () => {
    setLocalMin("")
    setLocalMax("")
    setError(null)
    setAgeRange(undefined, undefined)
    setOpen(false)
  }

  const hasValue = ageMin !== undefined || ageMax !== undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9 justify-between gap-2 min-w-[120px] bg-transparent">
          <span className="truncate text-sm">
            {hasValue ? `Age: ${ageMin || "0"}-${ageMax || "100+"}` : "Age Range"}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="age-min" className="text-xs">
                Min Age
              </Label>
              <Input
                id="age-min"
                type="number"
                placeholder="0"
                min={0}
                max={120}
                value={localMin}
                onChange={(e) => {
                  setLocalMin(e.target.value)
                  setError(null)
                }}
                className="h-8"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age-max" className="text-xs">
                Max Age
              </Label>
              <Input
                id="age-max"
                type="number"
                placeholder="100"
                min={0}
                max={120}
                value={localMax}
                onChange={(e) => {
                  setLocalMax(e.target.value)
                  setError(null)
                }}
                className="h-8"
              />
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleClear}>
              Clear
            </Button>
            <Button size="sm" className="flex-1" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
