// "use client";

// import { useMemo, useState } from "react";
// import { toast } from "sonner";
// import {
//   ArrowLeft,
//   ArrowRight,
//   CalendarDays,
//   CheckCircle2,
//   CircleDollarSign,
//   Eye,
//   FileText,
//   Landmark,
//   Search,
//   Trash,
//   Users,
//   WalletCards,
// } from "lucide-react";
// import {
//   useCreateSalaryPayment,
//   useGenerateMonthlySalary,
//   useMoveTeamSalaryToTrash,
//   useSalarySummary,
//   useTeamSalaries,
// } from "@/features/team-salary/hooks/use-team-salary";
// import {
//   createSalaryPaymentSchema,
//   generateMonthlySalarySchema,
// } from "@/features/team-salary/schemas/team-salary.schema";
// import {
//   getSalaryEmployee,
//   TEAM_SALARY_MONTH_OPTIONS,
//   TEAM_SALARY_PAYMENT_METHOD_OPTIONS,
//   TEAM_SALARY_SORT_OPTIONS,
//   TEAM_SALARY_STATUS_OPTIONS,
// } from "@/features/team-salary/constants/team-salary.constant";
// import {
//   canRecordSalaryPayment,
//   formatSalaryAmount,
//   getPayrollPeriodLabel,
//   getSalaryEmployeeInitials,
//   getSalaryEmployeeName,
//   getSalaryPaymentMethodLabel,
//   getSalaryPaymentPercentage,
//   getSalaryStatusConfig,
// } from "@/features/team-salary/utils/team-salary.utils";
// import {
//   SalaryPaymentStatus,
//   type ITeamSalary,
// } from "@/types/team-salary.types";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { SalaryFormDialog } from "./salary-form-dialog";
// import { useFinancialAccounts } from "@/features/financial-account/hooks/use-financial-account";

// const years = Array.from(
//   { length: 5 },
//   (_, i) => new Date().getFullYear() - 2 + i,
// );
// const money = (value?: number) => formatSalaryAmount(value);

// function StatCard({
//   title,
//   value,
//   caption,
//   icon: Icon,
//   tone,
// }: {
//   title: string;
//   value: string;
//   caption: string;
//   icon: typeof WalletCards;
//   tone: string;
// }) {
//   return (
//     <Card className="rounded-xl border-0 bg-linear-to-br bg-gray-100 dark:bg-slate-900 ease-in-out duration-500 transform hover:bg-slate-950 hover:scale-105 shadow-sm overflow-hidden transition-shadow hover:-translate-y-0.5 hover:shadow-md">
//       <CardContent className="flex items-center gap-3 p-4">
//         <div
//           className={cn(
//             "flex size-11 shrink-0 items-center justify-center rounded-xl",
//             tone,
//           )}
//         >
//           <Icon />
//         </div>
//         <div className="min-w-0">
//           <p className="text-xs text-muted-foreground">{title}</p>
//           <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
//           <p className="truncate text-xs text-muted-foreground">{caption}</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function StatusBadge({ status }: { status: SalaryPaymentStatus }) {
//   const config = getSalaryStatusConfig(status);
//   return (
//     <Badge
//       variant="outline"
//       className={cn("gap-1 font-medium", config.className)}
//     >
//       <config.icon />
//       {config.label}
//     </Badge>
//   );
// }

