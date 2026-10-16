import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  FileText,
  FolderKanban,
  PenLine,
  Plus,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api, getErrorMessage } from "../services/api";
interface Stats {
  totalPosts: number;
  publishedPosts: number;
  drafts: number;
  projects: number;
}
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        const response = await api.get("/posts/admin/dashboard");
        if (active) setStats(response.data.data as Stats);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      }
    };
    void loadStats();
    return () => {
      active = false;
    };
  }, []);
  const cards = [
    {
      label: "All articles",
      value: stats?.totalPosts ?? "—",
      icon: FileText,
      note: "Across all statuses",
    },
    {
      label: "Published",
      value: stats?.publishedPosts ?? "—",
      icon: Send,
      note: "Visible to readers",
    },
    {
      label: "Drafts",
      value: stats?.drafts ?? "—",
      icon: PenLine,
      note: "Still in progress",
    },
    {
      label: "Projects",
      value: stats?.projects ?? "—",
      icon: FolderKanban,
      note: "Portfolio entries",
    },
  ];
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">YOUR CONTENT, AT A GLANCE</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-base-content/55">
            A clear view of your publishing workspace.
          </p>
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary">
          <Plus size={17} /> Write an article
        </Link>
      </div>
      {error && <div className="alert alert-warning mt-6">{error}</div>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, note }) => (
          <div
            key={label}
            className="rounded-2xl border border-base-300 bg-base-100 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-base-content/60">
                {label}
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon size={17} />
              </span>
            </div>
            <p className="mt-5 text-3xl font-black">{value}</p>
            <p className="mt-1 text-xs text-base-content/45">{note}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-2xl border border-base-300 bg-base-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Quick actions</h2>
            <span className="text-xs text-base-content/45">Common tasks</span>
          </div>
          <div className="mt-5 space-y-3">
            <Link
              to="/admin/posts/new"
              className="flex items-center gap-4 rounded-xl border border-base-300 p-4 transition hover:border-primary/50 hover:bg-primary/[.03]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <PenLine size={18} />
              </span>
              <span className="flex-1">
                <span className="block font-semibold">Write a new article</span>
                <span className="mt-1 block text-xs text-base-content/50">
                  Draft an idea, tutorial, or engineering note.
                </span>
              </span>
              <ArrowUpRight size={17} className="text-base-content/40" />
            </Link>
            <Link
              to="/admin/posts"
              className="flex items-center gap-4 rounded-xl border border-base-300 p-4 transition hover:border-primary/50 hover:bg-primary/[.03]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-base-200">
                <FileText size={18} />
              </span>
              <span className="flex-1">
                <span className="block font-semibold">Manage articles</span>
                <span className="mt-1 block text-xs text-base-content/50">
                  Edit, publish, or archive existing content.
                </span>
              </span>
              <ArrowUpRight size={17} className="text-base-content/40" />
            </Link>
            <Link
              to="/admin/projects"
              className="flex items-center gap-4 rounded-xl border border-base-300 p-4 transition hover:border-primary/50 hover:bg-primary/[.03]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-base-200">
                <FolderKanban size={18} />
              </span>
              <span className="flex-1">
                <span className="block font-semibold">
                  Update your portfolio
                </span>
                <span className="mt-1 block text-xs text-base-content/50">
                  Document your latest software projects.
                </span>
              </span>
              <ArrowUpRight size={17} className="text-base-content/40" />
            </Link>
          </div>
        </section>
        <aside className="rounded-2xl bg-secondary p-6 text-white">
          <p className="font-mono text-xs text-blue-300">
            // publishing principle
          </p>
          <h2 className="mt-4 text-2xl font-black">
            Share the process,
            <br />
            not just the result.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/65">
            The best technical writing captures the problem, the decisions you
            made, the trade-offs you considered, and what you learned.
          </p>
          <div className="mt-7 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">A good article answers</p>
            <p className="mt-2 font-semibold">
              What did I learn that might help the next developer?
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
