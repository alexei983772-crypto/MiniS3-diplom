import { useEffect, useState } from "react";
import Buckets from "../components/Buckets";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  getFilesByBucket,
  uploadFile,
  downloadFile,
  deleteFile,
  deleteBucket,
  renameBucket,
} from "../api";

function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "px-3 py-2 rounded-md text-sm transition border";
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 border-slate-900",
    secondary: "bg-white hover:bg-slate-50 border-slate-200",
    danger: "bg-red-600 text-white hover:bg-red-500 border-red-600",
    ghost: "bg-transparent hover:bg-slate-100 border-transparent",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function EmptyState({ title, desc }) {
  return (
    <div className="p-10 text-center text-slate-500">
      <div className="text-base font-semibold text-slate-700">{title}</div>
      <div className="text-sm mt-2 leading-relaxed max-w-md mx-auto">{desc}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="p-6 space-y-3 animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-1/3" />
      <div className="h-2 bg-slate-200 rounded w-1/2" />
      <div className="h-2 bg-slate-200 rounded w-2/3" />
    </div>
  );
}

export default function Dashboard({ onLogout }) {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [bucket, setBucket] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const [error, setError] = useState("");

  const loadFiles = async (bucketId) => {
    if (!bucketId) return setFiles([]);
    setLoading(true);
    try {
      const data = await getFilesByBucket(bucketId);
      setFiles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bucket?.id) {
      setFiles([]);
      return;
    }
    loadFiles(bucket.id);
    setEditing(false);
    setNewName(bucket.name);
  }, [bucket]);

 const handleUpload = async () => {
  if (!file || !bucket) return;

  setUploading(true);
  setError("");

  try {
    await uploadFile(file, bucket.id);

    setFile(null);

    await loadFiles(bucket.id);

  } catch (err) {
    console.error(err);

    const message =
      err?.response?.data?.error ||
      err?.error ||
      err?.message ||
      "Upload failed";

    setError(message);

  } finally {
    setUploading(false);
  }
};

  const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();

  setDragActive(false);

  if (e.dataTransfer.files?.length) {
    setFile(e.dataTransfer.files[0]);
  }
};