// function SalaryDetails({
//   salary,
//   open,
//   onOpenChange,
//   onAddPayment,
// }: {
//   salary: ITeamSalary | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onAddPayment: () => void;
// }) {
//   const employee = salary ? getSalaryEmployee(salary) : null;
//   const trashMutation = useMoveTeamSalaryToTrash();
//   const moveToTrash = async () => {
//     if (!salary) return;
//     try {
//       await trashMutation.mutateAsync({
//         id: salary._id,
//       });
//       toast.success("Salary record moved to trash.");
//       onOpenChange(false);
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Unable to move salary record to trash.",
//       );
//     }
//   };
//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
//         <SheetHeader className="border-b pb-4">
//           <SheetTitle>Salary Details</SheetTitle>
//           <SheetDescription>
//             {salary
//               ? getPayrollPeriodLabel(salary.month, salary.year)
//               : "Payroll record details"}
//           </SheetDescription>
//         </SheetHeader>
//         {salary && (
//           <div className="flex flex-col gap-5 p-5">
//             <div className="flex items-center gap-3">
//               <Avatar className="size-12">
//                 <AvatarImage
//                   src={employee?.avatar}
//                   alt={getSalaryEmployeeName(salary)}
//                 />
//                 <AvatarFallback>
//                   {getSalaryEmployeeInitials(salary)}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="min-w-0 flex-1">
//                 <p className="font-semibold">{getSalaryEmployeeName(salary)}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {employee?.designation ||
//                     employee?.department ||
//                     employee?.email ||
//                     "Team member"}
//                 </p>
//               </div>
//               <StatusBadge status={salary.status} />
//             </div>
//             <Card>
//               <CardContent className="grid gap-3 p-4 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Salary amount</span>
//                   <span className="font-medium">
//                     {money(salary.salaryAmount)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Paid amount</span>
//                   <span className="font-medium text-emerald-600">
//                     {money(salary.paidAmount)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Due amount</span>
//                   <span className="font-medium text-amber-600">
//                     {money(salary.dueAmount)}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-muted-foreground">Payment method</span>
//                   <span>
//                     {getSalaryPaymentMethodLabel(employee?.paymentMethod)}
//                   </span>
//                 </div>
//                 <Progress value={getSalaryPaymentPercentage(salary)} />
//               </CardContent>
//             </Card>
//             <div className="flex flex-wrap items-center justify-between gap-2">
//               <h3 className="font-semibold">Payment History</h3>
//               <div className="flex items-center gap-2">
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       className="hover:cursor-pointer transition hover:scale-[1.02]"
//                       disabled={trashMutation.isPending}
//                     >
//                       Move to Trash
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>
//                         Move salary record to trash?
//                       </AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This will remove this payroll record from the active
//                         salary list. You can restore it from Trash if needed.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Keep Record</AlertDialogCancel>
//                       <AlertDialogAction
//                         variant="destructive"
//                         onClick={moveToTrash}
//                         className="hover:cursor-pointer"
//                       >
//                         Move to Trash
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//                 <Button
//                   size="sm"
//                   onClick={onAddPayment}
//                   disabled={!canRecordSalaryPayment(salary)}
//                   className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
//                 >
//                   + Add Payment
//                 </Button>
//               </div>
//             </div>
//             {salary.payments.length ? (
//               <div className="flex flex-col gap-3">
//                 {salary.payments.map((payment, index) => (
//                   <Card key={payment._id ?? index}>
//                     <CardContent className="flex items-start gap-3 p-4">
//                       <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                         <Landmark />
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <div className="flex justify-between gap-3">
//                           <p className="font-semibold">
//                             {money(payment.amount)}
//                           </p>
//                           <p className="text-xs text-muted-foreground">
//                             {new Date(payment.paymentDate).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                           {getSalaryPaymentMethodLabel(payment.paymentMethod)}
//                         </p>
//                         {payment.paymentReference && (
//                           <p className="mt-1 text-xs text-muted-foreground">
//                             Ref: {payment.paymentReference}
//                           </p>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-muted-foreground">
//                 No payments recorded for this payroll.
//               </p>
//             )}
//             {salary.note && (
//               <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
//                 {salary.note}
//               </p>
//             )}
//           </div>
//         )}
//       </SheetContent>
//     </Sheet>
//   );
// }

// function PaymentDialog({
//   salary,
//   open,
//   onOpenChange,
// }: {
//   salary: ITeamSalary | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) {
//   const mutation = useCreateSalaryPayment();
//   const accountsQuery = useFinancialAccounts(
//     { limit: 100, status: "ACTIVE" } as any,
//     { enabled: open },
//   );
//   const accounts = accountsQuery.data?.data ?? [];

//   const [form, setForm] = useState({
//     amount: "",
//     financialAccountId: "",
//     paymentMethod: "BANK",
//     paymentDate: new Date().toISOString().slice(0, 10),
//     paymentReference: "",
//     note: "",
//   });

//   const submit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!salary) return;

//     const amount = Number(form.amount);
//     if (amount > salary.dueAmount) {
//       toast.error(
//         `Payment cannot exceed the due amount of ${money(salary.dueAmount)}.`,
//       );
//       return;
//     }

//     const selectedAccount = accounts.find(
//       (a) => a._id === form.financialAccountId,
//     );
//     if (selectedAccount && amount > selectedAccount.currentBalance) {
//       toast.error(
//         `Selected account has only ${money(selectedAccount.currentBalance)}.`,
//       );
//       return;
//     }

//     const parsed = createSalaryPaymentSchema.safeParse({ ...form, amount });
//     if (!parsed.success) {
//       toast.error(
//         parsed.error.issues[0]?.message ?? "Please check the payment details.",
//       );
//       return;
//     }

