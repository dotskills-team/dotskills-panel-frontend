import { ApiResponse } from "./api.types";

export enum ProjectStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DONE_DUE = "DONE_DUE",
  DELIVERED = "DELIVERED",
  PENDING = "PENDING"
}

export enum ProjectType {
  WORDPRESS = "WORDPRESS",
  MERN = "MERN",
  PERN = "PERN",
  NEXT_JS = "NEXT_JS",
  SHOPIFY = "SHOPIFY",
  LARAVEL = "LARAVEL",
  PHP = "PHP",
  MOBILE_APP = "MOBILE_APP",
  UI_UX = "UI_UX",
  VIDEO_EDITING = "VIDEO_EDITING",
  SEO = "SEO",
  IMAGE_DESIGN = "IMAGE_DESIGN",
  DIGITAL_MARKETING = "DIGITAL_MARKETING",
  OTHER = "OTHER",
}
export interface FinancialAccount {
  _id: string;
  accountName: string;
  accountType: string;
  providerName?: string | null;
  accountNumber?: string;
  accountHolderName?: string;
  ownerId?: string;
  bankName?: string;
  branchName?: string;
  openingBalance?: number;
  currentBalance?: number;
  currency?: string;
  description?: string;
  status?: string;
  createdBy?: string;
  updatedBy?: string | null;
  deletedBy?: string | null;
  deletedAt?: string | null;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum PaymentStatus {
  DUE = "DUE",
  PARTIAL = "PARTIAL",
  ADVANCED = "ADVANCED",
  COMPLETE = "COMPLETE",
}

export interface ProjectStatsData {
  total: number;
  Planning: number;
  InProgress: number;
  OnHold: number;
  Completed: number;
}


export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  phone?: string;
}

export interface IPayment {
  _id?: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  note?: string;
  financialAccountId?: string | FinancialAccount | null;
}

export interface IProjectDocument {
  _id?: string;
  requirement: string;
  link: string;
}

export interface IPaymentInstallment {
  _id?: string;
  installmentNo: string;
  projectionDate: string;
  paymentPercentage: number;
  amount: number;
  isCompleted?: boolean;
}

export interface IProject {
  _id: string;

  name: string;
  description?: string;

  type: ProjectType;

  client: PopulatedUser;
  projectManager: PopulatedUser;
  developers: PopulatedUser[];

  budget?: number;

  startDate: string;
  endDate?: string;

  technologies: string[];

  documents?: IProjectDocument[];

  status: ProjectStatus;

  paymentStatus?: PaymentStatus;
  payments?: IPayment[];
  paymentSchedule?: IPaymentInstallment[];
  nextPaymentDate?: string;

  priority?: number;

  liveUrl?: string;
  developmentLiveUrl?: string;
  repositoryUrl?: string;

  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export type ProjectsResponse = ApiResponse<IProject[], ProjectStatsData>;


// Payload stays as IDs — this is what you send to the API
export interface CreateProjectPayload {
  name: string;
  description?: string;

  type: ProjectType;

  client: string;
  projectManager: string;
  developers?: string[];

  budget?: number;

  startDate: string;
  endDate?: string;

  technologies: string[];

  documents?: Omit<IProjectDocument, "_id">[];

  status?: ProjectStatus;

  paymentStatus?: PaymentStatus;
  payments?: Omit<IPayment, "_id">[];
  paymentSchedule?: Omit<IPaymentInstallment, "_id">[];
  nextPaymentDate?: string;

  priority?: number;

  liveUrl?: string;
  developmentLiveUrl?: string;
  repositoryUrl?: string;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export interface ProjectFilters {
  page?: number;
  limit?: number;

  searchTerm?: string;

  status?: ProjectStatus;
  type?: ProjectType;

  client?: string;
  projectManager?: string;

  sort?: string;
  startDate?: string;
  endDate?: string;
  paymentStatus?: PaymentStatus;
}