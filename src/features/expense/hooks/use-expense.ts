// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import {
//   createExpense,
//   createExpenseWithAttachment,
//   deleteExpense,
//   getExpenseById,
//   getExpenses,
//   updateExpense,
//   updateExpenseWithAttachment,
// } from "../api/expense.api";

// import type {
//   CreateExpenseInput,
//   ExpenseQueryInput,
//   UpdateExpenseInput,
// } from "../schemas/expense.schema";









// export const expenseKeys = {
//   all: ["expenses"] as const,
//   lists: () => [...expenseKeys.all, "list"] as const,
//   list: (query: ExpenseQueryInput) => [...expenseKeys.lists(), query] as const,
//   details: () => [...expenseKeys.all, "detail"] as const,
//   detail: (id: string) => [...expenseKeys.details(), id] as const,
// };

// export function useExpenses(
//   query: ExpenseQueryInput = {},
//   options?: { enabled?: boolean },
// ) {
//   return useQuery({
//     queryKey: expenseKeys.list(query),
//     queryFn: () => getExpenses(query),
//     enabled: options?.enabled ?? true,
//     placeholderData: (previousData) => previousData,
//   });
// }

// export function useExpense(id?: string, options?: { enabled?: boolean }) {
//   return useQuery({
//     queryKey: expenseKeys.detail(id ?? ""),
//     queryFn: () => getExpenseById(id as string),
//     enabled: Boolean(id) && (options?.enabled ?? true),
//   });
// }

// export function useCreateExpense() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: CreateExpenseInput) => createExpense(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: expenseKeys.all });
//     },
//   });
// }

// export function useCreateExpenseWithAttachment() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (formData: FormData) => createExpenseWithAttachment(formData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: expenseKeys.all });
//     },
//   });
// }

// export function useUpdateExpense() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: UpdateExpenseInput }) =>
//       updateExpense(id, payload),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
//     },
//   });
// }

// export function useUpdateExpenseWithAttachment() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
//       updateExpenseWithAttachment(id, formData),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
//     },
//   });
// }

// export function useDeleteExpense() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id }: { id: string }) => deleteExpense(id),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: expenseKeys.all });
//       queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
//     },
//   });
// }



"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createExpense,
  createExpenseWithAttachment,
  deleteExpense,
  getExpenseById,
  getExpenses,
  updateExpense,
  updateExpenseWithAttachment,
} from "../api/expense.api";

import { syncFinancialAccounts } from "@/features/financial-account/utils/financial-sync";

import type {
  CreateExpenseInput,
  ExpenseQueryInput,
  UpdateExpenseInput,
} from "../schemas/expense.schema";

export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (query: ExpenseQueryInput) => [...expenseKeys.lists(), query] as const,
  details: () => [...expenseKeys.all, "detail"] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

// Expense বদলালে expense list আর account balance দুটোই refresh হবে
function useAfterExpenseChange() {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: expenseKeys.all }),
      syncFinancialAccounts(queryClient),
    ]);
  };
}

export function useExpenses(
  query: ExpenseQueryInput = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: expenseKeys.list(query),
    queryFn: () => getExpenses(query),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}

export function useExpense(id?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: expenseKeys.detail(id ?? ""),
    queryFn: () => getExpenseById(id as string),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export function useCreateExpense() {
  const afterChange = useAfterExpenseChange();
  return useMutation({
    mutationFn: (payload: CreateExpenseInput) => createExpense(payload),
    onSuccess: afterChange,
  });
}

export function useCreateExpenseWithAttachment() {
  const afterChange = useAfterExpenseChange();
  return useMutation({
    mutationFn: (formData: FormData) => createExpenseWithAttachment(formData),
    onSuccess: afterChange,
  });
}

export function useUpdateExpense() {
  const afterChange = useAfterExpenseChange();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpenseInput }) =>
      updateExpense(id, payload),
    onSuccess: afterChange,
  });
}

export function useUpdateExpenseWithAttachment() {
  const afterChange = useAfterExpenseChange();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateExpenseWithAttachment(id, formData),
    onSuccess: afterChange,
  });
}

export function useDeleteExpense() {
  const afterChange = useAfterExpenseChange();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteExpense(id),
    onSuccess: afterChange,
  });
}