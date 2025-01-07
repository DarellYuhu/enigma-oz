"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTablePagination } from "./DataTablePagination";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[] | (() => ColumnDef<TData, TValue>[]);
  data: TData[];
  className?: string;
  pagination?: boolean;
  initialPageSize?: number;
  enableMultiRowSelection?: boolean;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
}

export function Datatable<TData, TValue>({
  data,
  columns,
  className,
  pagination = true,
  initialPageSize = 5,
  enableMultiRowSelection,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns: Array.isArray(columns) ? columns : columns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiRowSelection: enableMultiRowSelection,
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePagination table={table} />}
    </div>
  );
}
