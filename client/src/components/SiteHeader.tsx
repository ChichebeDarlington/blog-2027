import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";

const links = [
  { to: "/blog", label: "Blog" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
];
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("chichebe-theme") === "dark",
  );
  const toggleTheme = () => {
    const nextTheme = dark ? "light" : "dark";
    setDark(!dark);
    document.documentElement.setAttribute(
      "data-theme",
      nextTheme === "dark" ? "dark" : "chichebe",
    );
    localStorage.setItem("chichebe-theme", nextTheme);
  };
  return (
    <header className="sticky top-0 z-40 border-b border-base-300/70 bg-base-100/90 backdrop-blur-xl">
      <div className="site-container flex h-[72px] items-center justify-between gap-5">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-black tracking-tight text-base-content"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-sm text-white">
            C.
          </span>
          chichebe<span className="text-primary">.dev</span>
        </Link>
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-primary ${isActive ? "text-primary" : "text-base-content/70"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="btn btn-primary btn-sm rounded-full px-5"
          >
            Get in touch <span aria-hidden="true">↗</span>
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Toggle color theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-ghost btn-circle btn-sm md:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          className="site-container flex flex-col gap-1 pb-4 md:hidden"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <NavLink
              onClick={() => setMenuOpen(false)}
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-3 font-semibold hover:bg-base-200"
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            onClick={() => setMenuOpen(false)}
            to="/contact"
            className="btn btn-primary mt-2"
          >
            Get in touch ↗
          </Link>
        </nav>
      )}
    </header>
  );
}
