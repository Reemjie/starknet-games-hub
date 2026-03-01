import { Nav } from "./components/Nav";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: "100vh" }}>
        <Outlet />
      </main>
    </>
  );
}
