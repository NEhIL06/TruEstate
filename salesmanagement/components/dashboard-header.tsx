import { SearchBar } from "@/components/search-bar"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales Management System</h1>
            <p className="text-sm text-muted-foreground">Track and manage retail transactions</p>
          </div>
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
