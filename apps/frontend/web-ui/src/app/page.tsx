import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import HealthStatus from "@/features/health/components/HealthStatus";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to AgendaPulse
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your tasks and calendar efficiently
          </p>

          <div className="flex justify-center items-center space-x-4 mb-8">
            <HealthStatus />
          </div>

          <div className="space-x-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="inline-block px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-block px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
