import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import PendingPageClient from "./PendingPageClient";

export default async function Page() {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getUser();
  const user = (data as any)?.user ?? null;

  if (!user) {
    redirect("/auth/signin");
  }

  const fetchTasks = async () => {
    const { data: tasks, error } = await supabase.from('Task').select('*');
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    return tasks;
  };

  const fetchMembers = async () => {
    const { data: members, error } = await supabase.from('TeamMember').select('*');
    if (error) {
      console.error('Error fetching members:', error);
      return [];
    }
    return members;
  };

  const tasks = await fetchTasks();
  const members = await fetchMembers();

  return <PendingPageClient tasks={tasks} members={members} />;
}