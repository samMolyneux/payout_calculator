export interface SplitwiseUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  picture: { medium: string };
}

export interface SplitwiseGroup {
  id: number;
  name: string;
  members: SplitwiseMember[];
  group_type: string;
}

export interface SplitwiseMember {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  balance: { currency_code: string; amount: string }[];
}

export interface DebtPayload {
  from: number;
  to: number;
  amount: number;
  description: string;
  group_id: number;
  currency_code: string;
}

export interface ExportRequest {
  debts: DebtPayload[];
  groupId: number;
}

export interface ExportResponse {
  success: boolean;
  groupUrl?: string;
  failedDebts?: { from: number; to: number; amount: number; error: string }[];
}

export interface PendingExport {
  transactions: { from: string; to: string; val: number; key: string }[];
  currency: string;
}
