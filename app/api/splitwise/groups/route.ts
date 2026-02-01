import { NextRequest, NextResponse } from "next/server";
import type { SplitwiseGroup } from "@/app/types/splitwise";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
  }

  const token = authHeader.substring(7);

  try {
    const response = await fetch("https://secure.splitwise.com/api/v3.0/get_groups", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Splitwise API error:", errorText);
      return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
    }

    const data = await response.json();

    // Filter out non-group entries (group_id 0 is "non-group expenses")
    const groups: SplitwiseGroup[] = (data.groups || []).filter(
      (group: SplitwiseGroup) => group.id !== 0
    );

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}
