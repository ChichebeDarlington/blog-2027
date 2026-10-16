import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Code2, ShieldCheck } from "lucide-react";
const areas = [
  {
    icon: Code2,
    title: "Full-stack development",
    text: "Building responsive interfaces and reliable APIs with React, TypeScript, Node.js, Express, and databases.",
  },
  {
    icon: ShieldCheck,
    title: "Security-minded engineering",
    text: "Learning and applying secure development practices, application security, and penetration-testing fundamentals.",
  },
  {
    icon: BookOpen,
    title: "Learning in public",
    text: "Documenting discoveries, explaining technical trade-offs, and sharing practical lessons with other developers.",
  },
];
export default function AboutPage() {
  return (
    <section className="site-container py-14 sm:py-20">
      <p className="eyebrow">A LITTLE ABOUT ME</p>
      <h1 className="page-title max-w-4xl">
        Curious by nature.
        <br />
        <span className="text-primary">Engineer by practice.</span>
      </h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_.7fr]">
        <div className="max-w-2xl space-y-5 text-base leading-8 text-base-content/70">
          <p>
            I’m Chichebe, an electrical engineering graduate and software
            developer interested in building useful products and understanding
            how systems work beneath the surface.
          </p>
          <p>
            My work spans modern frontend development, full-stack JavaScript and
            TypeScript, backend APIs, databases, and cybersecurity learning. I
            enjoy turning ideas into usable applications and documenting the
            decisions that make them dependable.
          </p>
          <p>
            This site is my working notebook: a place to share practical
            tutorials, project case studies, mistakes, and the lessons that come
            from solving real engineering problems.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/projects" className="btn btn-primary">
              Explore projects <ArrowUpRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact me
            </Link>
          </div>
        </div>
        <aside className="rounded-2xl border border-base-300 bg-base-200/60 p-6 sm:p-8">
          <p className="font-mono text-xs text-primary">
            // how I like to work
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            Make it useful.
            <br />
            Make it clear.
            <br />
            Keep improving.
          </h2>
          <p className="mt-4 text-sm leading-7 text-base-content/60">
            Good engineering is not only about writing code. It is about
            understanding the problem, choosing trade-offs deliberately, and
            making the result maintainable.
          </p>
        </aside>
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {areas.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="rounded-2xl border border-base-300 p-6"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon size={20} />
            </div>
            <h3 className="mt-5 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-7 text-base-content/60">
              {text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
