import { Link, useLocation } from "react-router-dom";

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border";

  const styles = {
    primary:
      "bg-slate-900 text-white border-slate-900 hover:bg-slate-800",

    secondary:
      "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",

    danger:
      "bg-red-600 text-white border-red-600 hover:bg-red-500",

    ghost:
      "bg-transparent border-transparent hover:bg-slate-100",
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

function NavLink({ to, children }) {
  const location = useLocation();

  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        relative px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-200
        ${
          active
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }
      `}
    >
      {children}
    </Link>
  );
}

export default function Header({ onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-4">

            <div className="h-11 w-11 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">
                S3
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-slate-900 tracking-tight">
                  Minis3 Storage Console
                </h1>

                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  v1.0
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                Distributed object storage management platform
              </p>
            </div>

          </div>

          {/* Center */}
         <nav className="hidden md:flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200">
  <NavLink to="/dashboard">
    Dashboard
  </NavLink>

  <NavLink to="/nodes">
    Nodes
  </NavLink>

  <NavLink to="/profile">
    Profile
  </NavLink>

  {/* NEW: Analytics */}
  <NavLink to="/analytics">
    Analytics
  </NavLink>
</nav>

          {/* Right */}
          <div className="flex items-center gap-3">

            <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-600">
                System Online
              </span>
            </div>

            <Button
              variant="secondary"
              onClick={onLogout}
            >
              Logout
            </Button>

          </div>

        </div>
      </div>
    </header>
  );
}