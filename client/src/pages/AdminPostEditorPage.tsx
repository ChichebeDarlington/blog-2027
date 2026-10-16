import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, getErrorMessage } from "../services/api";
import { Post } from "../types";
interface PostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "draft" | "published" | "archived";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
}
const emptyForm: PostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Engineering",
  tags: "",
  difficulty: "Beginner",
  status: "draft",
  featured: false,
  seoTitle: "",
  seoDescription: "",
};
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export default function AdminPostEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  useEffect(() => {
    if (!id) return;
    let active = true;
    const loadPost = async () => {
      try {
        const response = await api.get(`/posts/admin/all/list`, {
          params: { limit: 50 },
        });
        const post = (response.data.data as Post[]).find(
          (item) => item._id === id,
        );
        if (!post) throw new Error("Article not found.");
        if (active) {
          setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content || "",
            coverImage: post.coverImage || "",
            category: post.category,
            tags: post.tags.join(", "),
            difficulty: post.difficulty,
            status: post.status,
            featured: post.featured,
            seoTitle: post.seoTitle || "",
            seoDescription: post.seoDescription || "",
          });
          setSlugTouched(true);
        }
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadPost();
    return () => {
      active = false;
    };
  }, [id]);
  const wordCount = useMemo(
    () => (form.content.trim() ? form.content.trim().split(/\s+/).length : 0),
    [form.content],
  );
  const updateField = <K extends keyof PostForm>(key: K, value: PostForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const handleTitleChange = (value: string) =>
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSavedMessage("");
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    try {
      if (isEditing) await api.patch(`/posts/admin/${id}`, payload);
      else await api.post("/posts/admin", payload);
      setSavedMessage(
        form.status === "published"
          ? "Article published successfully."
          : "Draft saved successfully.",
      );
      if (!isEditing) navigate("/admin/posts", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };
  if (loading)
    return (
      <div className="p-10 text-center">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  return (
    <div className="mx-auto max-w-7xl">
      <Link
        to="/admin/posts"
        className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/55 hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to articles
      </Link>
      <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">CONTENT EDITOR</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {isEditing ? "Edit article" : "Write an article"}
          </h1>
          <p className="mt-2 text-sm text-base-content/55">
            Write clearly. Preview carefully. Publish when ready.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="btn btn-outline btn-sm"
          >
            <Eye size={15} />
            {preview ? "Edit content" : "Preview"}
          </button>
        </div>
      </div>
      {error && (
        <div role="alert" className="alert alert-error mt-5">
          {error}
        </div>
      )}
      {savedMessage && (
        <div role="status" className="alert alert-success mt-5">
          {savedMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_310px]"
      >
        <div className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-7">
            <label className="form-control gap-2">
              <span className="label-text font-semibold">Article title *</span>
              <input
                required
                minLength={4}
                maxLength={160}
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                className="input input-bordered input-lg w-full text-xl font-bold"
                placeholder="A practical guide to..."
              />
            </label>
            <label className="form-control mt-5 gap-2">
              <span className="label-text font-semibold">URL slug *</span>
              <div className="join w-full">
                <span className="join-item flex items-center bg-base-200 px-3 text-xs text-base-content/50">
                  /blog/
                </span>
                <input
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    updateField("slug", slugify(event.target.value));
                  }}
                  className="input input-bordered join-item w-full font-mono text-sm"
                  placeholder="article-url-slug"
                />
              </div>
            </label>
            <label className="form-control mt-5 gap-2">
              <span className="label-text font-semibold">Short excerpt *</span>
              <textarea
                required
                minLength={10}
                maxLength={320}
                rows={3}
                value={form.excerpt}
                onChange={(event) => updateField("excerpt", event.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="What will the reader learn?"
              />
              <span className="self-end text-xs text-base-content/40">
                {form.excerpt.length}/320
              </span>
            </label>
          </section>
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold">Article content *</h2>
                <p className="mt-1 text-xs text-base-content/50">
                  Markdown supported · {wordCount} words · about{" "}
                  {Math.max(1, Math.ceil(wordCount / 200))} min read
                </p>
              </div>
              <span className="badge badge-ghost">Markdown</span>
            </div>
            {preview ? (
              <div className="prose min-h-80 max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {form.content || "*Nothing to preview yet.*"}
                </ReactMarkdown>
              </div>
            ) : (
              <>
                <textarea
                  required
                  minLength={1}
                  rows={20}
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  className="textarea textarea-bordered min-h-[420px] w-full resize-y font-mono text-sm leading-7"
                  placeholder={
                    '## Introduction\n\nExplain the problem you are solving.\n\n```ts\nconst example = "Hello, developer";\n```'
                  }
                />
                <p className="mt-3 text-xs leading-5 text-base-content/45">
                  Use Markdown headings, lists, links, blockquotes, and fenced
                  code blocks. Raw HTML is not enabled in the reader.
                </p>
              </>
            )}
          </section>
        </div>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5">
            <h2 className="font-bold">Publishing</h2>
            <label className="form-control mt-4 gap-2">
              <span className="label-text text-xs font-semibold">Status</span>
              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as PostForm["status"],
                  )
                }
                className="select select-bordered w-full"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  updateField("featured", event.target.checked)
                }
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="text-sm font-medium">Feature on homepage</span>
            </label>
            <div className="mt-5 grid gap-2">
              <button
                disabled={saving}
                type="submit"
                className="btn btn-primary w-full"
              >
                {saving ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <Save size={16} />
                    {form.status === "published"
                      ? "Publish article"
                      : "Save article"}
                  </>
                )}
              </button>
              {isEditing && (
                <Link
                  to={`/blog/${form.slug}`}
                  target="_blank"
                  className="btn btn-outline btn-sm w-full"
                >
                  View public page ↗
                </Link>
              )}
            </div>
          </section>
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5">
            <h2 className="font-bold">Article details</h2>
            <label className="form-control mt-4 gap-2">
              <span className="label-text text-xs font-semibold">
                Category *
              </span>
              <input
                required
                minLength={2}
                maxLength={60}
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                className="input input-bordered input-sm w-full"
                placeholder="React, Backend, Security..."
              />
            </label>
            <label className="form-control mt-4 gap-2">
              <span className="label-text text-xs font-semibold">Tags</span>
              <input
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                className="input input-bordered input-sm w-full"
                placeholder="React, TypeScript, API"
              />
              <span className="text-xs text-base-content/40">
                Separate tags with commas.
              </span>
            </label>
            <label className="form-control mt-4 gap-2">
              <span className="label-text text-xs font-semibold">
                Difficulty
              </span>
              <select
                value={form.difficulty}
                onChange={(event) =>
                  updateField(
                    "difficulty",
                    event.target.value as PostForm["difficulty"],
                  )
                }
                className="select select-bordered select-sm w-full"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>
            <label className="form-control mt-4 gap-2">
              <span className="label-text text-xs font-semibold">
                Cover image URL
              </span>
              <input
                type="url"
                value={form.coverImage}
                onChange={(event) =>
                  updateField("coverImage", event.target.value)
                }
                className="input input-bordered input-sm w-full"
                placeholder="https://..."
              />
            </label>
          </section>
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5">
            <h2 className="font-bold">Search appearance</h2>
            <label className="form-control mt-4 gap-2">
              <span className="label-text text-xs font-semibold">
                SEO title
              </span>
              <input
                maxLength={160}
                value={form.seoTitle}
                onChange={(event) =>
                  updateField("seoTitle", event.target.value)
                }
                className="input input-bordered input-sm w-full"
                placeholder={form.title || "Search title"}
              />
            </label>
            <label className="form-control mt-4 gap-2">
              <span className="label-text text-xs font-semibold">
                SEO description
              </span>
              <textarea
                maxLength={320}
                rows={3}
                value={form.seoDescription}
                onChange={(event) =>
                  updateField("seoDescription", event.target.value)
                }
                className="textarea textarea-bordered textarea-sm w-full"
                placeholder={form.excerpt || "Search description"}
              />
            </label>
          </section>
        </aside>
      </form>
    </div>
  );
}
