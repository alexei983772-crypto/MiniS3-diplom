import { useEffect, useState } from "react";
import {
  getProfile,
  getUserStats,
  getNodes,
} from "../api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  Pie,
  Bar,
  Line,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Card({ children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {children}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>

      <div className="text-3xl font-bold mt-2">
        {value}
      </div>
    </Card>
  );
}

export default function Analytics() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s, n] = await Promise.all([
          getProfile(),
          getUserStats(),
          getNodes(),
        ]);

        setProfile(p);
        setStats(s);
        setNodes(n || []);
      } catch (err) {
        console.error(err);

        setError(
          err?.response?.data?.error ||
            err?.message ||
            "Failed to load analytics"
        );
      }
    };

    load();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />

        <div className="max-w-6xl mx-auto p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4">
            {error}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">
          Loading analytics...
        </div>
      </div>
    );
  }

  const storageUsed =
    Number(stats.storageUsed || 0);

  const storageLimit =
    Number(stats.storageLimit || 1);

  const usagePercent =
    storageLimit > 0
      ? (storageUsed / storageLimit) * 100
      : 0;

  const nodeLabels = nodes.map(
    (_, index) => `Node ${index + 1}`
  );

  const nodeBarData = {
    labels: nodeLabels,
    datasets: [
      {
        label: "Chunks",
        data: nodes.map(
          (n) => n.chunksCount || 0
        ),
        backgroundColor: "#0f172a",
      },
    ],
  };

  const nodePieData = {
    labels: nodeLabels,
    datasets: [
      {
        label: "Storage",
        data: nodes.map(
          (n) => n.usedBytes || 0
        ),
        backgroundColor: [
          "#0f172a",
          "#334155",
          "#475569",
          "#64748b",
          "#94a3b8",
          "#cbd5e1",
        ],
      },
    ],
  };

  const fileHistory = stats.fileHistory || [];

const filesLineData = {
  labels: fileHistory.map((item) =>
    new Date(item.date).toLocaleDateString()
  ),

  datasets: [
    {
      label: "Files Uploaded",
      data: fileHistory.map(
        (item) => item.count
      ),
      borderColor: "#0f172a",
      backgroundColor: "#0f172a",
      tension: 0.35,
      fill: false,
    },
  ],
};

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Analytics
          </h1>

          <p className="text-slate-500 mt-2">
            Distributed storage statistics
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">

          <MetricCard
            label="Files"
            value={stats.filesCount || 0}
          />

          <MetricCard
            label="Buckets"
            value={stats.bucketsCount || 0}
          />

          <MetricCard
            label="Storage Used"
            value={`${(
              storageUsed /
              1024 /
              1024
            ).toFixed(2)} MB`}
          />

          <MetricCard
            label="Nodes"
            value={nodes.length}
          />

        </div>

        <Card>
          {/* FILE GROWTH */}
<Card>
  <h2 className="font-semibold mb-4">
    File Growth
  </h2>

  <div className="h-80">
    {fileHistory.length > 0 ? (
      <Line
        data={filesLineData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    ) : (
      <div className="h-full flex items-center justify-center text-slate-500">
        No file history available
      </div>
    )}
  </div>
</Card>


       


        </Card>

        <div className="grid lg:grid-cols-2 gap-6">

          <Card>
            <h2 className="font-semibold mb-4">
              Chunks per Node
            </h2>

            <div className="h-80">
              <Bar
                data={nodeBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold mb-4">
              Storage Distribution
            </h2>

            <div className="h-80">
              <Pie
                data={nodePieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </Card>

        </div>

        <Card>
          <h2 className="font-semibold mb-4">
            Storage Nodes
          </h2>

          <div className="space-y-3">

            {nodes.length === 0 && (
              <div className="text-slate-500">
                No storage nodes connected
              </div>
            )}

            {nodes.map((node, index) => (
              <div
                key={node.id}
                className="border border-slate-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <div className="font-medium">
                      Node {index + 1}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {node.id}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      node.status === "online"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {node.status}
                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">

                  <div>
                    Chunks:{" "}
                    <strong>
                      {node.chunksCount || 0}
                    </strong>
                  </div>

                  <div>
                    Storage:{" "}
                    <strong>
                      {(
                        (node.usedBytes || 0) /
                        1024 /
                        1024
                      ).toFixed(2)}
                      MB
                    </strong>
                  </div>

                </div>

                <div className="text-xs text-slate-500 mt-3 break-all">
                  {node.url}
                </div>

              </div>
            ))}

          </div>
        </Card>

      </div>

      <Footer />
    </div>
  );
}