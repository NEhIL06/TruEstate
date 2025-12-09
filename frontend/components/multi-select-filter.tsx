"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MultiSelectFilterProps {
  label: string
  options: string[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
}

export function MultiSelectFilter({ label, options, selected, onSelectionChange }: MultiSelectFilterProps) {
  const [open, setOpen] = React.useState(false)

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onSelectionChange(selected.filter((s) => s !== option))
    } else {
      onSelectionChange([...selected, option])
    }
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 justify-between gap-2 min-w-[140px] bg-transparent"
        >
          <span className="truncate text-sm">{selected.length > 0 ? `${label} (${selected.length})` : label}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-medium">{label}</span>
          {selected.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 px-2 text-xs">
              Clear
            </Button>
          )}
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {options.map((option) => (
            <div
              key={option}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                selected.includes(option) && "bg-accent",
              )}
              onClick={() => toggleOption(option)}
            >
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border",
                  selected.includes(option)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30",
                )}
              >
                {selected.includes(option) && <Check className="h-3 w-3" />}
              </div>
              <span>{option}</span>
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 border-t p-2">
            {selected.map((item) => (
              <Badge key={item} variant="secondary" className="gap-1 text-xs">
                {item}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleOption(item)
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
