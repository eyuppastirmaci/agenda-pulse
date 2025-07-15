import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/features/auth/components/LogoutButton";
import TaskList from "@/features/tasks/components/TaskList";
import CalendarEventList from "@/features/calendar/components/CalendarEventList";
import { Home, LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <p className="text-gray-600">
                Welcome back,{" "}
                <span className="font-medium">{session.user.email}</span>!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Manage your tasks and calendar events in one place
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks Section */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 h-fit">
            <TaskList />
          </div>

          {/* Calendar Events Section */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 h-fit">
            <CalendarEventList />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© 2025 AgendaPulse. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
