import "./App.css";
import { Routes, Route } from "react-router-dom";
import BadgerSidebar from "./components/BadgerSidebar";
import Builder from "./components/Builder";
import Browse from "./components/Browse";
import Home from "./components/Home";
import Preferences from "./components/Preferences";

function App() {
  return (
    <div className="appShell">
      <BadgerSidebar />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/builder/completed-courses" element={<Builder />} />
          <Route path="/builder/preferences" element={<Preferences />} />
          <Route path="/builder/schedule " element={<Builder />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
