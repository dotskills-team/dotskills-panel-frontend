// src/features/projects/components/projects-stats.tsx
"use client";

import { useProjectStats } from "@/features/project/hooks";
import { Briefcase, CircleCheck, CirclePause, Clock, ListTodo } from "lucide-react";


export function ProjectsStats() {
  const { isLoading, totalCount, planningCount, inProgressCount, completedCount, onHoldCount } =
    useProjectStats();

  const stats = [
    { label: "Total Projects", value: totalCount, icon: Briefcase },
    { label: "Planning", value: planningCount, icon: ListTodo },
    { label: "In Progress", value: inProgressCount, icon: Clock },
    { label: "On Hold", value: onHoldCount, icon: CirclePause },
    { label: "Completed", value: completedCount, icon: CircleCheck },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-lg border-2 border-slate-100 bg-gray-100 p-4 dark:border-slate-900 dark:bg-slate-950"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600/10 text-indigo-600">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold">{isLoading ? "—" : value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}