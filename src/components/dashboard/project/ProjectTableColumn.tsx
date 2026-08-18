// src/features/projects/components/project-table-columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { IProject } from "@/types/project.types";
import { PROJECT_STATUS_CONFIG, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
import { formatCurrency, formatDate } from "@/features/project/utils/project.utils";
import { ProjectRowActions } from "./ProjectRowAction";

const TYPE_LABELS = Object.fromEntries(
  PROJECT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

interface ProjectsTableColumnsOptions {
  onOpenDetails: (project: IProject) => void;
  onEdit: (project: IProject) => void;
  onDelete: (project: IProject) => void;
}

export function getProjectsTableColumns({
  onOpenDetails,
  onEdit,
  onDelete,
}: ProjectsTableColumnsOptions): ColumnDef<IProject>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
          onClick={(event) => event.stopPropagation()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "name",
      id: "name",
      header: "Project",
cell: ({ row }) => {
        const project = row.original;
        return (
          <button
            type="button"
            onClick={() => onOpenDetails(project)}
            className="flex flex-col text-left"
          >
            <span className="font-medium">{project.name}</span>
            <span className="text-xs text-muted-foreground">{project.client?.fullName}</span>
          </button>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {TYPE_LABELS[row.original.type] ?? row.original.type}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const config = PROJECT_STATUS_CONFIG[row.original.status];
        return (
          <Badge variant="outline" className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "budget",
      header: "Project Value",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatCurrency(row.original.budget)}
        </span>
      ),
    },
    {
      accessorKey: "startDate",
      id: "startDate",
      header: "Start Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.startDate)}
        </span>
      ),
    },
    {
      accessorKey: "technologies",
      header: "Technologies",
      cell: ({ row }) => {
        const technologies = row.original.technologies ?? [];
        return (
          <div className="flex max-w-50 flex-wrap gap-1">
            {technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
            {technologies.length > 3 && (
              <Badge variant="outline">+{technologies.length - 3}</Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.updatedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => (
        <ProjectRowActions
          project={row.original}
          onOpenDetails={onOpenDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}