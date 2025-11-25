/**
 * Data Table Wrapper Template
 * Provides consistent table styling for displaying lists of data
 */

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableWrapperProps<T> {
  title?: string
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
  rowClassName?: string
}

export const DataTableWrapper = React.forwardRef<
  HTMLTableElement,
  DataTableWrapperProps<any>
>(
  (
    {
      title,
      columns,
      data,
      isLoading = false,
      emptyMessage = "No data found",
      onRowClick,
      rowClassName,
    },
    ref,
  ) => {
    if (isLoading) {
      return (
        <Card className="p-8">
          <div className="text-center text-gray-500">Loading...</div>
        </Card>
      )
    }

    if (data.length === 0) {
      return (
        <Card className="p-8">
          <div className="text-center text-gray-500">{emptyMessage}</div>
        </Card>
      )
    }

    return (
      <Card className="overflow-hidden">
        {title && <div className="p-4 border-b bg-gray-50 font-semibold">{title}</div>}
        <div className="overflow-x-auto">
          <Table ref={ref}>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columns.map((column) => (
                  <TableHead key={String(column.key)} className="font-semibold">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => onRowClick?.(item)}
                  className={`${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""} ${rowClassName || ""}`}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render((item as any)[String(column.key)], item)
                        : (item as any)[String(column.key)]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    )
  },
)

DataTableWrapper.displayName = "DataTableWrapper"

export default DataTableWrapper
