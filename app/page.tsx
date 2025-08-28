// import Dashboard from "../components/Dashboard"
// import Layout from "../components/Layout"

// export default function Page() {
//   return (
//     <Layout>
//       <Dashboard />
//     </Layout>
//   )
// }

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Dashboard from "../components/Dashboard";
import Layout from "../components/Layout";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin"); // Change to /signin if you don’t move folders
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
