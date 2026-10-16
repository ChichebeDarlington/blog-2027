import { FormEvent, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchPosts,
  setCategory,
  setQuery,
} from "../features/posts/postsSlice";
import PostCard from "../components/PostCard";

export default function BlogPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error, page, totalPages, query, category, total } =
    useAppSelector((state) => state.posts);
  useEffect(() => {
    void dispatch(fetchPosts({ page, q: query, category }));
  }, [dispatch, page, query, category]);
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch(fetchPosts({ page: 1, q: query, category }));
  };
  const categories = Array.from(
    new Set(items.map((post) => post.category)),
  ).sort();

  return (
    <section className="site-container py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">THE ENGINEERING JOURNAL</p>
        <h1 className="page-title">
          The <span className="text-primary">blog.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/65">
          Practical guides, debugging notes, architecture decisions, and ideas
          from the process of building software.
        </p>
      </div>
      <form
        onSubmit={handleSearch}
        className="mt-10 grid gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 sm:grid-cols-[1fr_220px_auto]"
      >
        <label className="input input-bordered flex items-center gap-3 rounded-xl">
          <Search size={18} className="text-base-content/45" />
          <input
            value={query}
            onChange={(event) => dispatch(setQuery(event.target.value))}
            className="grow"
            placeholder="Search articles, topics, tags..."
            aria-label="Search articles"
          />
        </label>
        <label className="select select-bordered flex items-center gap-2 rounded-xl">
          <SlidersHorizontal size={16} className="text-base-content/45" />
          <select
            value={category}
            onChange={(event) => dispatch(setCategory(event.target.value))}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary rounded-xl px-6" type="submit">
          Search
        </button>
      </form>
      <div className="mb-5 mt-8 flex items-center justify-between text-sm text-base-content/55">
        <span>
          {total} {total === 1 ? "article" : "articles"}
        </span>
        <span className="text-xs">Newest first</span>
      </div>
      {loading && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-80 animate-pulse rounded-2xl bg-base-200"
            />
          ))}
        </div>
      )}
      {!loading && error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-base-300 p-12 text-center">
          <h2 className="text-xl font-bold">No articles found</h2>
          <p className="mt-2 text-sm text-base-content/60">
            Try a different search term or category.
          </p>
          <button
            type="button"
            onClick={() => {
              dispatch(setQuery(""));
              dispatch(setCategory(""));
            }}
            className="btn btn-ghost btn-sm mt-4"
          >
            Clear filters
          </button>
        </div>
      )}
      {!loading && items.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            disabled={page <= 1 || loading}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              void dispatch(fetchPosts({ page: page - 1, q: query, category }));
            }}
            className="btn btn-outline btn-sm"
          >
            Previous
          </button>
          <span className="text-sm text-base-content/60">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              void dispatch(fetchPosts({ page: page + 1, q: query, category }));
            }}
            className="btn btn-outline btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
