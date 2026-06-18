import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // Verify user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if key already exists
  const { data: existing } = await supabase
    .from("api_keys")
    .select("api_key, total_calls, created_at")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json(existing);
  }

  // Call Engram admin endpoint to create a key
  const adminKey = process.env.ENGRAM_ADMIN_KEY!;
  const apiUrl = process.env.ENGRAM_API_URL!;

  const res = await fetch(`${apiUrl}/admin/keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": adminKey,
    },
    body: JSON.stringify({ name: user.email }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }

  const { key } = await res.json();

  // Store in Supabase
  const { data, error } = await supabase
    .from("api_keys")
    .insert({ user_id: user.id, api_key: key, total_calls: 0 })
    .select("api_key, total_calls, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
