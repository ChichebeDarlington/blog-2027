import { useEffect, ReactNode } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { checkSession } from "./features/auth/authSlice";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import PostPage from "./pages/PostPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPostsPage from "./pages/AdminPostsPage";
import AdminPostEditorPage from "./pages/AdminPostEditorPage";
import AdminProjectsPage from "./pages/AdminProjectsPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, checking } = useAppSelector((state) => state.auth);
  if (checking)
    return (
      <div className="grid min-h-screen place-items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}
function SessionBootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(checkSession());
  }, [dispatch]);
  return null;
}
function AppRoutes() {
  return (
    <>
      <SessionBootstrap />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<PostPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route
            path="*"
            element={
              <main className="site-container py-24 text-center">
                <p className="eyebrow">404 / NOT FOUND</p>
                <h1 className="mt-3 text-4xl font-black">
                  This page wandered off.
                </h1>
                <p className="mt-3 text-base-content/60">
                  The link may be old, or the page may have moved.
                </p>
                <Link to="/" className="btn btn-primary mt-6">
                  Back home
                </Link>
              </main>
            }
          />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="posts/new" element={<AdminPostEditorPage />} />
          <Route path="posts/:id/edit" element={<AdminPostEditorPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
