import { Outlet } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
export default function PublicLayout() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[65vh]">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
