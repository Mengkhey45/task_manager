
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PendingPageClient from "./PendingPageClient";
import { getTasksForUser } from "@/lib/data/tasks";
import { getTeamMembersForUser } from "@/lib/data/team";

export default async function Page() {
  const supabase = createClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const tasks = await getTasksForUser(user);
  const members = await getTeamMembersForUser(user);

  return <PendingPageClient tasks={tasks as any} members={members as any} />;
}
