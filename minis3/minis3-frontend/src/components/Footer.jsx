import React from "react";

export function Footer() {
  return (
    <footer className="border-t bg-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">

        <div>
          <div className="text-sm font-semibold text-slate-800">
            Minis3 Storage Platform
          </div>
          <div className="text-xs text-slate-500 mt-1 leading-relaxed">
            Lightweight object storage interface inspired by modern cloud storage systems.
          </div>
        </div>

        <div className="flex items-center gap-5 text-xs text-slate-500">
          <span>Secure Storage</span>
          <span>Bucket Management</span>
          <span>File Distribution</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;