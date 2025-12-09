"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Filter, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MultiSelectFilter } from "./multi-select-filter"
import { AgeRangeFilter } from "./age-range-filter"
import { DateRangeFilter } from "./date-range-filter"
import { SortDropdown } from "./sort-dropdown"
import { useTransactionStore } from "@/store/use-transaction-store"
import { fetchFilterOptions } from "@/services/api"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function FilterBar() {
  const {
    customerRegions,
    setCustomerRegions,
    genders,
    setGenders,
    productCategories,
    setProductCategories,
    tags,
    setTags,
    paymentMethods,
    setPaymentMethods,
    resetFilters,
  } = useTransactionStore()

  const [options, setOptions] = useState({
    regions: [] as string[],
    genders: [] as string[],
    categories: [] as string[],
    tags: [] as string[],
    paymentMethods: [] as string[],
  })

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchFilterOptions().then(setOptions)
  }, [])

  const hasActiveFilters =
    customerRegions.length > 0 ||
    genders.length > 0 ||
    productCategories.length > 0 ||
    tags.length > 0 ||
    paymentMethods.length > 0

  const filterContent = (
    <>
      <MultiSelectFilter
        label="Region"
        options={options.regions}
        selected={customerRegions}
        onSelectionChange={setCustomerRegions}
      />
      <MultiSelectFilter label="Gender" options={options.genders} selected={genders} onSelectionChange={setGenders} />
      <AgeRangeFilter />
      <MultiSelectFilter
        label="Category"
        options={options.categories}
        selected={productCategories}
        onSelectionChange={setProductCategories}
      />
      <MultiSelectFilter label="Tags" options={options.tags} selected={tags} onSelectionChange={setTags} />
      <MultiSelectFilter
        label="Payment"
        options={options.paymentMethods}
        selected={paymentMethods}
        onSelectionChange={setPaymentMethods}
      />
      <DateRangeFilter />
      <SortDropdown />
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 text-muted-foreground hover:text-foreground"
          onClick={resetFilters}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      )}
    </>
  )

  return (
    <>
      
      <div className="hidden md:flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">{filterContent}</div>

      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="md:hidden">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between gap-2 bg-transparent">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Active</span>
              )}
            </div>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="flex flex-col gap-2 rounded-lg border bg-card p-3">{filterContent}</div>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
