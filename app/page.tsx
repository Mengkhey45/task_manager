

import { redirect } from "next/navigation";
import Dashboard from "../components/Dashboard";
import Layout from "../components/Layout";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getUser();
  const user = (data as any)?.user ?? null;

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
