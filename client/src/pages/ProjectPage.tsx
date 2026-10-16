import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Project } from "../types";
export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/${slug}`);
        if (active) setProject(response.data.data as Project);
      } catch (requestError) {
        if (active)
          setError(getErrorMessage(requestError, "Project not found."));
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadProject();
    return () => {
      active = false;
    };
  }, [slug]);
  if (loading)
    return (
      <div className="site-container py-20">
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl bg-base-200" />
      </div>
    );
  if (error || !project)
    return (
      <div className="site-container py-20">
        <div className="alert alert-warning">
          {error || "Project not found."}
        </div>
        <Link to="/projects" className="btn btn-ghost mt-5">
          <ArrowLeft size={16} /> Projects
        </Link>
      </div>
    );
  return (
    <article className="site-container py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/55 hover:text-primary"
        >
          <ArrowLeft size={16} /> All projects
        </Link>
        <p className="eyebrow mt-8">PROJECT CASE STUDY</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-base-content/65">
          {project.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="badge badge-outline py-3">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
            >
              Live demo <ExternalLink size={14} />
            </a>
          )}
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
            >
              Source code <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt=""
          className="mx-auto mt-9 max-h-[480px] w-full max-w-5xl rounded-2xl object-cover"
        />
      )}
      <div className="prose prose-lg mx-auto mt-10 max-w-3xl prose-headings:tracking-tight prose-a:text-primary prose-pre:bg-[#111827]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {project.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
