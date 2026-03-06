import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "./Home";
import { GamesPage } from "./Games";
import { TournamentsPage } from "./Tournaments";
import { ProfilePage } from "./Profile";
import { LearnPage } from "./Learn";
import { AdminPage } from "./Admin";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
