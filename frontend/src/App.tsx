import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import BadgerSidebar from "./components/BadgerSidebar";
import Builder from "./components/Builder";
import Browse from "./components/Browse";
import Home from "./components/Home";
import PreferencesPage from "./components/PreferencesPage";
import Schedule from "./components/Schedule";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import {
  clearPersistedUserState,
  getSessionUser,
  logOut,
  persistUserState,
  type SessionUser,
} from "./services/session";

function App() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const user = await getSessionUser();
        if (cancelled) return;

        setSessionUser(user);
        if (user) {
          persistUserState(user);
        }
      } catch {
        if (!cancelled) {
          setSessionUser(null);
        }
      } finally {
        if (!cancelled) {
          setSessionLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    await logOut();
    clearPersistedUserState();
    setSessionUser(null);
  }

  return (
    <div className="appShell">
      <BadgerSidebar
        sessionUser={sessionUser}
        onLogout={handleLogout}
        sessionLoading={sessionLoading}
      />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Home sessionUser={sessionUser} />} />
          <Route path="/browse" element={<Browse />} />
          <Route
            path="/signin"
            element={<Signin sessionUser={sessionUser} onSignedIn={setSessionUser} />}
          />
          <Route path="/signup" element={<Signup sessionUser={sessionUser} onSignedUp={setSessionUser} />} />
          <Route path="/builder/completed-courses" element={<Builder />} />
          <Route path="/builder/preferences" element={<PreferencesPage />} />
          <Route
            path="/builder/schedule"
            element={
              <Schedule
                sessionUser={sessionUser}
                sessionLoading={sessionLoading}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
