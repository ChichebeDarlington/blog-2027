import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-base-300 bg-base-200/60">
      <div className="site-container grid gap-8 py-10 sm:grid-cols-2 sm:items-end">
        <div>
          <Link to="/" className="text-lg font-black">
            chichebe<span className="text-primary">.dev</span>
          </Link>
          <p className="mt-2 max-w-md text-sm leading-6 text-base-content/60">
            Build. Document. Share. Practical engineering notes, experiments,
            and lessons from building software.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:justify-end">
          <a
            className="btn btn-ghost btn-sm"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} /> GitHub
          </a>
          <a
            className="btn btn-ghost btn-sm"
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
          <Link className="btn btn-ghost btn-sm" to="/contact">
            <Mail size={16} /> Contact
          </Link>
        </div>
        <div className="border-t border-base-300 pt-5 text-xs text-base-content/50 sm:col-span-2">
          © {new Date().getFullYear()} Chichebe.dev. Built with curiosity and
          code.
        </div>
      </div>
    </footer>
  );
}
