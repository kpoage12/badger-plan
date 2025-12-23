import "./App.css";
import { Routes, Route } from "react-router-dom";
import BadgerSidebar from "./components/BadgerSidebar";
import Builder from "./components/Builder";
import Browse from "./components/Browse";
import Home from "./components/Home";

function App() {
  return (
    <div className="appShell">
      <BadgerSidebar />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/builder" element={<Builder />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
