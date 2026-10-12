"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, HandCoins } from "lucide-react";

import {
  useLoanSummary,
  useLoans,
  useRepayLoan,
} from "@/features/financial-account/hooks/use-ledger";
import { useFinancialAccounts } from "@/features/financial-account/hooks/use-financial-account";
import type { ILoan } from "@/types/financial-account.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const money = (v?: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(v ?? 0);

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/* ------------------------------ Repay dialog ------------------------------ */

function RepayDialog({
  loan,
  onClose,
}: {
  loan: ILoan | null;
  onClose: () => void;
}) {
  const open = Boolean(loan);
  const [form, setForm] = useState({
    accountId: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  const mutation = useRepayLoan();
  const accountsQuery = useFinancialAccounts(
    { limit: 100, status: "ACTIVE" } as never,
    { enabled: open },
  );
  const accounts = accountsQuery.data?.data ?? [];

  useEffect(() => {
    if (loan) {
      setForm({
        accountId: "",
        amount: String(loan.dueAmount),
        date: new Date().toISOString().slice(0, 10),
        note: "",
      });
    }
  }, [loan]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loan) return;

    const amount = Number(form.amount);
    if (!form.accountId) return toast.error("Please select an account.");
    if (!(amount > 0)) return toast.error("Amount must be greater than 0.");
    if (amount > loan.dueAmount)
      return toast.error(`Cannot exceed the outstanding ${money(loan.dueAmount)}.`);

    const acc = accounts.find((a) => a._id === form.accountId);
    if (acc && amount > acc.currentBalance)
      return toast.error(`"${acc.accountName}" has only ${money(acc.currentBalance)}.`);

    try {
      await mutation.mutateAsync({
        id: loan._id,
        payload: {
          accountId: form.accountId,
          amount,
          date: form.date,
          note: form.note || undefined,
        },
      });
      toast.success("Repayment recorded.");
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Repayment failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Repay Loan</DialogTitle>
          <DialogDescription>
            {loan
              ? `Repay ${loan.lenderName}. Outstanding: ${money(loan.dueAmount)}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Pay from account
            <Select
              value={form.accountId}
              onValueChange={(v) => setForm({ ...form, accountId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((a) => (
                  <SelectItem key={a._id} value={a._id}>
                    {a.accountName} ({money(a.currentBalance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Amount
              <Input
                type="number"
                min="1"
                max={loan?.dueAmount}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Date
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Note
            <Textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Optional note"
            />
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="cursor-pointer bg-indigo-600 text-white transition hover:scale-[1.02] hover:bg-indigo-500"
            >
              {mutation.isPending ? "Saving..." : "Repay"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Loans section ----------------------------- */

export function LoansSection() {
  const [repaying, setRepaying] = useState<ILoan | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loansQuery = useLoans({ page, limit, sort: "-createdAt" });
  const summaryQuery = useLoanSummary();

  const loans = loansQuery.data?.data ?? [];
  const meta = loansQuery.data?.meta;
  const s = summaryQuery.data?.data;

  return (
    <div className="space-y-3">
      <RepayDialog loan={repaying} onClose={() => setRepaying(null)} />

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Loans / Borrowed Money</h2>
          <p className="text-xs text-muted-foreground">Who you owe and how much is left</p>
        </div>
        <Badge variant="outline">{s?.activeCount ?? 0} active</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Borrowed</p>
            <p className="mt-1 text-lg font-semibold">{money(s?.totalBorrowed)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Repaid</p>
            <p className="mt-1 text-lg font-semibold text-emerald-600">
              {money(s?.totalRepaid)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Still Owed</p>
            <p className="mt-1 text-lg font-semibold text-amber-600">{money(s?.totalDue)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          {loansQuery.isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Loading loans...</p>
          ) : loans.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-8 text-center">
              <HandCoins className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No loans yet. Use "Add Money" and choose Borrowed money.
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="sticky top-0 z-10 border-b bg-indigo-600 text-left text-xs text-white">
                    <th className="p-3 font-medium">Lender</th>
                    <th className="p-3 font-medium">Borrowed</th>
                    <th className="p-3 font-medium">Repaid</th>
                    <th className="p-3 font-medium">Remaining</th>
                    <th className="p-3 font-medium">Received</th>
                    <th className="p-3 font-medium">Due date</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3">
                        <p className="font-medium">{loan.lenderName}</p>
                        {loan.lenderPhone && (
                          <p className="text-xs text-muted-foreground">{loan.lenderPhone}</p>
                        )}
                      </td>
                      <td className="p-3">{money(loan.principalAmount)}</td>
                      <td className="p-3 text-emerald-600">{money(loan.repaidAmount)}</td>
                      <td className="p-3 font-semibold text-amber-600">
                        {money(loan.dueAmount)}
                      </td>
                      <td className="p-3 text-muted-foreground">{fmtDate(loan.receivedDate)}</td>
                      <td className="p-3 text-muted-foreground">{fmtDate(loan.dueDate)}</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            loan.status === "PAID"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }
                        >
                          {loan.status === "PAID" ? "Paid" : "Active"}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loan.status === "PAID"}
                          onClick={() => setRepaying(loan)}
                          className="cursor-pointer"
                        >
                          Repay
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
            <span>
              Showing {loans.length ? (page - 1) * limit + 1 : 0} to{" "}
              {Math.min(page * limit, meta?.total ?? loans.length)} of{" "}
              {meta?.total ?? loans.length} results
            </span>

            <div className="flex items-center gap-2">
              <Select
                value={String(limit)}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50].map((value) => (
                    <SelectItem key={value} value={String(value)}>
                      {value} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeft />
              </Button>

              <span className="min-w-12 text-center">
                {page} / {meta?.totalPage ?? 1}
              </span>

              <Button
                variant="outline"
                size="icon"
                disabled={page >= (meta?.totalPage ?? 1)}
                onClick={() => setPage(page + 1)}
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoansSection;