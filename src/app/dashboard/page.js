"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
const { data: session, status } = useSession();

  if (status === "loading") 
    {
    return <p>Loading...</p>; }

  if (!session) {
    return <p>You r not logged in.</p>;
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h1>Dashboard</h1>
 <p>Welcome, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
         <p>Role: {session.user.role}</p>
      <p>Tenant ID: {session.user.tenantId}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}