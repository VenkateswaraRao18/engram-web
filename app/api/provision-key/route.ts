import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // User client — reads session from cookies (uses publishable key)
  const userClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await userClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin client — service role, bypasses RLS
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Check if key already exists
  const { data: existing } = await adminClient
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
      "X-API-Key": adminKey,
    },
    body: JSON.stringify({ name: user.email }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Failed to create API key: ${err}` }, { status: 500 });
  }

  const { key } = await res.json();

  // Store in Supabase using admin client (bypasses RLS)
  const { data, error } = await adminClient
    .from("api_keys")
    .insert({ user_id: user.id, api_key: key, total_calls: 0 })
    .select("api_key, total_calls, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
