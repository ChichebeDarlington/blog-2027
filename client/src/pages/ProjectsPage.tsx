import { useEffect, useState } from "react";
import { ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Project } from "../types";
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const loadProjects = async () => {
      try {
        const response = await api.get("/projects");
        if (active) setProjects(response.data.data as Project[]);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadProjects();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="site-container py-14 sm:py-20">
      <p className="eyebrow">SELECTED WORK</p>
      <h1 className="page-title">
        Projects with <span className="text-primary">purpose.</span>
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/65">
        A look at the applications, experiments, and engineering challenges I
        have worked on—what they solve and how they are built.
      </p>
      {loading && (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-80 animate-pulse rounded-2xl bg-base-200"
            />
          ))}
        </div>
      )}
      {error && <div className="alert alert-warning mt-8">{error}</div>}
      {!loading && !error && projects.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-base-300 p-12 text-center">
          <Code2 size={30} className="mx-auto text-primary" />
          <h2 className="mt-4 text-xl font-bold">
            Projects are being documented.
          </h2>
          <p className="mt-2 text-sm text-base-content/60">
            Published case studies will appear here.
          </p>
        </div>
      )}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <article
            key={project._id}
            className="group overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition hover:shadow-soft"
          >
            <div
              className={`relative flex aspect-[16/8] items-end overflow-hidden p-6 ${index % 2 === 0 ? "cover-placeholder" : "cover-placeholder-alt"}`}
            >
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <span className="relative rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 font-mono text-xs text-white backdrop-blur">
                CASE STUDY / {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight">
                  <a
                    href={`/projects/${project.slug}`}
                    className="transition hover:text-primary"
                  >
                    {project.title}
                  </a>
                </h2>
                <ArrowUpRight className="shrink-0 text-base-content/40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="mt-3 text-sm leading-7 text-base-content/65">
                {project.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    className="btn btn-primary btn-sm"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live demo <ExternalLink size={14} />
                  </a>
                )}
                {project.repositoryUrl && (
                  <a
                    className="btn btn-outline btn-sm"
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source code <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
