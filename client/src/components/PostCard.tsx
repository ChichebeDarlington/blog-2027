import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { Post } from "../types";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link
        to={`/blog/${post.slug}`}
        className="block aspect-[16/9] overflow-hidden bg-base-200"
        aria-label={`Read ${post.title}`}
      >
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="cover-placeholder flex h-full items-end p-5">
            <span className="font-mono text-sm text-white/80">
              {post.category} / NOTES
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            {post.category}
          </span>
          <span className="text-base-content/45">{post.difficulty}</span>
        </div>
        <h3 className="mt-4 text-xl font-bold leading-snug tracking-tight">
          <Link
            className="transition hover:text-primary"
            to={`/blog/${post.slug}`}
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-base-content/65">
          {post.excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4 text-xs text-base-content/55">
          <span>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently updated"}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 size={13} />
            {post.readingTime || 1} min{" "}
            <ArrowUpRight
              size={14}
              className="ml-1 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
