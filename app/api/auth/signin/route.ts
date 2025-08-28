import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ status: "missing_fields", message: "Email and password are required" }, { status: 400 });
    }

    const supabase = createClient(cookies());

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Supabase signin error:', error);
      return NextResponse.json({ status: "invalid_credentials", message: error.message }, { status: 401 });
    }

    // data.session and data.user available on success. createServerClient will set cookies via the cookie store.
    return NextResponse.json({ status: "success", user: data.user ?? null, session: data.session ?? null }, { status: 200 });
  } catch (err) {
    console.error("Signin route error:", err);
    return NextResponse.json({ status: "error", message: String(err) }, { status: 500 });
  }
}

