"use client"

import { format } from "date-fns"
import type { Transaction } from "@/types"
import { cn } from "@/lib/utils"

interface TransactionTableProps {
  transactions: Transaction[]
}

const columns = [
  { key: "transactionId", label: "Transaction ID", width: "w-32" },
  { key: "date", label: "Date", width: "w-28" },
  { key: "customerId", label: "Customer ID", width: "w-28" },
  { key: "customerName", label: "Customer Name", width: "w-36" },
  { key: "phoneNumber", label: "Phone", width: "w-32" },
  { key: "gender", label: "Gender", width: "w-20" },
  { key: "age", label: "Age", width: "w-16" },
  { key: "productCategory", label: "Category", width: "w-28" },
  { key: "quantity", label: "Qty", width: "w-16" },
  { key: "totalAmount", label: "Amount", width: "w-24" },
  { key: "customerRegion", label: "Region", width: "w-24" },
  { key: "productId", label: "Product ID", width: "w-28" },
  { key: "employeeName", label: "Employee", width: "w-32" },
]

export function TransactionTable({ transactions }: TransactionTableProps) {
  const formatValue = (key: string, value: unknown, transaction: Transaction) => {
    switch (key) {
      case "date":
        return format(new Date(value as string), "MMM d, yyyy")
      case "totalAmount":
        return `$${(value as number).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      case "quantity":
        return (value as number).toLocaleString()
      default:
        return String(value ?? "-")
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                    col.width,
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.transactionId}
                className={cn("transition-colors hover:bg-muted/50", index % 2 === 0 ? "bg-background" : "bg-muted/20")}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap px-4 py-3 text-sm",
                      col.key === "transactionId" && "font-mono text-xs",
                      col.key === "totalAmount" && "font-medium",
                      col.width,
                    )}
                  >
                    {formatValue(col.key, transaction[col.key as keyof Transaction], transaction)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
