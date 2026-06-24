import { useEffect, useState } from "react";
import { getNodes } from "../api";
import Header from "../components/Header";

export default function Nodes({ onLogout }) {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getNodes();
      setNodes(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();

    const timer = setInterval(load, 5000);

    return () => clearInterval(timer);
  }, []);

  const formatMB = (bytes = 0) =>
    (bytes / 1024 / 1024).toFixed(2);

  const onlineNodes = nodes.filter(
    (n) => n.status === "online"
  ).length;

  const offlineNodes =
    nodes.length - onlineNodes;

  const totalChunks = nodes.reduce(
    (sum, n) => sum + (n.chunksCount || 0),
    0
  );

  const totalUsed = nodes.reduce(
    (sum, n) => sum + (n.usedBytes || 0),
    0
  );

  const availability =
    nodes.length > 0
      ? (
          (onlineNodes / nodes.length) *
          100
        ).toFixed(1)
      : 0;

  return (
    <>
      <Header onLogout={onLogout} />

      <div className="min-h-screen bg-slate-50">

        <div className="max-w-7xl mx-auto p-8">

          {/* HERO */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-10 mb-8">

            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">

              <div className="max-w-4xl">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs uppercase tracking-wider">
                  Infrastructure Monitoring
                </div>

                <h1 className="text-5xl font-bold mt-5">
                  Distributed Storage Cluster
                </h1>

                <p className="mt-5 text-slate-300 leading-relaxed text-lg">
                  Centralized monitoring and management
                  interface for MiniS3 distributed object
                  storage infrastructure. Observe node
                  health, storage utilization, chunk
                  distribution, replication status and
                  cluster-wide operational metrics in
                  real time.
                </p>

              </div>

              <div className="flex flex-col justify-center">

                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 min-w-[240px]">

                  <div className="text-sm text-slate-400">
                    Cluster Status
                  </div>

                  <div className="mt-2 text-3xl font-bold text-green-400">
                    Healthy
                  </div>

                  <div className="text-sm text-slate-400 mt-2">
                    Automatic monitoring enabled
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* KPI */}

          <div className="grid md:grid-cols-5 gap-5 mb-8">

            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="text-sm text-slate-500">
                Total Nodes
              </div>

              <div className="mt-2 text-3xl font-bold">
                {nodes.length}
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="text-sm text-slate-500">
                Online Nodes
              </div>

              <div className="mt-2 text-3xl font-bold text-green-600">
                {onlineNodes}
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="text-sm text-slate-500">
                Stored Chunks
              </div>

              <div className="mt-2 text-3xl font-bold">
                {totalChunks}
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="text-sm text-slate-500">
                Used Capacity
              </div>

              <div className="mt-2 text-3xl font-bold">
                {formatMB(totalUsed)} MB
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="text-sm text-slate-500">
                Availability
              </div>

              <div className="mt-2 text-3xl font-bold text-emerald-600">
                {availability}%
              </div>
            </div>

          </div>

          {/* CLUSTER HEALTH */}

          <div className="bg-white border rounded-2xl shadow-sm p-6 mb-8">

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

              <div>
                <h2 className="font-semibold text-xl">
                  Cluster Health Overview
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Real-time monitoring of storage node
                  availability, synchronization status
                  and infrastructure performance.
                </p>
              </div>

              <div className="text-sm text-slate-500">
                Auto refresh every 5 seconds
              </div>

            </div>

            <div className="mt-6 flex flex-wrap gap-4">

              <div className="px-4 py-2 rounded-xl bg-green-50 text-green-700 border border-green-200">
                Online Nodes: {onlineNodes}
              </div>

              <div className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200">
                Offline Nodes: {offlineNodes}
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-50 text-slate-700 border">
                Stored Chunks: {totalChunks}
              </div>

              <div className="px-4 py-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                Availability: {availability}%
              </div>

            </div>

          </div>

          {/* SUMMARY */}

          <div className="bg-white rounded-2xl border shadow-sm p-8 mb-8">

            <h2 className="text-xl font-semibold">
              Infrastructure Summary
            </h2>

            <p className="text-slate-600 leading-relaxed mt-4">
              The MiniS3 storage cluster consists of
              independent storage nodes responsible
              for object chunk storage, replication
              and retrieval. Continuous health checks
              and heartbeat monitoring ensure high
              availability, fault tolerance and
              efficient resource utilization. Cluster
              metrics are updated automatically every
              five seconds to provide near real-time
              visibility into the operational state
              of the infrastructure.
            </p>

          </div>

          {/* NODES */}

          <div className="mb-6">

            <h2 className="text-2xl font-semibold">
              Registered Storage Nodes
            </h2>

            <p className="text-slate-500 mt-2">
              Detailed operational information for
              every storage server participating in
              the distributed cluster environment.
            </p>

          </div>

          {loading && (
            <div className="bg-white border rounded-2xl p-8 shadow-sm">
              Loading infrastructure data...
            </div>
          )}

          <div className="grid gap-6">

            {nodes.map((node) => (
              <div
                key={node.id}
                className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6"
              >

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                  <div>

                    <div className="text-xl font-semibold text-slate-900">
                      {node.url}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      Storage Node Identifier
                    </div>

                    <div className="font-mono text-xs text-slate-600 mt-2">
                      {node.id}
                    </div>

                  </div>

                  <div>

                    {node.status === "online" ? (
                      <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 border border-green-200 text-sm font-medium">
                        ● Operational
                      </span>
                    ) : (
                      <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 border border-red-200 text-sm font-medium">
                        ● Unavailable
                      </span>
                    )}

                  </div>

                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">

                  <div className="bg-slate-50 border rounded-xl p-4">

                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Stored Chunks
                    </div>

                    <div className="text-2xl font-bold mt-2">
                      {node.chunksCount}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Distributed file fragments
                    </div>

                  </div>

                  <div className="bg-slate-50 border rounded-xl p-4">

                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Used Capacity
                    </div>

                    <div className="text-2xl font-bold mt-2">
                      {formatMB(node.usedBytes)} MB
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Occupied storage space
                    </div>

                  </div>

                  <div className="bg-slate-50 border rounded-xl p-4">

                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Last Heartbeat
                    </div>

                    <div className="text-sm mt-2 font-medium">
                      {node.lastHeartbeat
                        ? new Date(
                            node.lastHeartbeat
                          ).toLocaleString()
                        : "No heartbeat received"}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Latest synchronization signal
                    </div>

                  </div>

                </div>

                <div className="mt-6 border-t pt-5">

                  <div className="grid md:grid-cols-4 gap-4">

                    <div>
                      <div className="text-xs uppercase text-slate-500">
                        Node Role
                      </div>

                      <div className="font-medium mt-1">
                        Storage Worker
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase text-slate-500">
                        Replication
                      </div>

                      <div className="font-medium mt-1 text-green-600">
                        Enabled
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase text-slate-500">
                        Health Check
                      </div>

                      <div className="font-medium mt-1">
                        5 Seconds
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase text-slate-500">
                        Storage Type
                      </div>

                      <div className="font-medium mt-1">
                        Object Storage
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* FOOTER */}

          <div className="mt-10 bg-white border rounded-2xl shadow-sm p-8">

            <h2 className="text-xl font-semibold">
              About Storage Infrastructure
            </h2>

            <p className="mt-4 text-slate-600 leading-relaxed">
              Storage nodes are the fundamental
              components of the MiniS3 distributed
              storage platform. Each node stores
              object chunks, participates in cluster
              synchronization, exchanges health
              information and contributes resources
              to the overall storage pool. The
              distributed architecture provides
              scalability, fault tolerance and
              improved reliability compared to
              centralized storage systems.
            </p>

          </div>

        </div>

      </div>
    </>
  );
}