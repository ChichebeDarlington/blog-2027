import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearAuthError, loginAdmin } from "../features/auth/authSlice";
export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(
    () => () => {
      dispatch(clearAuthError());
    },
    [dispatch],
  );
  if (user) return <Navigate to="/admin" replace />;
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result))
      navigate("/admin", { replace: true });
  };
  return (
    <main className="grid min-h-screen place-items-center bg-base-200 px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-base-content/60 hover:text-primary"
        >
          <ArrowLeft size={16} /> Back to website
        </Link>
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-soft sm:p-9">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white">
            <LockKeyhole size={22} />
          </div>
          <p className="eyebrow mt-6">PRIVATE WORKSPACE</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm leading-6 text-base-content/60">
            Sign in to manage your articles and projects.
          </p>
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="form-control gap-2">
              <span className="label-text font-semibold">
                Administrator email
              </span>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </label>
            <label className="form-control gap-2">
              <span className="label-text font-semibold">Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter your password"
              />
            </label>
            {error && (
              <div role="alert" className="alert alert-error text-sm">
                {error}
              </div>
            )}
            <button
              disabled={loading}
              className="btn btn-primary w-full"
              type="submit"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Sign in to dashboard"
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-base-content/45">
            Administrator accounts are created by the server seed command.
            Public registration is disabled.
          </p>
        </div>
        <p className="mt-5 text-center text-xs text-base-content/40">
          Chichebe.dev · Secure content management
        </p>
      </div>
    </main>
  );
}
