"use client";

import { ProjectStatus } from "@/types/project.types";
import { useProjects } from "./useProjects";
// import { useProjects } from "./useProjects";

export const useProjectStats = () => {
  const total = useProjects({
    limit: 1,
    page: 1,
  });

  const planning = useProjects({
    limit: 1,
    page: 1,
    status: ProjectStatus.PLANNING,
  });

  const inProgress = useProjects({
    limit: 1,
    page: 1,
    status: ProjectStatus.IN_PROGRESS,
  });

  const completed = useProjects({
    limit: 1,
    page: 1,
    status: ProjectStatus.COMPLETED,
  });

  const onHold = useProjects({
    limit: 1,
    page: 1,
    status: ProjectStatus.ON_HOLD,
  });

  const isLoading =
    total.isLoading ||
    planning.isLoading ||
    inProgress.isLoading ||
    completed.isLoading ||
    onHold.isLoading;

  const totalCount =
    total.data?.meta?.total ?? 0;

  const planningCount =
    planning.data?.meta?.total ?? 0;

  const inProgressCount =
    inProgress.data?.meta?.total ?? 0;

  const completedCount =
    completed.data?.meta?.total ?? 0;

  const onHoldCount =
    onHold.data?.meta?.total ?? 0;

  return {
    isLoading,
    totalCount,
    planningCount,
    inProgressCount,
    completedCount,
    onHoldCount,
  };
};