// src/features/projects/components/projects-trash-table.tsx
"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IProject } from "@/types/project.types";
import { getProjectTrashTableColumns } from "./ProjectTrashColumn";
import { ProjectsTableError, ProjectsTableSkeleton } from "./ProjectTableSkeleton";
import { ProjectsTrashEmptyState } from "./ProjectTrashEmptyState";

interface ProjectsTrashTableProps {
  projects: IProject[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  hasActiveFilters: boolean;
  onRetry: () => void;
  selection: RowSelectionState;
  onSelectionChange: (selection: RowSelectionState) => void;
  onRestore: (project: IProject) => void;
}

export function ProjectsTrashTable({
  projects,
  isLoading,
  isError,
  errorMessage,
  hasActiveFilters,
  onRetry,
  selection,
  onSelectionChange,
  onRestore,
}: ProjectsTrashTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns = useMemo(() => getProjectTrashTableColumns({ onRestore }), [onRestore]);

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
    state: {
      rowSelection: selection,
      columnVisibility,
    },
    onRowSelectionChange: (updater) => {
      const next = typeof updater === "function" ? updater(selection) : updater;
      onSelectionChange(next);
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
  });

  return (
    <div className="rounded-lg border-2 border-slate-100 dark:border-slate-900">
      {isLoading ? (
        <ProjectsTableSkeleton />
      ) : isError ? (
        <ProjectsTableError message={errorMessage} onRetry={onRetry} />
      ) : projects.length === 0 ? (
        <ProjectsTrashEmptyState hasActiveFilters={hasActiveFilters} />
      ) : (
        <div className="overflow-x-auto bg-gray-100 dark:bg-slate-950">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-slate-700 *:text-white hover:bg-slate-800"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                      {header.isPlaceholder ? null : (
                        <span className="text-xs font-medium uppercase">
                          {typeof header.column.columnDef.header === "string"
                            ? header.column.columnDef.header
                            : null}
                        </span>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}