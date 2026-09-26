import api from "@/lib/axios";
import type { IFinancialAccount } from "@/types/financial-account.types";
import type {
  CreateFinancialAccountInput,
  UpdateFinancialAccountInput,
  FinancialAccountQueryInput,
} from "../schemas/financial-account.schema";

interface FinancialAccountListResponse {
  success?: boolean;
  message?: string;
  data: IFinancialAccount[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

interface FinancialAccountResponse {
  success?: boolean;
  message?: string;
  data: IFinancialAccount;
}

const BASE_URL = "/financial-accounts";

function buildQueryString(query: FinancialAccountQueryInput = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

async function request<T>(
  url: string,
  options?: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: string },
): Promise<T> {
  const response = await api.request<T>({
    url,
    method: options?.method ?? "GET",
    data: options?.body ? JSON.parse(options.body) : undefined,
  });

  return response.data;
}

export async function getFinancialAccounts(
  query: FinancialAccountQueryInput = {},
): Promise<FinancialAccountListResponse> {
  return request<FinancialAccountListResponse>(`${BASE_URL}${buildQueryString(query)}`);
}

export async function getFinancialAccountById(
  id: string,
): Promise<FinancialAccountResponse> {
  return request<FinancialAccountResponse>(`${BASE_URL}/${id}`);
}

export async function createFinancialAccount(
  payload: CreateFinancialAccountInput,
): Promise<FinancialAccountResponse> {
  return request<FinancialAccountResponse>(BASE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateFinancialAccount(
  id: string,
  payload: UpdateFinancialAccountInput,
): Promise<FinancialAccountResponse> {
  return request<FinancialAccountResponse>(`${BASE_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteFinancialAccount(id: string): Promise<{
  success?: boolean;
  message?: string;
  data: null;
}> {
  return request(`${BASE_URL}/${id}`, { method: "DELETE" });
}