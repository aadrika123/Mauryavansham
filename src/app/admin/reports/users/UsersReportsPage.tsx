"use client";

import SummaryCard from "../components/SummaryCard";
import { Users, HeartHandshakeIcon, Wallet2Icon, Camera, Tv, Calendar, MessageSquare, Globe } from "lucide-react"; // Use your icons

export default function UsersReportsPage() {
  // Placeholder data
  const stats = [
    { title: "Total Users", value: 1250, icon: <Users /> },
    { title: "Active Users", value: 980, icon: <Users /> },
    { title: "Pending Users", value: 200, icon: <Users /> },
    { title: "Blocked Users", value: 70, icon: <Users /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Reports</h1>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4">
        {stats.map((s) => (
          <SummaryCard key={s.title} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      {/* TODO: Add charts / detailed tables */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <p className="text-gray-500">Charts and detailed tables will go here...</p>
      </div>
    </div>
  );
}
