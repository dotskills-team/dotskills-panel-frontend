"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  Pencil,
  Plus,
  Search,
  Trash,
  Wallet,
  WalletCards,
} from "lucide-react";

import {
  useDeleteFinancialAccount,
  useFinancialAccounts,
  useFinancialAccountSummary,
} from "@/features/financial-account/hooks/use-financial-account";

import {
  ACCOUNT_STATUS_OPTIONS,
  ACCOUNT_TYPE_OPTIONS,
  FINANCIAL_ACCOUNT_SORT_OPTIONS,
} from "@/features/financial-account/constants/financial-account.constant";
import type { IFinancialAccount } from "@/types/financial-account.types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FinancialAccountFormDialog } from "./financial-account-form-dialog";

const money = (value?: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(
    value ?? 0,
  );

function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  caption: string;
  icon: typeof WalletCards;
  tone: string;
}) {
  return (
    <Card className="rounded-xl border-0 bg-gray-100 dark:bg-slate-900 ease-in-out duration-500 transform hover:bg-slate-950 hover:scale-105 shadow-sm overflow-hidden transition-shadow hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", tone)}>
          <Icon />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{caption}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinancialAccountPageClient() {
  const [search, setSearch] = useState("");
  const [accountType, setAccountType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IFinancialAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IFinancialAccount | null>(null);

  const query = useMemo(
    () => ({
      page,
      limit,
      searchTerm: search || undefined,
      accountType: accountType === "ALL" ? undefined : (accountType as never),
      status: status === "ALL" ? undefined : (status as never),
      sort,
    }),
    [page, limit, search, accountType, status, sort],
  );

  const list = useFinancialAccounts(query);
  const deleteMutation = useDeleteFinancialAccount();

  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;

  const summary = useFinancialAccountSummary();
  const stats = summary.data?.data;



  const totalBalance = rows.reduce((sum, row) => sum + row.openingBalance, 0);
  const activeCount = rows.filter((row) => row.status === "ACTIVE").length;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (account: IFinancialAccount) => {
    setEditing(account);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteTarget._id });
      toast.success("Financial account deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete financial account.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FinancialAccountFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        existing={editing}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete financial account?"
        description={`This will permanently remove "${deleteTarget?.accountName}" from your records.`}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
      />

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage cash, bank, and mobile banking accounts.
          </p>
        </div>
        <Button
          className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
          onClick={openCreate}
        >
          <Plus />
          Add Account
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Current Balance"
          value={money(stats?.totalCurrentBalance)}
          caption={`Opening: ${money(stats?.totalOpeningBalance)}`}
          icon={Wallet}
          tone="bg-blue-500/10 text-blue-600"
        />

        <StatCard
          title="Total Accounts"
          value={String(meta?.total ?? rows.length)}
          caption="All financial accounts"
          icon={WalletCards}
          tone="bg-primary/10 text-primary"
        />
        <StatCard
          title="Active Accounts"
          value={String(activeCount)}
          caption="Currently active"
          icon={Landmark}
          tone="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          title="Total Opening Balance"
          value={money(totalBalance)}
          caption="Sum on this page"
          icon={Wallet}
          tone="bg-blue-500/10 text-blue-600"
        />
      </div>

      <Card className="bg-slate-100 dark:bg-slate-950 p-0">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="pt-5 pb-2 px-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 w-5 h-5 top-1.5 text-muted-foreground" />
              <Input
                className="pl-9 py-2"
                placeholder="Search by account name, number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={accountType}
              onValueChange={(value) => {
                setAccountType(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {ACCOUNT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {ACCOUNT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FINANCIAL_ACCOUNT_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {list.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {list.error instanceof Error ? list.error.message : "Unable to load accounts."}
            </div>
          ) : list.isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <WalletCards className="text-muted-foreground" />
              <div>
                <p className="font-medium">No financial accounts found</p>
                <p className="text-sm text-muted-foreground">
                  Try changing filters or search terms.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setAccountType("ALL");
                  setStatus("ALL");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-sm">
                <thead>
                  <tr className="hover:bg-cyan-800 *:text-white bg-indigo-600 rounded-xl border-b text-left text-xs">
                    <th className="p-3 font-medium">Account</th>
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Number</th>
                    <th className="p-3 font-medium">Opening Balance</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((account) => (
                    <tr key={account._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3">
                        <p className="font-medium">{account.accountName}</p>
                        {account.accountHolderName && (
                          <p className="text-xs text-muted-foreground">
                            {account.accountHolderName}
                          </p>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {ACCOUNT_TYPE_OPTIONS.find((o) => o.value === account.accountType)?.label ??
                            account.accountType}
                        </Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {account.accountNumber || "—"}
                      </td>
                      <td className="p-3 font-medium">{money(account.openingBalance)}</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            account.status === "ACTIVE"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }
                        >
                          {account.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(account)}
                            aria-label="Edit account"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setDeleteTarget(account)}
                            aria-label="Delete account"
                            className="hover:cursor-pointer transition hover:scale-[1.02]"
                          >
                            <Trash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-3 pb-2 px-4 flex flex-col justify-between gap-3 border-t text-sm text-muted-foreground sm:flex-row sm:items-center">
            <span>
              Showing {rows.length ? (page - 1) * limit + 1 : 0} to{" "}
              {Math.min(page * limit, meta?.total ?? rows.length)} of{" "}
              {meta?.total ?? rows.length} results
            </span>
            <div className="flex items-center gap-2">
              <Select
                value={String(limit)}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-24">
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
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ArrowLeft />
              </Button>
              <span>
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

export default FinancialAccountPageClient;