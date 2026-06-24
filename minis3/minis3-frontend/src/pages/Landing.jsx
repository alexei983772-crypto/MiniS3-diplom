import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* NAV */}
      <div className="max-w-6xl mx-auto flex justify-between items-center p-6">

        <div className="text-xl font-semibold tracking-tight">
          MiniS3
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-900 transition"
          >
            Sign in
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-slate-200 transition font-medium"
          >
            Get started
          </Link>
        </div>

      </div>

      {/* HERO */}
      <div className="max-w-5xl mx-auto text-center px-6 pt-28">

        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Simple object storage
          <br />
          built for modern applications
        </h1>

        <p className="text-slate-300 mt-6 text-lg max-w-3xl mx-auto leading-relaxed">
          MiniS3 is a lightweight, developer-friendly cloud storage system
          that allows you to upload, manage, and organize files using
          isolated buckets — inspired by AWS S3, but designed to be
          simple, fast, and understandable for real-world usage and learning.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-slate-200 transition"
          >
            Start free
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 border border-slate-700 rounded-lg hover:bg-slate-900 transition"
          >
            Sign in
          </Link>
        </div>

        <p className="text-slate-500 text-sm mt-6">
          No credit card required • Fully free for demo & диплом project
        </p>

      </div>

      {/* TRUST / DESCRIPTION */}
      <div className="max-w-5xl mx-auto text-center mt-28 px-6">

        <h2 className="text-2xl font-semibold">
          Designed for reliability and clarity
        </h2>

        <p className="text-slate-400 mt-4 leading-relaxed">
          The system is built with a clean architecture separating
          authentication, file management, and storage logic.
          Every upload is securely associated with a user account,
          ensuring isolation between data and predictable system behavior.
        </p>

      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-20 px-6">

        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900">
          <h3 className="font-semibold text-lg">1. Create account</h3>
          <p className="text-slate-400 mt-2 leading-relaxed">
            Register in seconds and receive access to your personal storage workspace.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900">
          <h3 className="font-semibold text-lg">2. Create buckets</h3>
          <p className="text-slate-400 mt-2 leading-relaxed">
            Organize files into isolated logical containers for better structure and scalability.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900">
          <h3 className="font-semibold text-lg">3. Upload & manage</h3>
          <p className="text-slate-400 mt-2 leading-relaxed">
            Upload files, download, delete and manage storage with full control.
          </p>
        </div>

      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto mt-24 px-6">

        <h2 className="text-2xl font-semibold text-center">
          Core capabilities
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900">
            <h3 className="font-semibold">Secure authentication</h3>
            <p className="text-slate-400 mt-2">
              JWT-based authentication ensures secure access to user resources.
            </p>
          </div>

          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900">
            <h3 className="font-semibold">Bucket isolation</h3>
            <p className="text-slate-400 mt-2">
              Each user has isolated storage containers preventing data leakage.
            </p>
          </div>

          <div className="p-6 border border-slate-800 rounded-xl bg-slate-900">
            <h3 className="font-semibold">Fast file operations</h3>
            <p className="text-slate-400 mt-2">
              Optimized upload and download system for responsive file handling.
            </p>
          </div>

        </div>

      </div>

      {/* SECURITY SECTION */}
      <div className="max-w-5xl mx-auto mt-28 px-6 text-center">

        <h2 className="text-2xl font-semibold">
          Security by design
        </h2>

        <p className="text-slate-400 mt-4 leading-relaxed">
          All operations are protected with token-based authentication.
          Users can only access their own data, ensuring full isolation
          and preventing unauthorized access across the system.
        </p>

      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto mt-28 text-center px-6">

        <div className="p-10 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">

          <h2 className="text-3xl font-bold">
            Ready to start using MiniS3?
          </h2>

          <p className="text-slate-400 mt-4 leading-relaxed">
            Create your account and get full access to a modern
            storage system designed for learning, development,
            and real-world use cases.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-slate-200 transition"
            >
              Create account
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 border border-slate-700 rounded-lg hover:bg-slate-900 transition"
            >
              Sign in
            </Link>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-slate-500 mt-28 pb-10">
        © {new Date().getFullYear()} MiniS3 Storage System • Built for диплом project
      </div>

    </div>
  );
}