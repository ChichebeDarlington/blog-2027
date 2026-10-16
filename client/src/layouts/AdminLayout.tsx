import { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  PanelsTopLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutAdmin } from "../features/auth/authSlice";
const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/posts", label: "Articles", icon: FileText },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
];
export function AdminShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate("/admin/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-base-200/60 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden border-r border-base-300 bg-base-100 p-5 lg:flex lg:flex-col">
        <Link
          to="/"
          className="flex items-center gap-2 px-2 py-3 text-lg font-black"
        >
          {" "}
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-sm text-white">
            C.
          </span>
          chichebe<span className="text-primary">.dev</span>
        </Link>
        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-base-content/40">
          Workspace
        </p>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-primary/10 text-primary" : "text-base-content/60 hover:bg-base-200"}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-xl bg-base-200 p-4">
          <p className="text-xs font-semibold">Signed in as</p>
          <p className="mt-1 break-all text-xs text-base-content/60">
            {user?.email}
          </p>
          <button
            onClick={() => void handleLogout()}
            className="btn btn-ghost btn-sm mt-3 w-full justify-start"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex h-[68px] items-center justify-between border-b border-base-300 bg-base-100 px-4 sm:px-8">
          <Link
            to="/admin"
            className="flex items-center gap-2 font-bold lg:hidden"
          >
            <PanelsTopLeft size={18} className="text-primary" /> Admin workspace
          </Link>
          <span className="hidden text-sm text-base-content/50 lg:block">
            Your publishing workspace
          </span>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn btn-ghost btn-sm">
              View website ↗
            </Link>
            <button
              onClick={() => void handleLogout()}
              className="btn btn-ghost btn-sm lg:hidden"
              aria-label="Sign out"
            >
              <LogOut size={17} />
            </button>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {user?.email?.slice(0, 1).toUpperCase() || "A"}
            </span>
          </div>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-base-300 bg-base-100 px-4 py-2 lg:hidden">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? "bg-primary/10 text-primary" : "text-base-content/60"}`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
        <main className="p-4 sm:p-7 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
export default function AdminLayout() {
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
