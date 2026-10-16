import { useEffect, useState } from "react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api, getErrorMessage } from "../services/api";
import { Post } from "../types";
export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/posts/admin/all/list", {
        params: { limit: 50, ...(status !== "all" ? { status } : {}) },
      });
      setPosts(response.data.data as Post[]);
      setError("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void loadPosts();
  }, [status]);
  const removePost = async (post: Post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`))
      return;
    try {
      await api.delete(`/posts/admin/${post._id}`);
      await loadPosts();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">CONTENT MANAGEMENT</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Articles</h1>
          <p className="mt-2 text-sm text-base-content/55">
            Write, update, and publish your engineering notes.
          </p>
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary">
          <Plus size={17} /> New article
        </Link>
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <div className="tabs tabs-boxed bg-base-100">
          {["all", "published", "draft", "archived"].map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`tab capitalize ${status === item ? "tab-active" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="text-xs text-base-content/50">
          {posts.length} shown
        </span>
      </div>
      {error && <div className="alert alert-error mt-5">{error}</div>}
      <div className="mt-5 overflow-hidden rounded-2xl border border-base-300 bg-base-100">
        {loading ? (
          <div className="p-10 text-center">
            <span className="loading loading-spinner text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={28} className="mx-auto text-base-content/30" />
            <h2 className="mt-3 font-bold">No articles here yet</h2>
            <p className="mt-1 text-sm text-base-content/50">
              Create an article to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="hover">
                    <td className="min-w-[240px]">
                      <div className="font-semibold">{post.title}</div>
                      <div className="mt-1 text-xs text-base-content/45">
                        {post.category} · {post.readingTime} min read
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${post.status === "published" ? "badge-success" : post.status === "draft" ? "badge-warning" : "badge-ghost"}`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-xs text-base-content/55">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/admin/posts/${post._id}/edit`}
                          className="btn btn-ghost btn-sm"
                          aria-label={`Edit ${post.title}`}
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => void removePost(post)}
                          className="btn btn-ghost btn-sm text-error"
                          aria-label={`Delete ${post.title}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