//     try {
//       await mutation.mutateAsync({ id: salary._id, payload: parsed.data });
//       toast.success("Payment recorded successfully.");
//       setForm((f) => ({ ...f, amount: "", paymentReference: "", note: "" }));
//       onOpenChange(false);
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to record payment.",
//       );
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Payment</DialogTitle>
//           <DialogDescription>
//             Record a payment for{" "}
//             {salary ? getSalaryEmployeeName(salary) : "this employee"}. Due:{" "}
//             {money(salary?.dueAmount)}
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={submit} className="flex flex-col gap-4">
//           <label className="grid gap-2 text-sm font-medium">
//             Pay from account
//             <Select
//               value={form.financialAccountId}
//               onValueChange={(value) =>
//                 setForm({ ...form, financialAccountId: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue
//                   placeholder={
//                     accountsQuery.isLoading ? "Loading..." : "Select account"
//                   }
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 {accounts.map((account) => (
//                   <SelectItem key={account._id} value={account._id}>
//                     {account.accountName} ({money(account.currentBalance)})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </label>

//           <div className="grid gap-4 sm:grid-cols-2">
//             <label className="grid gap-2 text-sm font-medium">
//               Amount
//               <Input
//                 type="number"
//                 min="1"
//                 max={salary?.dueAmount}
//                 value={form.amount}
//                 onChange={(e) => setForm({ ...form, amount: e.target.value })}
//                 required
//               />
//             </label>
//             <label className="grid gap-2 text-sm font-medium">
//               Payment method
//               <Select
//                 value={form.paymentMethod}
//                 onValueChange={(value) =>
//                   setForm({ ...form, paymentMethod: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {TEAM_SALARY_PAYMENT_METHOD_OPTIONS.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </label>
//           </div>
//           <label className="grid gap-2 text-sm font-medium">
//             Payment date
//             <Input
//               type="date"
//               value={form.paymentDate}
//               onChange={(e) =>
//                 setForm({ ...form, paymentDate: e.target.value })
//               }
//               required
//             />
//           </label>
//           <label className="grid gap-2 text-sm font-medium">
//             Reference
//             <Input
//               value={form.paymentReference}
//               onChange={(e) =>
//                 setForm({ ...form, paymentReference: e.target.value })
//               }
//               placeholder="Transaction reference"
//             />
//           </label>
//           <label className="grid gap-2 text-sm font-medium">
//             Note
//             <Textarea
//               value={form.note}
//               onChange={(e) => setForm({ ...form, note: e.target.value })}
//               placeholder="Optional note"
//             />
//           </label>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={mutation.isPending}
//               className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
//             >
//               {mutation.isPending ? "Recording..." : "Record Payment"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function GenerateDialog({
//   month,
//   year,
//   open,
//   onOpenChange,
// }: {
//   month: number;
//   year: number;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) {
//   const mutation = useGenerateMonthlySalary();
//   const [note, setNote] = useState("");
//   const submit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     const parsed = generateMonthlySalarySchema.safeParse({
//       month,
//       year,
//       note: note || undefined,
//     });
//     if (!parsed.success) {
//       toast.error(
//         parsed.error.issues[0]?.message ?? "Please check the payroll details.",
//       );
//       return;
//     }
//     try {
//       await mutation.mutateAsync(parsed.data);
//       toast.success("Monthly payroll generated successfully.");
//       onOpenChange(false);
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error.message : "Failed to generate payroll.",
//       );
//     }
//   };
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Generate Monthly Payroll</DialogTitle>
//           <DialogDescription>
//             Create salary records for active employees for{" "}
//             {getPayrollPeriodLabel(month, year)}.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={submit} className="flex flex-col gap-4">
//           <label className="grid gap-2 text-sm font-medium">
//             Note
//             <Textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               placeholder="Optional payroll note"
//             />
//           </label>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={mutation.isPending} className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500">
//               {mutation.isPending ? "Generating..." : "Generate Payroll"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export function TeamSalaryPageClient() {
//   const now = new Date();
//   const [month, setMonth] = useState(now.getMonth() + 1);
//   const [year, setYear] = useState(now.getFullYear());
//   const [createSalaryOpen, setCreateSalaryOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("ALL");
//   const [method, setMethod] = useState("ALL");
//   const [sort, setSort] = useState("-createdAt");
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [selected, setSelected] = useState<ITeamSalary | null>(null);
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [generateOpen, setGenerateOpen] = useState(false);
//   const query = useMemo(
//     () => ({
//       month,
//       year,
//       page,
//       limit,
//       searchTerm: search || undefined,
//       status: status === "ALL" ? undefined : (status as SalaryPaymentStatus),
//       paymentMethod: method === "ALL" ? undefined : method,
//       sort,
//     }),
//     [month, year, page, limit, search, status, method, sort],
//   );
//   const list = useTeamSalaries(query);
//   const summary = useSalarySummary({
//     month,
//     year,
//     status: status === "ALL" ? undefined : (status as SalaryPaymentStatus),
//   });
//   const rows = list.data?.data ?? [];
//   const meta = list.data?.meta;
//   const stats = summary.data?.data;
//   const trashMutation = useMoveTeamSalaryToTrash();
//   const moveToTrash = async () => {
//     if (!selected) return;
//     try {
//       await trashMutation.mutateAsync({
//         id: selected._id,
//       });
//       toast.success("Salary record moved to trash.");
//       setDetailsOpen(false);
//     } catch (error) {
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Unable to move salary record to trash.",
//       );
//     }
//   };

//   const openDetails = (salary: ITeamSalary) => {
//     setSelected(salary);
//     setDetailsOpen(true);
//   };
//   const changeMonth = (delta: number) => {
//     const date = new Date(year, month - 1 + delta, 1);
//     setMonth(date.getMonth() + 1);
//     setYear(date.getFullYear());
//     setPage(1);
//   };
//   return (
//     <div className="flex flex-col gap-6">
//       <SalaryFormDialog
//         open={createSalaryOpen}
//         onOpenChange={setCreateSalaryOpen}
//         month={month}
//         year={year}
//       />
//       <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight">
//             Team Salary Management
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Manage monthly payroll, payments and outstanding dues.
//           </p>
//         </div>
//         <div className="flex flex-wrap items-center gap-2">
//           <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
//             <ArrowLeft />
//           </Button>
//           <Select
//             value={String(month)}
//             onValueChange={(value) => {
//               setMonth(Number(value));
//               setPage(1);
//             }}
//           >
//             <SelectTrigger className="w-32">
//               <CalendarDays />
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {TEAM_SALARY_MONTH_OPTIONS.map((option) => (
//                 <SelectItem key={option.value} value={String(option.value)}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select
//             value={String(year)}
//             onValueChange={(value) => {
//               setYear(Number(value));
//               setPage(1);
//             }}
//           >
//             <SelectTrigger className="w-24">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {years.map((value) => (
//                 <SelectItem key={value} value={String(value)}>
//                   {value}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
//             <ArrowRight />
//           </Button>
//           <Button
//             className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
//             onClick={() => setCreateSalaryOpen(true)}
//           >
//             Create Salary
//           </Button>
//           <Button
//             className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500 ml-1"
//             onClick={() => setGenerateOpen(true)}
//           >
//             <FileText />
//             Generate Payroll
//           </Button>
//         </div>
//       </div>
//       <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
//         <StatCard
//           title="Total Payroll"
//           value={money(stats?.totalSalary)}
//           caption="Total this month"
//           icon={WalletCards}
//           tone="bg-primary/10 text-primary"
//         />
//         <StatCard
//           title="Total Paid"
//           value={money(stats?.totalPaid)}
//           caption={`${stats?.totalSalary ? Math.round((stats.totalPaid / stats.totalSalary) * 100) : 0}% of total payroll`}
//           icon={CircleDollarSign}
//           tone="bg-emerald-500/10 text-emerald-600"
//         />
//         <StatCard
//           title="Total Due"
//           value={money(stats?.totalDue)}
//           caption="Remaining to pay"
//           icon={FileText}
//           tone="bg-amber-500/10 text-amber-600"
//         />
//         <StatCard
//           title="Employees"
//           value={String(stats?.totalRecords ?? 0)}
//           caption="Total employees"
//           icon={Users}
//           tone="bg-blue-500/10 text-blue-600"
//         />
//         <StatCard
//           title="Overdue"
//           value={String(stats?.pendingCount ?? 0)}
//           caption="Pending payments"
//           icon={CheckCircle2}
//           tone="bg-rose-500/10 text-rose-600"
//         />
//       </div>
//       <Card className="bg-slate-100 dark:bg-slate-950 p-0">
//         <CardContent className="flex flex-col gap-4 p-0">
//           <div className="pt-5 pb-2 px-4 flex flex-col gap-3 lg:flex-row lg:items-center">
//             <div className="relative min-w-0 flex-1">
//               <Search className="absolute left-3 w-5 h-5 top-1.5 text-muted-foreground" />
//               <Input
//                 className="pl-9 py-2"
//                 placeholder="Search employee by name, email..."
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//               />
//             </div>
//             <Select
//               value={status}
//               onValueChange={(value) => {
//                 setStatus(value);
//                 setPage(1);
//               }}
//             >
//               <SelectTrigger className="w-full lg:w-36">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">All Status</SelectItem>
//                 {TEAM_SALARY_STATUS_OPTIONS.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select
//               value={method}
//               onValueChange={(value) => {
//                 setMethod(value);
//                 setPage(1);
//               }}
//             >
//               <SelectTrigger className="w-full lg:w-36">
//                 <SelectValue placeholder="Method" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="ALL">All Method</SelectItem>
//                 {TEAM_SALARY_PAYMENT_METHOD_OPTIONS.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select value={sort} onValueChange={setSort}>
//               <SelectTrigger className="w-full lg:w-40">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {TEAM_SALARY_SORT_OPTIONS.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           {list.isError ? (
//             <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
//               {list.error instanceof Error
//                 ? list.error.message
//                 : "Unable to load salary records."}
//             </div>
//           ) : list.isLoading ? (
//             <div className="flex flex-col gap-3">
//               {Array.from({ length: 6 }).map((_, index) => (
//                 <Skeleton key={index} className="h-14 w-full" />
//               ))}
//             </div>
//           ) : rows.length === 0 ? (
//             <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center">
//               <WalletCards className="text-muted-foreground" />
//               <div>
//                 <p className="font-medium">No salary records found</p>
//                 <p className="text-sm text-muted-foreground">
//                   Try changing the month, filters, or search terms.
//                 </p>
//               </div>
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   setSearch("");
//                   setStatus("ALL");
//                   setMethod("ALL");
//                 }}
//               >
//                 Clear filters
//               </Button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-190 text-sm">
//                 <thead>
//                   <tr className="hover:bg-cyan-800 *:text-white bg-indigo-600 rounded-xl border-b text-left text-xs">
//                     <th className="p-3 font-medium">Employee</th>
//                     <th className="p-3 font-medium">Salary</th>
//                     <th className="p-3 font-medium">Paid</th>
//                     <th className="p-3 font-medium">Due</th>
//                     <th className="p-3 font-medium">Status</th>
//                     <th className="p-3 font-medium">Paid %</th>
//                     <th className="p-3 text-right font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((salary) => {
//                     const employee = getSalaryEmployee(salary);
//                     return (
//                       <tr
//                         key={salary._id}
//                         className="border-b last:border-0 hover:bg-muted/30"
//                       >
//                         <td className="p-3">
//                           <div className="flex items-center gap-3">
//                             <Avatar className="size-9">
//                               <AvatarImage
//                                 src={employee?.avatar}
//                                 alt={getSalaryEmployeeName(salary)}
//                               />
//                               <AvatarFallback>
//                                 {getSalaryEmployeeInitials(salary)}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <p className="font-medium">
//                                 {getSalaryEmployeeName(salary)}
//                               </p>
//                               <p className="text-xs text-muted-foreground">
//                                 {employee?.designation ||
//                                   employee?.email ||
//                                   "Team member"}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-3 font-medium">
//                           {money(salary.salaryAmount)}
//                         </td>
//                         <td className="p-3 text-emerald-600">
//                           {money(salary.paidAmount)}
//                         </td>
//                         <td className="p-3 text-amber-600">
//                           {money(salary.dueAmount)}
//                         </td>
//                         <td className="p-3">
//                           <StatusBadge status={salary.status} />
//                         </td>
//                         <td className="p-3">
//                           <div className="flex min-w-20 items-center gap-2">
//                             <span className="text-xs">
//                               {getSalaryPaymentPercentage(salary)}%
//                             </span>
//                             <Progress
//                               value={getSalaryPaymentPercentage(salary)}
//                             />
//                           </div>
//                         </td>
//                         <td className="p-3">
//                           <div className="flex justify-end gap-1">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => openDetails(salary)}
//                               aria-label="View salary details"
//                             >
//                               <Eye />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => {
//                                 setSelected(salary);
//                                 setPaymentOpen(true);
//                               }}
//                               disabled={!canRecordSalaryPayment(salary)}
//                               aria-label="Add payment"
//                             >
//                               <CircleDollarSign />
//                             </Button>
//                             {/* <Button
//                               variant="ghost"
//                               size="icon"
//                               aria-label="More salary actions"
//                             >
//                               <MoreHorizontal />
//                             </Button> */}

//                             <AlertDialog>
//                               <AlertDialogTrigger asChild>
//                                 <Button
//                                   size="sm"
//                                   variant="destructive"
//                                   className="hover:cursor-pointer transition hover:scale-[1.02]"
//                                   disabled={trashMutation.isPending}
//                                 >
//                                   <Trash />
//                                 </Button>
//                               </AlertDialogTrigger>
//                               <AlertDialogContent>
//                                 <AlertDialogHeader>
//                                   <AlertDialogTitle>
//                                     Move salary record to trash?
//                                   </AlertDialogTitle>
//                                   <AlertDialogDescription>
//                                     This will remove this payroll record from
//                                     the active salary list. You can restore it
//                                     from Trash if needed.
//                                   </AlertDialogDescription>
//                                 </AlertDialogHeader>
//                                 <AlertDialogFooter>
//                                   <AlertDialogCancel>
//                                     Keep Record
//                                   </AlertDialogCancel>
//                                   <AlertDialogAction
//                                     variant="destructive"
//                                     onClick={moveToTrash}
//                                     className="hover:cursor-pointer"
//                                   >
//                                     Move to Trash
//                                   </AlertDialogAction>
//                                 </AlertDialogFooter>
//                               </AlertDialogContent>
//                             </AlertDialog>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//           <div className=" pt-3 pb-2 px-4 flex flex-col justify-between gap-3 border-t text-sm text-muted-foreground sm:flex-row sm:items-center">
//             <span>
//               Showing {rows.length ? (page - 1) * limit + 1 : 0} to{" "}
//               {Math.min(page * limit, meta?.total ?? rows.length)} of{" "}
//               {meta?.total ?? rows.length} results
//             </span>
//             <div className="flex items-center gap-2">
//               <Select
//                 value={String(limit)}
//                 onValueChange={(value) => {
//                   setLimit(Number(value));
//                   setPage(1);
//                 }}
//               >
//                 <SelectTrigger className="w-24">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {[10, 20, 30, 50].map((value) => (
//                     <SelectItem key={value} value={String(value)}>
//                       {value} / page
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 disabled={page <= 1}
//                 onClick={() => setPage(page - 1)}
//               >
//                 <ArrowLeft />
//               </Button>
//               <span>
//                 {page} / {meta?.totalPage ?? 1}
//               </span>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 disabled={page >= (meta?.totalPage ?? 1)}
//                 onClick={() => setPage(page + 1)}
//               >
//                 <ArrowRight />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       <SalaryDetails
//         salary={selected}
//         open={detailsOpen}
//         onOpenChange={setDetailsOpen}
//         onAddPayment={() => {
//           setDetailsOpen(false);
//           setPaymentOpen(true);
//         }}
//       />
//       <PaymentDialog
//         salary={selected}
//         open={paymentOpen}
//         onOpenChange={setPaymentOpen}
//       />
//       <GenerateDialog
//         month={month}
//         year={year}
//         open={generateOpen}
//         onOpenChange={setGenerateOpen}
//       />
//     </div>
//   );
// }

// export default TeamSalaryPageClient;


"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  FileText,
  Landmark,
  Search,
  Trash,
  Users,
  WalletCards,
} from "lucide-react";
import {
  useCreateSalaryPayment,
  useGenerateMonthlySalary,
  useMoveTeamSalaryToTrash,
  useSalarySummary,
  useTeamSalaries,
} from "@/features/team-salary/hooks/use-team-salary";
import {
  createSalaryPaymentSchema,
  generateMonthlySalarySchema,
} from "@/features/team-salary/schemas/team-salary.schema";
import {
  getSalaryEmployee,
  TEAM_SALARY_MONTH_OPTIONS,
  TEAM_SALARY_PAYMENT_METHOD_OPTIONS,
  TEAM_SALARY_SORT_OPTIONS,
  TEAM_SALARY_STATUS_OPTIONS,
} from "@/features/team-salary/constants/team-salary.constant";
import {
  canRecordSalaryPayment,
  formatSalaryAmount,
  getPayrollPeriodLabel,
  getSalaryEmployeeInitials,
  getSalaryEmployeeName,
  getSalaryPaymentMethodLabel,
  getSalaryStatusConfig,
} from "@/features/team-salary/utils/team-salary.utils";
import {
  getSalaryTotal,
  SalaryPaymentStatus,
  type ITeamSalary,
} from "@/types/team-salary.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SalaryFormDialog } from "./salary-form-dialog";
import { useFinancialAccounts } from "@/features/financial-account/hooks/use-financial-account";

const years = Array.from(
  { length: 5 },
  (_, i) => new Date().getFullYear() - 2 + i,
);
const money = (value?: number) => formatSalaryAmount(value);

// Paid % ekhon total (salary + extra) er opor based
const getPaidPercent = (salary: ITeamSalary) => {
  const total = getSalaryTotal(salary);
  if (!total) return 0;
  return Math.min(100, Math.round((salary.paidAmount / total) * 100));
};

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
    <Card className="rounded-xl border-0 bg-linear-to-br bg-gray-100 dark:bg-slate-900 ease-in-out duration-500 transform hover:bg-slate-950 hover:scale-105 shadow-sm overflow-hidden transition-shadow hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            tone,
          )}
        >
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

function StatusBadge({ status }: { status: SalaryPaymentStatus }) {
  const config = getSalaryStatusConfig(status);
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 font-medium", config.className)}
    >
      <config.icon />
      {config.label}
    </Badge>
  );
}

function SalaryDetails({
  salary,
  open,
  onOpenChange,
  onAddPayment,
}: {
  salary: ITeamSalary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment: () => void;
}) {
  const employee = salary ? getSalaryEmployee(salary) : null;
  const trashMutation = useMoveTeamSalaryToTrash();
  const extraAmount = Number(salary?.extraAmount ?? 0);
  const moveToTrash = async () => {
    if (!salary) return;
    try {
      await trashMutation.mutateAsync({
        id: salary._id,
      });
      toast.success("Salary record moved to trash.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to move salary record to trash.",
      );
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Salary Details</SheetTitle>
          <SheetDescription>
            {salary
              ? getPayrollPeriodLabel(salary.month, salary.year)
              : "Payroll record details"}
          </SheetDescription>
        </SheetHeader>
        {salary && (
          <div className="flex flex-col gap-5 p-5">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage
                  src={employee?.avatar}
                  alt={getSalaryEmployeeName(salary)}
                />
                <AvatarFallback>
                  {getSalaryEmployeeInitials(salary)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{getSalaryEmployeeName(salary)}</p>
                <p className="text-sm text-muted-foreground">
                  {employee?.designation ||
                    employee?.department ||
                    employee?.email ||
                    "Team member"}
                </p>
              </div>
              <StatusBadge status={salary.status} />
            </div>
            <Card>
              <CardContent className="grid gap-3 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base salary</span>
                  <span className="font-medium">
                    {money(salary.salaryAmount)}
                  </span>
                </div>
                {extraAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Extra{salary.extraName ? ` (${salary.extraName})` : ""}
                    </span>
                    <span className="font-medium text-indigo-600">
                      + {money(extraAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Total amount</span>
                  <span className="font-semibold">
                    {money(getSalaryTotal(salary))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid amount</span>
                  <span className="font-medium text-emerald-600">
                    {money(salary.paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due amount</span>
                  <span className="font-medium text-amber-600">
                    {money(salary.dueAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment method</span>
                  <span>
                    {getSalaryPaymentMethodLabel(employee?.paymentMethod)}
                  </span>
                </div>
                <Progress value={getPaidPercent(salary)} />
              </CardContent>
            </Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Payment History</h3>
              <div className="flex items-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="hover:cursor-pointer transition hover:scale-[1.02]"
                      disabled={trashMutation.isPending}
                    >
                      Move to Trash
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Move salary record to trash?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove this payroll record from the active
                        salary list. You can restore it from Trash if needed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Record</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={moveToTrash}
                        className="hover:cursor-pointer"
                      >
                        Move to Trash
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  size="sm"
                  onClick={onAddPayment}
                  disabled={!canRecordSalaryPayment(salary)}
                  className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
                >
                  + Add Payment
                </Button>
              </div>
            </div>
            {salary.payments.length ? (
              <div className="flex flex-col gap-3">
                {salary.payments.map((payment, index) => (
                  <Card key={payment._id ?? index}>
                    <CardContent className="flex items-start gap-3 p-4">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Landmark />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <p className="font-semibold">
                            {money(payment.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getSalaryPaymentMethodLabel(payment.paymentMethod)}
                        </p>
                        {payment.paymentReference && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Ref: {payment.paymentReference}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payments recorded for this payroll.
              </p>
            )}
            {salary.note && (
              <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                {salary.note}
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function PaymentDialog({
  salary,
  open,
  onOpenChange,
}: {
  salary: ITeamSalary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useCreateSalaryPayment();
  const accountsQuery = useFinancialAccounts(
    { limit: 100, status: "ACTIVE" } as any,
    { enabled: open },
  );
  const accounts = accountsQuery.data?.data ?? [];

  const [form, setForm] = useState({
    amount: "",
    financialAccountId: "",
    paymentMethod: "BANK",
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentReference: "",
    note: "",
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!salary) return;

    const amount = Number(form.amount);
    if (amount > salary.dueAmount) {
      toast.error(
        `Payment cannot exceed the due amount of ${money(salary.dueAmount)}.`,
      );
      return;
    }

    const selectedAccount = accounts.find(
      (a) => a._id === form.financialAccountId,
    );
    if (selectedAccount && amount > selectedAccount.currentBalance) {
      toast.error(
        `Selected account has only ${money(selectedAccount.currentBalance)}.`,
      );
      return;
    }

    const parsed = createSalaryPaymentSchema.safeParse({ ...form, amount });
    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Please check the payment details.",
      );
      return;
    }

    try {
      await mutation.mutateAsync({ id: salary._id, payload: parsed.data });
      toast.success("Payment recorded successfully.");
      setForm((f) => ({ ...f, amount: "", paymentReference: "", note: "" }));
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to record payment.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Record a payment for{" "}
            {salary ? getSalaryEmployeeName(salary) : "this employee"}. Total:{" "}
            {salary ? money(getSalaryTotal(salary)) : "-"} · Due:{" "}
            {money(salary?.dueAmount)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Pay from account
            <Select
              value={form.financialAccountId}
              onValueChange={(value) =>
                setForm({ ...form, financialAccountId: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    accountsQuery.isLoading ? "Loading..." : "Select account"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account._id} value={account._id}>
                    {account.accountName} ({money(account.currentBalance)})
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
                max={salary?.dueAmount}
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Payment method
              <Select
                value={form.paymentMethod}
                onValueChange={(value) =>
                  setForm({ ...form, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_SALARY_PAYMENT_METHOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Payment date
            <Input
              type="date"
              value={form.paymentDate}
              onChange={(e) =>
                setForm({ ...form, paymentDate: e.target.value })
              }
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Reference
            <Input
              value={form.paymentReference}
              onChange={(e) =>
                setForm({ ...form, paymentReference: e.target.value })
              }
              placeholder="Transaction reference"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Note
            <Textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Optional note"
            />
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
            >
              {mutation.isPending ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GenerateDialog({
  month,
  year,
  open,
  onOpenChange,
}: {
  month: number;
  year: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useGenerateMonthlySalary();
  const [note, setNote] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = generateMonthlySalarySchema.safeParse({
      month,
      year,
      note: note || undefined,
    });
    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Please check the payroll details.",
      );
      return;
    }
    try {
      await mutation.mutateAsync(parsed.data);
      toast.success("Monthly payroll generated successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate payroll.",
      );
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Monthly Payroll</DialogTitle>
          <DialogDescription>
            Create salary records for active employees for{" "}
            {getPayrollPeriodLabel(month, year)}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Note
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional payroll note"
            />
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
            >
              {mutation.isPending ? "Generating..." : "Generate Payroll"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TeamSalaryPageClient() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [createSalaryOpen, setCreateSalaryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [method, setMethod] = useState("ALL");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<ITeamSalary | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const query = useMemo(
    () => ({
      month,
      year,
      page,
      limit,
      searchTerm: search || undefined,
      status: status === "ALL" ? undefined : (status as SalaryPaymentStatus),
      paymentMethod: method === "ALL" ? undefined : method,
      sort,
    }),
    [month, year, page, limit, search, status, method, sort],
  );
  const list = useTeamSalaries(query);
  const summary = useSalarySummary({
    month,
    year,
    status: status === "ALL" ? undefined : (status as SalaryPaymentStatus),
  });
  const rows = list.data?.data ?? [];
  const meta = list.data?.meta;
  const stats = summary.data?.data;
  const trashMutation = useMoveTeamSalaryToTrash();

  // Row-er nijer record trash hobe (age `selected` use hoto, jeta bug chhilo)
  const moveToTrash = async (salary: ITeamSalary) => {
    try {
      await trashMutation.mutateAsync({
        id: salary._id,
      });
      toast.success("Salary record moved to trash.");
      if (selected?._id === salary._id) setDetailsOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to move salary record to trash.",
      );
    }
  };

  const openDetails = (salary: ITeamSalary) => {
    setSelected(salary);
    setDetailsOpen(true);
  };
  const changeMonth = (delta: number) => {
    const date = new Date(year, month - 1 + delta, 1);
    setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
    setPage(1);
  };
  return (
    <div className="flex flex-col gap-6">
      <SalaryFormDialog
        open={createSalaryOpen}
        onOpenChange={setCreateSalaryOpen}
        month={month}
        year={year}
      />
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Team Salary Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage monthly payroll, payments and outstanding dues.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
            <ArrowLeft />
          </Button>
          <Select
            value={String(month)}
            onValueChange={(value) => {
              setMonth(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <CalendarDays />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEAM_SALARY_MONTH_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(year)}
            onValueChange={(value) => {
              setYear(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
            <ArrowRight />
          </Button>
          <Button
            className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500"
            onClick={() => setCreateSalaryOpen(true)}
          >
            Create Salary
          </Button>
          <Button
            className="cursor-pointer text-white bg-indigo-600 transition hover:scale-[1.02] hover:bg-indigo-500 ml-1"
            onClick={() => setGenerateOpen(true)}
          >
            <FileText />
            Generate Payroll
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Payroll"
          value={money(stats?.totalSalary)}
          caption={
            stats?.totalExtra
              ? `Incl. ${money(stats.totalExtra)} extra`
              : "Total this month"
          }
          icon={WalletCards}
          tone="bg-primary/10 text-primary"
        />
        <StatCard
          title="Total Paid"
          value={money(stats?.totalPaid)}
          caption={`${stats?.totalSalary ? Math.round((stats.totalPaid / stats.totalSalary) * 100) : 0}% of total payroll`}
          icon={CircleDollarSign}
          tone="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          title="Total Due"
          value={money(stats?.totalDue)}
          caption="Remaining to pay"
          icon={FileText}
          tone="bg-amber-500/10 text-amber-600"
        />
        <StatCard
          title="Employees"
          value={String(stats?.totalRecords ?? 0)}
          caption="Total employees"
          icon={Users}
          tone="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          title="Overdue"
          value={String(stats?.pendingCount ?? 0)}
          caption="Pending payments"
          icon={CheckCircle2}
          tone="bg-rose-500/10 text-rose-600"
        />
      </div>
      <Card className="bg-slate-100 dark:bg-slate-950 p-0">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="pt-5 pb-2 px-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 w-5 h-5 top-1.5 text-muted-foreground" />
              <Input
                className="pl-9 py-2"
                placeholder="Search employee by name, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
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
                {TEAM_SALARY_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={method}
              onValueChange={(value) => {
                setMethod(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-36">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Method</SelectItem>
                {TEAM_SALARY_PAYMENT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEAM_SALARY_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {list.isError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {list.error instanceof Error
                ? list.error.message
                : "Unable to load salary records."}
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
                <p className="font-medium">No salary records found</p>
                <p className="text-sm text-muted-foreground">
                  Try changing the month, filters, or search terms.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("ALL");
                  setMethod("ALL");
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
                    <th className="p-3 font-medium">Employee</th>
                    <th className="p-3 font-medium">Salary</th>
                    <th className="p-3 font-medium">Paid</th>
                    <th className="p-3 font-medium">Due</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Paid %</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((salary) => {
                    const employee = getSalaryEmployee(salary);
                    const extraAmount = Number(salary.extraAmount ?? 0);
                    return (
                      <tr
                        key={salary._id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarImage
                                src={employee?.avatar}
                                alt={getSalaryEmployeeName(salary)}
                              />
                              <AvatarFallback>
                                {getSalaryEmployeeInitials(salary)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {getSalaryEmployeeName(salary)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {employee?.designation ||
                                  employee?.email ||
                                  "Team member"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <p className="font-medium">
                            {money(getSalaryTotal(salary))}
                          </p>
                          {extraAmount > 0 && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {money(salary.salaryAmount)} +{" "}
                              <span className="text-indigo-600">
                                {salary.extraName || "Extra"}{" "}
                                {money(extraAmount)}
                              </span>
                            </p>
                          )}
                        </td>
                        <td className="p-3 text-emerald-600">
                          {money(salary.paidAmount)}
                        </td>
                        <td className="p-3 text-amber-600">
                          {money(salary.dueAmount)}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={salary.status} />
                        </td>
                        <td className="p-3">
                          <div className="flex min-w-20 items-center gap-2">
                            <span className="text-xs">
                              {getPaidPercent(salary)}%
                            </span>
                            <Progress value={getPaidPercent(salary)} />
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetails(salary)}
                              aria-label="View salary details"
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelected(salary);
                                setPaymentOpen(true);
                              }}
                              disabled={!canRecordSalaryPayment(salary)}
                              aria-label="Add payment"
                            >
                              <CircleDollarSign />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="hover:cursor-pointer transition hover:scale-[1.02]"
                                  disabled={trashMutation.isPending}
                                >
                                  <Trash />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Move salary record to trash?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove this payroll record from
                                    the active salary list. You can restore it
                                    from Trash if needed.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Keep Record
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    variant="destructive"
                                    onClick={() => moveToTrash(salary)}
                                    className="hover:cursor-pointer"
                                  >
                                    Move to Trash
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className=" pt-3 pb-2 px-4 flex flex-col justify-between gap-3 border-t text-sm text-muted-foreground sm:flex-row sm:items-center">
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
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
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
      <SalaryDetails
        salary={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onAddPayment={() => {
          setDetailsOpen(false);
          setPaymentOpen(true);
        }}
      />
      <PaymentDialog
        salary={selected}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
      />
      <GenerateDialog
        month={month}
        year={year}
        open={generateOpen}
        onOpenChange={setGenerateOpen}
      />
    </div>
  );
}

export default TeamSalaryPageClient;
