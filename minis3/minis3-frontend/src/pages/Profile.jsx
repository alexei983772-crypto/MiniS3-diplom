import { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  getProfile,
  getUserStats,
  changePassword,
  logout,
} from "../api";

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border shadow-sm";

  const styles = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
    secondary:
      "bg-white hover:bg-slate-50 border-slate-200",
    danger:
      "bg-red-600 text-white hover:bg-red-500 border-red-600",
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white
        border border-slate-200
        rounded-2xl
        shadow-sm
        hover:shadow-md
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const user = await getProfile();
      const userStats = await getUserStats();

      setProfile(user);
      setStats(userStats);
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePasswordChange() {
    try {
      setLoading(true);

      await changePassword(oldPassword, newPassword);

      alert(
        "Security credentials updated successfully. Your account remains protected across all active sessions."
      );

      setOldPassword("");
      setNewPassword("");
    } catch {
      alert(
        "Unable to update password. Please verify your current credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  if (!profile || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        Loading secure profile context...
      </div>
    );
  }

  const usedPercent = Math.min(
    Number(
      (
        (stats.storageUsed / stats.storageLimit) *
        100
      ).toFixed(1)
    ),
    100
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="h-44 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800" />

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_25%_20%,white,transparent_40%)]" />

          <div className="relative p-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                {profile.email[0].toUpperCase()}
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white lg:text-slate-900">
                  {profile.email}
                </h1>

                <p className="text-sm text-slate-300 lg:text-slate-500 mt-1 max-w-md">
                  This workspace represents your secure identity layer inside the Mini-S3 distributed storage network.
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
                    Verified & Active
                  </span>

                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs border border-slate-200">
                    Account ID: {profile.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left lg:text-right">
              <div className="text-xs text-slate-400 uppercase">
                Account lifecycle
              </div>
              <div className="text-sm font-semibold text-white lg:text-slate-900">
                Active since {new Date(profile.createdAt).toLocaleDateString()}
              </div>
            </div>

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <Card className="p-6">
            <div className="text-sm text-slate-500">Buckets</div>
            <div className="mt-2 text-4xl font-semibold tracking-tight">
              {stats.bucketsCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Logical storage containers in your namespace
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-slate-500">Files</div>
            <div className="mt-2 text-4xl font-semibold tracking-tight">
              {stats.filesCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Distributed objects stored across nodes
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-slate-500">Storage Used</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {(stats.storageUsed / 1024 / 1024).toFixed(2)}
              <span className="text-base text-slate-500 ml-1">MB</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Aggregated across cluster shards
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-slate-500">Quota Limit</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {(stats.storageLimit / 1024 / 1024 / 1024).toFixed(1)}
              <span className="text-base text-slate-500 ml-1">GB</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Enforced per account policy
            </div>
          </Card>

        </div>

        {/* STORAGE */}
        <Card className="p-8">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-lg font-semibold">
                Storage utilization overview
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                This section provides a real-time snapshot of your storage consumption across the distributed Mini-S3 network. Data is continuously synchronized between nodes to ensure consistency and availability.
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold">
                {usedPercent}%
              </div>
              <div className="text-xs text-slate-500">
                utilization
              </div>
            </div>

          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all duration-500"
              style={{ width: `${usedPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-slate-500 mt-3">
            <span>
              {(stats.storageUsed / 1024 / 1024).toFixed(2)} MB consumed
            </span>
            <span>
              {(stats.storageLimit / 1024 / 1024 / 1024).toFixed(1)} GB allocated
            </span>
          </div>

        </Card>

        {/* SECURITY */}
        <Card className="p-8">

          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Security & Authentication
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Manage your authentication credentials. Password changes are applied instantly across all active sessions and encrypted using industry-standard hashing algorithms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="password"
              placeholder="Current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-300 outline-none"
            />

          </div>

          <div className="mt-5 flex justify-end">
            <Button
              onClick={handlePasswordChange}
              className="px-6 py-3"
            >
              {loading ? "Updating security layer..." : "Update password"}
            </Button>
          </div>

        </Card>

        {/* ACCOUNT ACTIONS */}
        <Card className="p-6 flex justify-between items-center">

          <div>
            <div className="font-medium">Session management</div>
            <div className="text-sm text-slate-500">
              Terminate active session and invalidate authentication token
            </div>
          </div>

          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>

        </Card>

      </div>

      <Footer />
    </div>
  );
}