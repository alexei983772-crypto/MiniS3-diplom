import { useEffect, useState } from "react";
import { getBuckets, getBucketStats, createBucket } from "../api";

export default function Buckets({ selected, onSelect }) {
  const [buckets, setBuckets] = useState([]);
  const [name, setName] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getBuckets();
    setBuckets(data);
  };

  const loadStats = async (bucketId) => {
    const data = await getBucketStats(bucketId);
    setStats(data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (selected?.id) {
      loadStats(selected.id);
    } else {
      setStats(null);
    }
  }, [selected]);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await createBucket(name.trim());
      setName("");
      await load();
    } finally {
      setLoading(false);
    }
  };

  const formatMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

  const usedMB = stats ? formatMB(stats.totalSize) : 0;
  const limitMB = stats ? formatMB(stats.limit) : 0;
  const remainingMB = stats ? formatMB(stats.remaining) : 0;

  const percent = stats?.usedPercent || 0;

  return (
    <div className="mb-6 space-y-4">
      <h2 className="text-lg font-bold">Buckets</h2>

      {/* CREATE BUCKET */}
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="text-sm font-semibold mb-3 text-gray-700">
          Create new bucket
        </div>

        {/* RESPONSIVE ROW */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Enter bucket name..."
            className="w-full sm:flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* BUCKET LIST */}
      <div className="flex flex-wrap gap-2">
        {buckets.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b)}
            className={`px-3 py-1 rounded-md border text-sm transition ${
              selected?.id === b.id
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* STATS */}
      {selected && stats && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="text-sm font-semibold mb-2">
            Storage usage
          </div>

          <div className="text-sm mb-1">
            {usedMB} MB / {limitMB} MB
          </div>

          <div className="text-sm text-gray-600 mb-3">
            Remaining: {remainingMB} MB
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-3 bg-blue-600"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="text-xs text-gray-500 mt-1 mb-3">
            Used: {percent.toFixed(1)}%
          </div>

          {/* FILE STATS */}
          <div className="flex gap-4 text-sm text-gray-700">
            <div>📁 Files: <b>{stats.filesCount}</b></div>
            <div>🧩 Chunks: <b>{stats.chunksCount}</b></div>
          </div>
        </div>
      )}
    </div>
  );
}