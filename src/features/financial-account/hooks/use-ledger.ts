"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLoan,
  createTransfer,
  depositMoney,
  getLoanSummary,
  getLoans,
  getTransactions,
  repayLoan,
  type CreateLoanPayload,
  type DepositPayload,
  type RepayLoanPayload,
  type TransferPayload,
} from "../api/ledger.api";

// ব্যালেন্স বদলালে এগুলো রিফ্রেশ হবে
const useRefreshMoney = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["financial-accounts"] });
    qc.invalidateQueries({ queryKey: ["transactions"] });
    qc.invalidateQueries({ queryKey: ["loans"] });
  };
};

export function useTransactions(
  query: Record<string, unknown> = {},
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["transactions", query],
    queryFn: () => getTransactions(query),
    enabled: options?.enabled ?? true,
    placeholderData: (prev) => prev,
  });
}

export function useLoans(query: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ["loans", "list", query],
    queryFn: () => getLoans(query),
    placeholderData: (prev) => prev,
  });
}

export function useLoanSummary() {
  return useQuery({
    queryKey: ["loans", "summary"],
    queryFn: () => getLoanSummary(),
  });
}

export function useDeposit() {
  const refresh = useRefreshMoney();
  return useMutation({
    mutationFn: (p: DepositPayload) => depositMoney(p),
    onSuccess: refresh,
  });
}

export function useCreateLoan() {
  const refresh = useRefreshMoney();
  return useMutation({
    mutationFn: (p: CreateLoanPayload) => createLoan(p),
    onSuccess: refresh,
  });
}

export function useRepayLoan() {
  const refresh = useRefreshMoney();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RepayLoanPayload }) =>
      repayLoan(id, payload),
    onSuccess: refresh,
  });
}

export function useTransfer() {
  const refresh = useRefreshMoney();
  return useMutation({
    mutationFn: (p: TransferPayload) => createTransfer(p),
    onSuccess: () => {
      refresh();
      // fund-transfers এর নিজস্ব query থাকলে সেটাও রিফ্রেশ হবে
    },
  });
}