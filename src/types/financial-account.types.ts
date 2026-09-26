export enum AccountType {
  CASH = "CASH",
  BANK = "BANK",
  MOBILE_BANKING = "MOBILE_BANKING",
  OTHER = "OTHER",
}

export enum ProviderName {
  BKASH = "BKASH",
  NAGAD = "NAGAD",
  ROCKET = "ROCKET",
  OTHER = "OTHER",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IFinancialAccount {
  _id: string;

  accountName: string;
  accountType: AccountType;
  providerName?: ProviderName;
  accountNumber?: string;
  accountHolderName?: string;

  bankName?: string;
  branchName?: string;

  openingBalance: number;
  currency: string;

  description?: string;
  status: AccountStatus;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: string;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}