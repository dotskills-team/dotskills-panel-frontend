
// export enum ProjectStatus {
//   PLANNING = "PLANNING",
//   IN_PROGRESS = "IN_PROGRESS",
//   ON_HOLD = "ON_HOLD",
//   COMPLETED = "COMPLETED",
//   CANCELLED = "CANCELLED",
// }

// export enum ProjectType {
//   WORDPRESS = "WORDPRESS",
//   MERN = "MERN",
//   PERN = "PERN",
//   NEXT_JS = "NEXT_JS",
//   SHOPIFY = "SHOPIFY",
//   LARAVEL = "LARAVEL",
//   PHP = "PHP",
//   MOBILE_APP = "MOBILE_APP",
//   UI_UX = "UI_UX",
//   OTHER = "OTHER",
// }

// export enum PaymentStatus {
//   DUE = "DUE",
//   PARTIAL = "PARTIAL",
//   ADVANCED = "ADVANCED",
//   COMPLETE = "COMPLETE",
// }

// export interface PopulatedUser {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   fullName: string;
// }

// export interface IPayment {
//   _id?: string;
//   amount: number;
//   date: string;
//   status: PaymentStatus;
//   note?: string;
// }

// export interface IProjectDocument {
//   _id?: string;
//   requirement: string;
//   link: string;
// }

// export interface IProject {
//   _id: string;

//   name: string;
//   description?: string;

//   type: ProjectType;

//   client: PopulatedUser;
//   projectManager: PopulatedUser;
//   developers: PopulatedUser[];

//   budget?: number;

//   startDate: string;
//   endDate?: string;

//   technologies: string[];

//   documents?: IProjectDocument[];

//   status: ProjectStatus;

//   paymentStatus?: PaymentStatus;
//   payments?: IPayment[];
//   nextPaymentDate?: string;

//   priority?: number;

//   liveUrl?: string;
//   developmentLiveUrl?: string;
//   repositoryUrl?: string;

//   isDeleted?: boolean;
//   deletedAt?: string;
//   deletedBy?: string;
//   isActive?: boolean;

//   createdAt?: string;
//   updatedAt?: string;
// }

// // Payload stays as IDs — this is what you send to the API
// export interface CreateProjectPayload {
//   name: string;
//   description?: string;

//   type: ProjectType;

//   client: string;
//   projectManager: string;
//   developers?: string[];

//   budget?: number;

//   startDate: string;
//   endDate?: string;

//   technologies: string[];

//   documents?: Omit<IProjectDocument, "_id">[];

//   status?: ProjectStatus;

//   paymentStatus?: PaymentStatus;
//   payments?: Omit<IPayment, "_id">[];
//   nextPaymentDate?: string;

//   priority?: number;

//   liveUrl?: string;
//   developmentLiveUrl?: string;
//   repositoryUrl?: string;
// }

// export type UpdateProjectPayload = Partial<CreateProjectPayload>;

// export interface ProjectFilters {
//   page?: number;
//   limit?: number;

//   searchTerm?: string;

//   status?: ProjectStatus;
//   type?: ProjectType;

//   client?: string;
//   projectManager?: string;

//   sort?: string;
// }

export enum ProjectStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DONE_DUE = "DONE_DUE",
  DELIVERED = "DELIVERED",
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
  OTHER = "OTHER",
}

export enum PaymentStatus {
  DUE = "DUE",
  PARTIAL = "PARTIAL",
  ADVANCED = "ADVANCED",
  COMPLETE = "COMPLETE",
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
}