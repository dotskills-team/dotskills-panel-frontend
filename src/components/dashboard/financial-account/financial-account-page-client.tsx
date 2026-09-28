"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  CreditCard,
  Landmark,
  Pencil,
  Plus,
  Search,
  Smartphone,
  Trash,
  Wallet,
  WalletCards,
} from "lucide-react";


import { FinancialAccountDetailsSheet } from "./financial-account-details-sheet";
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

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const money = (value?: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
  }).format(value ?? 0);

/* -------------------------------------------------------------------------- */
/*                              Summary Stat Card                             */
/* -------------------------------------------------------------------------- */

function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  className,
  iconClassName,
}: {
  title: string;
  value: string;
  caption: string;
  icon: typeof Wallet;
  className: string;
  iconClassName: string;
}) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border-0 text-white shadow-sm",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      {/* Decorative Circle */}
      <div className="absolute -right-8 -top-8 size-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

      <CardContent className="relative flex items-center gap-4 p-4 sm:p-5">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            "bg-white/15 backdrop-blur-sm",
            iconClassName,
          )}
        >
          <Icon className="size-6" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-white/75">{title}</p>

          <p className="mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl">
            {value}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-white/65">
            {caption}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Account Balance Card                              */
/* -------------------------------------------------------------------------- */

function AccountBalanceCard({
  account,
}: {
  account: IFinancialAccount;
}) {
  const accountType =
    ACCOUNT_TYPE_OPTIONS.find(
      (option) => option.value === account.accountType,
    )?.label ?? account.accountType;

  const type = String(account.accountType).toUpperCase();

  let Icon = Wallet;
  let cardClass =
    "from-blue-600 to-indigo-600 shadow-blue-500/10";
  let iconClass = "text-blue-100";

  if (type.includes("BANK")) {
    Icon = Building2;
    cardClass = "from-indigo-600 to-violet-600 shadow-indigo-500/10";
    iconClass = "text-indigo-100";
  } else if (
    type.includes("MOBILE") ||
    type.includes("BKASH") ||
    type.includes("NAGAD") ||
    type.includes("ROCKET")
  ) {
    Icon = Smartphone;
    cardClass = "from-cyan-500 to-blue-600 shadow-cyan-500/10";
    iconClass = "text-cyan-100";
  } else if (type.includes("CASH")) {
    Icon = Banknote;
    cardClass = "from-emerald-500 to-teal-600 shadow-emerald-500/10";
    iconClass = "text-emerald-100";
  } else if (
    type.includes("CARD") ||
    type.includes("CREDIT")
  ) {
    Icon = CreditCard;
    cardClass = "from-violet-600 to-fuchsia-600 shadow-violet-500/10";
    iconClass = "text-violet-100";
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border-0",
        "bg-gradient-to-br text-white shadow-lg",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        cardClass,
      )}
    >
      {/* Decorative shapes */}
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />

      <div className="absolute -bottom-14 -left-10 size-28 rounded-full bg-black/5" />

      <CardContent className="relative p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <Icon className={cn("size-5", iconClass)} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {account.accountName}
              </p>

              <p className="mt-0.5 truncate text-[11px] text-white/70">
                {accountType}
              </p>
            </div>
          </div>

          <Badge
            className={cn(
              "shrink-0 border-0 bg-white/15 text-[10px] text-white",
              account.status === "ACTIVE"
                ? "text-emerald-50"
                : "text-white/70",
            )}
          >
            {account.status}
          </Badge>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/65">
            Current Balance
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight sm:text-[26px]">
            {money(account.currentBalance)}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
          <div className="min-w-0">
            <p className="text-[10px] text-white/55">Opening Balance</p>
            <p className="mt-0.5 text-xs font-medium text-white/85">
              {money(account.openingBalance)}
            </p>
          </div>

          {account.accountNumber && (
            <div className="min-w-0 text-right">
              <p className="text-[10px] text-white/55">Account No.</p>
              <p className="mt-0.5 max-w-28 truncate text-xs font-medium text-white/85">
                {account.accountNumber}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Main Financial Account Page                        */
/* -------------------------------------------------------------------------- */

export function FinancialAccountPageClient() {
  const [search, setSearch] = useState("");
  const [accountType, setAccountType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IFinancialAccount | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<IFinancialAccount | null>(null);
  // const [viewing, setViewing] = useState<IFinancialAccount | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);  /* ------------------------------------------------------------------------ */
  /*                                  Query                                   */
  /* ------------------------------------------------------------------------ */

  const query = useMemo(
    () => ({
      page,
      limit,
      searchTerm: search || undefined,
      accountType:
        accountType === "ALL" ? undefined : (accountType as never),
      status: status === "ALL" ? undefined : (status as never),
      sort,
    }),
    [page, limit, search, accountType, status, sort],
  );
  const ownerName = (owner: IFinancialAccount["ownerId"]) => {
    if (!owner) return "—";
    if (typeof owner === "string") return owner;
    return `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim() || "—";
  };
  const list = useFinancialAccounts(query);
  const deleteMutation = useDeleteFinancialAccount();

  const rows = list.data?.data ?? [];
  const viewing = rows.find((row) => row._id === viewingId) ?? null;
  const meta = list.data?.meta;

  const summary = useFinancialAccountSummary();
  const stats = summary.data?.data;

  const totalBalance = rows.reduce(
    (sum, row) => sum + row.openingBalance,
    0,
  );

  const activeCount = rows.filter(
    (row) => row.status === "ACTIVE",
  ).length;

  /* ------------------------------------------------------------------------ */
  /*                                Handlers                                  */
  /* ------------------------------------------------------------------------ */

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
      await deleteMutation.mutateAsync({
        id: deleteTarget._id,
      });

      toast.success("Financial account deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete financial account.",
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                  Render                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="flex flex-col gap-6">
      {/* ------------------------------------------------------------------ */}
      {/*                              Dialogs                               */}
      {/* ------------------------------------------------------------------ */}

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
      <FinancialAccountDetailsSheet
        account={viewing}
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewingId(null)}
        onEdit={openEdit}
      />
      {/* ------------------------------------------------------------------ */}
      {/*                              Header                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Financial Accounts
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage cash, bank, and mobile banking accounts.
          </p>
        </div>

        <Button
          className="w-full cursor-pointer bg-indigo-600 text-white transition-all hover:scale-[1.02] hover:bg-indigo-500 sm:w-auto"
          onClick={openCreate}
        >
          <Plus />
          Add Account
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*                         Summary Statistics                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Current Balance"
          value={money(stats?.totalCurrentBalance)}
          caption="Current balance across accounts"
          icon={Wallet}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/20"
          iconClassName="text-blue-100"
        />

        <StatCard
          title="Total Accounts"
          value={String(meta?.total ?? rows.length)}
          caption="All financial accounts"
          icon={WalletCards}
          className="bg-gradient-to-br from-violet-600 to-purple-600 shadow-violet-500/20"
          iconClassName="text-violet-100"
        />

        <StatCard
          title="Active Accounts"
          value={String(activeCount)}
          caption="Currently active accounts"
          icon={Landmark}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
          iconClassName="text-emerald-100"
        />

        <StatCard
          title="Total Opening Balance"
          value={money(totalBalance)}
          caption="Opening balance on this page"
          icon={Banknote}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
          iconClassName="text-cyan-100"
        />

      </div>

      {/* ------------------------------------------------------------------ */}
      {/*                    Individual Account Balances                     */}
      {/* ------------------------------------------------------------------ */}

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Account Balances
              </h2>

              <p className="text-xs text-muted-foreground">
                Current balance of your financial accounts
              </p>
            </div>

            <Badge variant="outline" className="hidden sm:flex">
              {rows.length} shown
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rows.map((account) => (
              <AccountBalanceCard
                key={account._id}
                account={account}
              />
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*                              Filters                               */}
      {/* ------------------------------------------------------------------ */}

      <Card className="overflow-hidden border bg-slate-100/70 p-0 dark:bg-slate-950">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 px-4 pb-3 pt-5 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="h-10 pl-9"
                placeholder="Search by account name, number..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Account Type */}
            <Select
              value={accountType}
              onValueChange={(value) => {
                setAccountType(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-full lg:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>

                {ACCOUNT_TYPE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-full lg:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>

                {ACCOUNT_STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-full lg:w-44">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {FINANCIAL_ACCOUNT_SORT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/*                              Table                               */}
          {/* ---------------------------------------------------------------- */}

          {list.isError ? (
            <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {list.error instanceof Error
                ? list.error.message
                : "Unable to load accounts."}
            </div>
          ) : list.isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-14 w-full"
                />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="m-4 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
              <WalletCards className="text-muted-foreground" />

              <div>
                <p className="font-medium">
                  No financial accounts found
                </p>

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
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b bg-indigo-600 text-left text-xs text-white">
                    <th className="p-3 font-medium">Account</th>
                    <th className="p-3 font-medium">Type</th>
                    <th className="p-3 font-medium">Owner</th>
                    <th className="p-3 font-medium">Number</th>
                    <th className="p-3 font-medium">
                      Opening Balance
                    </th>
                    <th className="p-3 font-medium">
                      Current Balance
                    </th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((account) => (
                    <tr
                      key={account._id}
                      className="border-b transition-colors last:border-0 hover:bg-muted/30"
                    >
                      {/* Account */}
                      <td className="p-3">
                        <p className="font-medium">
                          {account.accountName}
                        </p>

                        {account.accountHolderName && (
                          <p className="text-xs text-muted-foreground">
                            {account.accountHolderName}
                          </p>
                        )}
                      </td>

                      {/* Type */}
                      <td className="p-3">
                        <Badge variant="outline">
                          {ACCOUNT_TYPE_OPTIONS.find(
                            (o) =>
                              o.value === account.accountType,
                          )?.label ?? account.accountType}
                        </Badge>
                      </td>
                      <td className="p-3">{ownerName(account.ownerId)}</td>
                      {/* Number */}
                      <td className="p-3 text-muted-foreground">
                        {account.accountNumber || "—"}
                      </td>

                      {/* Opening Balance */}
                      <td className="p-3 font-medium">
                        {money(account.openingBalance)}
                      </td>

                      {/* Current Balance */}
                      <td className="p-3">
                        <span
                          className={cn(
                            "font-semibold",
                            account.currentBalance >= 0
                              ? "text-emerald-600"
                              : "text-red-600",
                          )}
                        >
                          {money(account.currentBalance)}
                        </span>
                      </td>

                      {/* Status */}
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

                      {/* Actions */}
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewingId(account._id)}
                            aria-label="View account details"
                          >
                            <Eye />
                          </Button>

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
                            onClick={() =>
                              setDeleteTarget(account)
                            }
                            aria-label="Delete account"
                            className="transition hover:scale-[1.02]"
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

          {/* ---------------------------------------------------------------- */}
          {/*                            Pagination                            */}
          {/* ---------------------------------------------------------------- */}

          <div className="flex flex-col justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
            <span>
              Showing{" "}
              {rows.length
                ? (page - 1) * limit + 1
                : 0}{" "}
              to{" "}
              {Math.min(
                page * limit,
                meta?.total ?? rows.length,
              )}{" "}
              of {meta?.total ?? rows.length} results
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
                    <SelectItem
                      key={value}
                      value={String(value)}
                    >
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
                disabled={
                  page >= (meta?.totalPage ?? 1)
                }
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