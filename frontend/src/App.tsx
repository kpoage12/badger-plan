import "./App.css";
import { Routes, Route } from "react-router-dom";
import BadgerSidebar from "./components/BadgerSidebar";

function App() {
  return (
    <div className="appShell">
      <BadgerSidebar />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/browse" element={<h1>Browse</h1>} />
          <Route path="/builder" element={<h1>Build Plan</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
