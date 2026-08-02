"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AdminDashboardHome from "./_AdminDashboard";
import UserDashboardHome from "./_UserDashboard";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth?.user);
  const isAdmin = user?.role === "ADMIN";

  return isAdmin ? <AdminDashboardHome /> : <UserDashboardHome />;
}
