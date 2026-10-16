import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  Braces,
  Code2,
  Database,
  Terminal,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPosts } from "../features/posts/postsSlice";
import PostCard from "../components/PostCard";

const stack = [
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Python",
  "Cybersecurity",
];
export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.posts);
  useEffect(() => {
    void dispatch(fetchPosts({ page: 1 }));
  }, [dispatch]);
  const featured = items.find((post) => post.featured) || items[0];
  const latest = items.filter((post) => post._id !== featured?._id).slice(0, 3);
  return (
    <>
      <section className="hero-grid relative overflow-hidden">
        <div className="site-container relative grid min-h-[590px] items-center gap-12 py-16 lg:grid-cols-[1.2fr_.8fr] lg:py-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100/80 px-3 py-2 text-xs font-semibold text-base-content/70">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />{" "}
              FULL-STACK DEVELOPER{" "}
              <span className="text-base-content/30">/</span> ENGINEERING NOTES
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              I build software
              <br />
              and <span className="text-primary">share what</span>
              <br />I learn.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-base-content/65 sm:text-lg">
              Practical tutorials, engineering decisions, and projects built
              with modern web technologies. Notes from the process—not just the
              polished result.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/blog" className="btn btn-primary rounded-full px-6">
                Read the blog <ArrowRight size={17} />
              </Link>
              <Link
                to="/projects"
                className="btn btn-outline rounded-full px-6"
              >
                Explore projects <ArrowDownRight size={17} />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-base-content/45">
              <span className="flex items-center gap-1.5">
                <Code2 size={14} /> Build in public
              </span>
              <span className="flex items-center gap-1.5">
                <Braces size={14} /> Learn by shipping
              </span>
              <span className="flex items-center gap-1.5">
                <Terminal size={14} /> Explain the why
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-primary/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFD166]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#06D6A0]" />
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  developer.ts
                </span>
                <Database size={15} className="text-slate-500" />
              </div>
              <pre className="overflow-x-auto py-6 font-mono text-xs leading-7 sm:text-sm">
                <code>
                  <span className="text-[#C792EA]">const</span>{" "}
                  <span className="text-[#82AAFF]">developer</span> = {"{"}
                  {"\n"} <span className="text-[#F78C6C]">name</span>:{" "}
                  <span className="text-[#C3E88D]">'Chichebe'</span>,{"\n"}{" "}
                  <span className="text-[#F78C6C]">focus</span>: [{"\n"}{" "}
                  <span className="text-[#C3E88D]">
                    'Full-stack engineering'
                  </span>
                  ,{"\n"} <span className="text-[#C3E88D]">'Security'</span>,
                  {"\n"}{" "}
                  <span className="text-[#C3E88D]">'Learning in public'</span>
                  {"\n"} ],{"\n"}{" "}
                  <span className="text-[#F78C6C]">principle</span>:{" "}
                  <span className="text-[#C3E88D]">
                    'Build. Document. Share.'
                  </span>
                  {"\n"}
                  {"}"};{"\n\n"}
                  <span className="text-slate-500">
                    // progress over perfection
                  </span>
                  {"\n"}
                  <span className="text-[#C792EA]">export default</span>{" "}
                  developer;
                </code>
              </pre>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <span className="text-xs text-slate-400">
                  Currently building
                </span>
                <span className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
                  Useful things for the web
                </span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-base-300 bg-base-100 p-4 shadow-soft sm:block">
              <div className="font-mono text-xs text-base-content/50">
                const motto =
              </div>
              <div className="mt-1 font-bold">Keep shipping. ↗</div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-base-300 bg-base-100">
        <div className="site-container flex flex-wrap items-center justify-center gap-x-7 gap-y-3 py-5 sm:justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[.2em] text-base-content/40">
            Tools I work with
          </span>
          {stack.map((item) => (
            <span
              key={item}
              className="text-xs font-semibold text-base-content/65"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
      <section className="site-container py-20 sm:py-24">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FRESH FROM THE EDITOR</p>
            <h2 className="section-title">
              Ideas worth <span className="text-primary">sharing.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-base-content/60">
              Lessons learned while building applications, solving bugs, and
              exploring the details behind the code.
            </p>
          </div>
          <Link
            to="/blog"
            className="btn btn-ghost btn-sm hidden sm:inline-flex"
          >
            All articles <ArrowRight size={16} />
          </Link>
        </div>
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 animate-pulse rounded-2xl bg-base-200"
              />
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="alert alert-warning">{error}</div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
            <Code2 className="mx-auto text-primary" size={30} />
            <h3 className="mt-4 text-xl font-bold">
              The first article is on its way.
            </h3>
            <p className="mt-2 text-sm text-base-content/60">
              Published tutorials will appear here as they are added in the
              admin dashboard.
            </p>
          </div>
        )}
        {!loading && items.length > 0 && (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(featured
                ? [featured, ...latest].slice(0, 3)
                : items.slice(0, 3)
              ).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/blog"
              className="btn btn-outline btn-sm mt-6 w-full sm:hidden"
            >
              Browse all articles <ArrowRight size={16} />
            </Link>
          </>
        )}
      </section>
      <section className="site-container pb-8">
        <div className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[40px] border-white/5" />
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-blue-300">BEYOND THE TUTORIAL</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Software is more than code.{" "}
                <span className="text-blue-300">
                  It’s the decisions behind it.
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                Explore real projects, architecture choices, trade-offs, and the
                lessons that only show up while building.
              </p>
            </div>
            <Link
              to="/projects"
              className="btn border-0 bg-white text-secondary hover:bg-blue-50"
            >
              See my projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
