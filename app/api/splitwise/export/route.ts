import { NextRequest, NextResponse } from "next/server";
import type { DebtPayload, ExportResponse } from "@/app/types/splitwise";

interface CreateExpenseResponse {
  expenses?: { id: number }[];
  errors?: Record<string, string[]>;
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
  }

  const token = authHeader.substring(7);

  let body: { debts: DebtPayload[]; groupId: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { debts, groupId } = body;

  if (!debts || !Array.isArray(debts) || debts.length === 0) {
    return NextResponse.json({ error: "No debts provided" }, { status: 400 });
  }

  if (!groupId) {
    return NextResponse.json({ error: "No group ID provided" }, { status: 400 });
  }

  const createdIds: number[] = [];

  for (const debt of debts) {
    try {
      // Create expense using Splitwise API
      // The API uses "users" array to specify who paid and who owes
      const expenseData = {
        cost: debt.amount.toFixed(2),
        description: debt.description,
        group_id: debt.group_id,
        currency_code: debt.currency_code,
        // User who paid (the creditor - "to" person)
        [`users__0__user_id`]: debt.to,
        [`users__0__paid_share`]: debt.amount.toFixed(2),
        [`users__0__owed_share`]: "0.00",
        // User who owes (the debtor - "from" person)
        [`users__1__user_id`]: debt.from,
        [`users__1__paid_share`]: "0.00",
        [`users__1__owed_share`]: debt.amount.toFixed(2),
      };

      const response = await fetch("https://secure.splitwise.com/api/v3.0/create_expense", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(
          Object.entries(expenseData).map(([k, v]) => [k, String(v)])
        ),
      });

      if (response.status === 401) {
        // Rollback and return auth error
        await rollbackExpenses(token, createdIds);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Splitwise create expense error:", errorText);
        await rollbackExpenses(token, createdIds);

        const result: ExportResponse = {
          success: false,
          failedDebts: [
            {
              from: debt.from,
              to: debt.to,
              amount: debt.amount,
              error: `API error: ${response.status}`,
            },
          ],
        };
        return NextResponse.json(result);
      }

      const responseData: CreateExpenseResponse = await response.json();

      if (responseData.errors && Object.keys(responseData.errors).length > 0) {
        const errorMessages = Object.entries(responseData.errors)
          .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
          .join("; ");

        await rollbackExpenses(token, createdIds);

        const result: ExportResponse = {
          success: false,
          failedDebts: [
            {
              from: debt.from,
              to: debt.to,
              amount: debt.amount,
              error: errorMessages,
            },
          ],
        };
        return NextResponse.json(result);
      }

      if (responseData.expenses && responseData.expenses[0]) {
        createdIds.push(responseData.expenses[0].id);
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      await rollbackExpenses(token, createdIds);

      const result: ExportResponse = {
        success: false,
        failedDebts: [
          {
            from: debt.from,
            to: debt.to,
            amount: debt.amount,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ],
      };
      return NextResponse.json(result);
    }
  }

  const result: ExportResponse = {
    success: true,
    groupUrl: `https://www.splitwise.com/groups/${groupId}`,
  };

  return NextResponse.json(result);
}

async function rollbackExpenses(token: string, expenseIds: number[]): Promise<void> {
  for (const id of expenseIds) {
    try {
      await fetch(`https://secure.splitwise.com/api/v3.0/delete_expense/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Failed to rollback expense ${id}:`, error);
    }
  }
}