const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true);
  }

  if (e.type === "dragleave") {
    setDragActive(false);
  }
};

  const handleDownload = async (id, name) => {
    await downloadFile(id, name);
  };

  const handleDeleteFile = async (id) => {
    if (!confirm("Are you sure you want to delete this file? This action cannot be undone.")) return;
    await deleteFile(id);
    await loadFiles(bucket.id);
  };

  const handleDeleteBucket = async () => {
    if (!bucket) return;
    if (!confirm("You are about to permanently delete this bucket and all its contents.")) return;
    await deleteBucket(bucket.id);
    setBucket(null);
    setFiles([]);
  };

  const handleRename = async () => {
    if (!newName.trim()) return;
    const updated = await renameBucket(bucket.id, newName);
    setBucket(updated);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

     <Header onLogout={onLogout} />

      {/* BODY */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="space-y-4">

          <Card className="p-3">
            <div className="text-xs uppercase text-slate-500 mb-2">
              Buckets
            </div>
            <Buckets selected={bucket} onSelect={setBucket} />
          </Card>

          {bucket && (
            <Card className="p-4 space-y-3">
              <div className="text-xs uppercase text-slate-500">Active bucket</div>
              <div className="text-sm font-semibold break-all">
                {bucket.name}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                Manage bucket settings, rename or permanently remove data.
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  Rename bucket
                </Button>
                <Button variant="danger" onClick={handleDeleteBucket}>
                  Delete bucket
                </Button>
              </div>
            </Card>
          )}

        </div>

        {/* MAIN */}
        <div className="lg:col-span-3 space-y-6">

          {/* RENAME */}
          {editing && bucket && (
            <Card className="p-5 space-y-3">
              <div className="text-sm font-medium">Rename bucket</div>
              <div className="text-xs text-slate-500">
                Choose a new identifier for this bucket. This affects how it appears in the system.
              </div>
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button onClick={handleRename}>Save</Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* UPLOAD */}
          <Card className="overflow-hidden">

  {/* HEADER */}
  <div className="px-6 py-5 border-b bg-white">
    <h3 className="text-base font-semibold text-slate-900">
      File Upload
    </h3>

    <p className="text-sm text-slate-500 mt-1">
      Upload objects to the selected bucket. Files will be automatically
      distributed across available storage nodes.
    </p>
  </div>

  {/* DROPZONE */}
  <div className="p-6">
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative
        border
        rounded-xl
        transition-all
        duration-200
        cursor-pointer
        ${
          dragActive
            ? "border-blue-500 bg-blue-50 shadow-sm"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
        }
      `}
    >
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />

      <div className="py-14 px-8 text-center">

        {/* ICON */}
        <div className="mx-auto mb-5 w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6.1A4.5 4.5 0 1118 16H7z"
            />
            <path
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 12v7m0-7l-3 3m3-3l3 3"
            />
          </svg>
        </div>

        <h4 className="text-lg font-semibold text-slate-800">
          Upload Files
        </h4>

        <p className="mt-2 text-sm text-slate-500">
          Drag and drop files here or click to browse from your device.
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Any file type supported • Distributed storage enabled
        </p>

        {file && (
          <div
            className="
              mt-6
              inline-flex
              items-center
              gap-3
              px-4
              py-3
              bg-white
              border
              border-slate-200
              rounded-lg
              shadow-sm
            "
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>

            <div className="text-left">
              <div className="text-sm font-medium text-slate-800">
                {file.name}
              </div>

              <div className="text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* ACTIONS */}
    <div className="mt-5 flex items-center justify-between">
      <div className="text-xs text-slate-500">
        {bucket
          ? `Target bucket: ${bucket.name}`
          : "Select a bucket before uploading"}
      </div>

      <Button
        onClick={handleUpload}
        disabled={!bucket || !file || uploading}
        className="min-w-[140px]"
      >
        {uploading
          ? "Uploading..."
          : "Upload File"}
      </Button>
    </div>
  </div>

{error && (
  <div className="mt-3 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    <span>⚠️</span>
    <span>{error}</span>
  </div>
)}
</Card>


          {/* FILE LIST */}<Card>
  <div className="p-5 border-b space-y-1">
    <div className="text-sm font-semibold">
      {bucket ? bucket.name : "No bucket selected"}
    </div>

    <div className="text-xs text-slate-500">
      {bucket
        ? "All stored objects inside this bucket are listed below"
        : "Select a bucket to begin working with files"}
    </div>
  </div>

  {loading ? (
    <Skeleton />
  ) : files.length === 0 ? (
    <EmptyState
      title="No files in this bucket"
      desc="This space is empty. Upload your first file to initialize storage in this bucket."
    />
  ) : (
    <div className="divide-y">
      {files.map((f) => {
        const chunks = f.Chunks || f.chunks || [];

        return (
          <div
            key={f.id}
            className="p-5 space-y-4"
          >
            {/* FILE INFO */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium">
                  {f.filename}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  Size: {(f.size / 1024).toFixed(2)} KB
                </div>

                <div className="text-xs text-slate-500">
                  Chunks: {chunks.length}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleDownload(f.id, f.filename)
                  }
                >
                  Download
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    handleDeleteFile(f.id)
                  }
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* CHUNK DISTRIBUTION */}
           {/* CHUNK DISTRIBUTION */}
<details className="bg-slate-50 border rounded-lg">
  <summary className="p-4 cursor-pointer select-none flex items-center justify-between">
    <div>
      <div className="text-xs uppercase text-slate-500">
        Chunk Distribution
      </div>

      <div className="text-sm text-slate-700 mt-1">
        {chunks.length} chunk{chunks.length !== 1 ? "s" : ""}
      </div>
    </div>

    <div className="text-slate-400">
      ▼
    </div>
  </summary>

  <div className="px-4 pb-4">
    {chunks.length === 0 ? (
      <div className="text-sm text-red-500">
        No chunk information
      </div>
    ) : (
      <div className="space-y-2">
        {chunks
          .sort((a, b) => a.index - b.index)
          .map((chunk) => (
            <div
              key={chunk.id}
              className="
                flex
                items-center
                justify-between
                bg-white
                border
                rounded-md
                px-3
                py-2
              "
            >
              <div>
                <div className="font-medium">
                  Chunk #{chunk.index}
                </div>

                <div className="text-xs text-slate-500">
                  {(chunk.size / 1024).toFixed(2)} KB
                </div>
              </div>

              <div
                className="
                  text-xs
                  font-mono
                  bg-blue-50
                  border
                  border-blue-200
                  text-blue-700
                  px-2
                  py-1
                  rounded
                "
              >
                {chunk.nodeId?.slice(0, 8)}
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
</details>
          </div>
        );
      })}
    </div>
  )}
</Card>

        </div>
      </div>
      <Footer/>
    </div>
  );
}