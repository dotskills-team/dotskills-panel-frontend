import type { User } from "./user.types";

export enum SalaryPaymentStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export interface ISalaryPayment {
  _id?: string;
  amount: number;
  paymentMethod: string;
      financialAccountId?: string | { _id: string; accountName: string };

  paymentDate: string;
  paymentReference?: string;
  note?: string;
  recordedBy?:
    | Pick<User, "firstName" | "lastName" | "email" | "designation">
    | string;
  createdAt?: string;
}

export interface ITeamSalary {
  _id: string;

  user:
    | Pick<
        User,
        | "_id"
        | "firstName"
        | "lastName"
        | "email"
        | "phone"
        | "role"
        | "designation"
        | "department"
        | "salary"
        | "paymentMethod"
        | "avatar"
      >
    | string;

  month: number;
  year: number;

  salaryAmount: number;
  paidAmount: number;
  dueAmount: number;

  status: SalaryPaymentStatus;

  payments: ISalaryPayment[];

  note?: string;

  cancelledAt?: string;
  cancelledBy?:
    | Pick<User, "firstName" | "lastName" | "email" | "designation">
    | string;
  cancellationReason?: string;

  createdBy?: string | User;
  updatedBy?: string | User;

  createdAt: string;
  updatedAt: string;
}

export interface TeamSalarySummary {
  totalSalary: number;
  totalPaid: number;
  totalDue: number;
  totalRecords: number;
  pendingCount: number;
  partialCount: number;
  paidCount: number;
  cancelledCount: number;
}

export interface GenerateMonthlySalaryPayload {
  month: number;
  year: number;
  note?: string;
}

export interface CreateTeamSalaryPayload {
  user: string;
  month: number;
  year: number;
  note?: string;
}

export interface CreateSalaryPaymentPayload {
  amount: number;
    financialAccountId: string;
  paymentMethod: string;
  paymentDate: string;
  paymentReference?: string;
  note?: string;
}

export interface CancelTeamSalaryPayload {
  reason: string;
}
