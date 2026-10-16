import { FormEvent, useEffect, useState } from "react";
import { FolderKanban, Plus, Trash2 } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Project } from "../types";
interface ProjectForm {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  technologies: string;
  repositoryUrl: string;
  liveUrl: string;
  featured: boolean;
  status: "draft" | "published";
}
const initialForm: ProjectForm = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  coverImage: "",
  technologies: "",
  repositoryUrl: "",
  liveUrl: "",
  featured: false,
  status: "draft",
};
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const loadProjects = async () => {
    try {
      const response = await api.get("/projects/admin/all/list");
      setProjects(response.data.data as Project[]);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void loadProjects();
  }, []);
  const updateField = <K extends keyof ProjectForm>(
    key: K,
    value: ProjectForm[K],
  ) => setForm((current) => ({ ...current, [key]: value }));
  const editProject = (project: Project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      content: project.content,
      coverImage: project.coverImage || "",
      technologies: project.technologies.join(", "),
      repositoryUrl: project.repositoryUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured,
      status: project.status,
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const resetForm = () => {
    setEditingId("");
    setForm(initialForm);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const payload = {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) await api.patch(`/projects/admin/${editingId}`, payload);
      else await api.post("/projects/admin", payload);
      await loadProjects();
      resetForm();
      setMessage("Project saved successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };
  const deleteProject = async (project: Project) => {
    if (!window.confirm(`Delete “${project.title}”?`)) return;
    try {
      await api.delete(`/projects/admin/${project._id}`);
      await loadProjects();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };
  return (
    <div className="mx-auto max-w-7xl">
      <p className="eyebrow">PORTFOLIO MANAGEMENT</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Projects</h1>
      <p className="mt-2 text-sm text-base-content/55">
        Document your work and publish case studies.
      </p>
      {error && <div className="alert alert-error mt-5">{error}</div>}
      {message && <div className="alert alert-success mt-5">{message}</div>}
      <form
        onSubmit={handleSubmit}
        className="mt-7 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-7"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {editingId ? "Edit project" : "Add a project"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-ghost btn-xs"
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="form-control gap-2">
            <span className="label-text font-semibold">Title *</span>
            <input
              required
              minLength={3}
              value={form.title}
              onChange={(event) => {
                const title = event.target.value;
                setForm((current) => ({
                  ...current,
                  title,
                  slug: editingId ? current.slug : slugify(title),
                }));
              }}
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control gap-2">
            <span className="label-text font-semibold">Slug *</span>
            <input
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              value={form.slug}
              onChange={(event) =>
                updateField("slug", slugify(event.target.value))
              }
              className="input input-bordered w-full font-mono text-sm"
            />
          </label>
          <label className="form-control gap-2 md:col-span-2">
            <span className="label-text font-semibold">Summary *</span>
            <textarea
              required
              minLength={10}
              maxLength={320}
              rows={2}
              value={form.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              className="textarea textarea-bordered w-full"
            />
          </label>
          <label className="form-control gap-2 md:col-span-2">
            <span className="label-text font-semibold">
              Case study content *
            </span>
            <textarea
              required
              rows={6}
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              className="textarea textarea-bordered w-full font-mono text-sm"
              placeholder="Problem, architecture, implementation, trade-offs, lessons learned..."
            />
          </label>
          <label className="form-control gap-2">
            <span className="label-text font-semibold">Technologies</span>
            <input
              value={form.technologies}
              onChange={(event) =>
                updateField("technologies", event.target.value)
              }
              className="input input-bordered w-full"
              placeholder="React, Node.js, MongoDB"
            />
          </label>
          <label className="form-control gap-2">
            <span className="label-text font-semibold">Cover image URL</span>
            <input
              type="url"
              value={form.coverImage}
              onChange={(event) =>
                updateField("coverImage", event.target.value)
              }
              className="input input-bordered w-full"
              placeholder="https://..."
            />
          </label>
          <label className="form-control gap-2">
            <span className="label-text font-semibold">Repository URL</span>
            <input
              type="url"
              value={form.repositoryUrl}
              onChange={(event) =>
                updateField("repositoryUrl", event.target.value)
              }
              className="input input-bordered w-full"
              placeholder="https://github.com/..."
            />
          </label>
          <label className="form-control gap-2">
            <span className="label-text font-semibold">Live demo URL</span>
            <input
              type="url"
              value={form.liveUrl}
              onChange={(event) => updateField("liveUrl", event.target.value)}
              className="input input-bordered w-full"
              placeholder="https://..."
            />
          </label>
          <label className="form-control gap-2">
            <span className="label-text font-semibold">Visibility</span>
            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as ProjectForm["status"],
                )
              }
              className="select select-bordered w-full"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="flex items-center gap-3 self-center">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
              className="checkbox checkbox-primary checkbox-sm"
            />
            <span className="text-sm font-medium">Feature project</span>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button disabled={saving} type="submit" className="btn btn-primary">
            {saving ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <Plus size={16} />
                {editingId ? "Update project" : "Save project"}
              </>
            )}
          </button>
        </div>
      </form>
      <section className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-7">
        <h2 className="text-lg font-bold">
          Your projects{" "}
          <span className="ml-2 text-sm font-normal text-base-content/45">
            {projects.length}
          </span>
        </h2>
        {loading ? (
          <div className="py-8 text-center">
            <span className="loading loading-spinner text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="py-10 text-center">
            <FolderKanban className="mx-auto text-base-content/30" size={28} />
            <p className="mt-3 text-sm text-base-content/55">
              No projects yet. Add your first one above.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-base-300">
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 text-xs text-base-content/50">
                    {project.technologies.join(" · ")} ·{" "}
                    <span
                      className={
                        project.status === "published"
                          ? "text-success"
                          : "text-warning"
                      }
                    >
                      {project.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editProject(project)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => void deleteProject(project)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
