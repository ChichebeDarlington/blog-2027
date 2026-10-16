import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock3, Copy, Share2 } from "lucide-react";
import { api, getErrorMessage } from "../services/api";
import { Post } from "../types";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let active = true;
    const loadPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${slug}`);
        if (active) setPost(response.data.data as Post);
      } catch (requestError) {
        if (active)
          setError(
            getErrorMessage(requestError, "Unable to load this article."),
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadPost();
    return () => {
      active = false;
    };
  }, [slug]);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy the link in this browser.");
    }
  };
  if (loading)
    return (
      <div className="site-container py-20">
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl bg-base-200" />
      </div>
    );
  if (error || !post)
    return (
      <div className="site-container py-20">
        <div className="alert alert-warning">
          {error || "Article not found."}
        </div>
        <Link to="/blog" className="btn btn-ghost mt-5">
          <ArrowLeft size={16} /> Back to blog
        </Link>
      </div>
    );
  return (
    <article className="site-container py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-base-content/55 hover:text-primary"
        >
          <ArrowLeft size={16} /> All articles
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-primary">
            {post.category}
          </span>
          <span className="text-base-content/45">{post.difficulty}</span>
        </div>
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-base-content/65">
          {post.excerpt}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-y border-base-300 py-4 text-sm text-base-content/55">
          <div>
            <span>By Chichebe</span>
            <span className="mx-2">·</span>
            <span>
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </span>
            <span className="mx-2">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={14} />
              {post.readingTime} min read
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={copyLink} className="btn btn-ghost btn-sm">
              {copied ? (
                "Copied!"
              ) : (
                <>
                  <Copy size={14} /> Copy link
                </>
              )}
            </button>
            <button
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: post.title,
                      url: window.location.href,
                    });
                  } catch {
                    /* Share dismissed by visitor. */
                  }
                } else {
                  await copyLink();
                }
              }}
              className="btn btn-ghost btn-sm"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt=""
          className="mx-auto mt-9 max-h-[480px] w-full max-w-5xl rounded-2xl object-cover"
        />
      )}
      <div className="prose prose-lg mx-auto mt-10 max-w-3xl prose-headings:tracking-tight prose-a:text-primary prose-pre:bg-[#111827] prose-code:before:content-none prose-code:after:content-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content || ""}
        </ReactMarkdown>
      </div>
      <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-base-300 bg-base-200/60 p-6 sm:p-8">
        <p className="eyebrow">KEEP EXPLORING</p>
        <h2 className="mt-2 text-2xl font-bold">Enjoyed this article?</h2>
        <p className="mt-2 text-sm leading-6 text-base-content/60">
          Explore more engineering notes, practical guides, and lessons from
          building software.
        </p>
        <Link to="/blog" className="btn btn-primary btn-sm mt-5">
          More articles <ArrowLeft className="rotate-180" size={15} />
        </Link>
      </div>
    </article>
  );
}
