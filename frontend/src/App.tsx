import "./App.css";
import { Routes, Route } from "react-router-dom";
import BadgerSidebar from "./components/BadgerSidebar";
import Builder from "./components/Builder";
import Browse from "./components/Browse";
import Home from "./components/Home";
import PreferencesPage from "./components/PreferencesPage";
import Schedule from "./components/Schedule";

function App() {
  return (
    <div className="appShell">
      <BadgerSidebar />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/builder/completed-courses" element={<Builder />} />
          <Route path="/builder/preferences" element={<PreferencesPage />} />
          <Route path="/builder/schedule" element={<Schedule />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
