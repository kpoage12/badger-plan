import Button from "react-bootstrap/Button";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";

import type { SessionUser } from "../services/session";
import "./BadgerSidebar.css";

type BadgerSidebarProps = {
  sessionUser: SessionUser | null;
  sessionLoading: boolean;
  onLogout: () => Promise<void>;
};

function BadgerSidebar({
  sessionUser,
  sessionLoading,
  onLogout,
}: BadgerSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await onLogout();
    navigate("/");
  }

  return (
    <Sidebar className="badgerSidebar" width="260px">
      <div className="sidebarHeader">
        <div className="sidebarBrand">BadgerPlan</div>
        <div className="sidebarSub">UW-Madison course planner</div>
        <div className="small mt-3">
          {sessionLoading
            ? "Loading account..."
            : sessionUser?.email ?? "No account connected"}
        </div>
      </div>

      <Menu className="sidebarMenu">
        <MenuItem component={<Link to="/" />} active={pathname === "/"}>
          Home
        </MenuItem>

        <MenuItem
          component={<Link to="/browse" />}
          active={pathname === "/browse"}
        >
          Browse
        </MenuItem>

        {!sessionUser ? (
          <MenuItem
            component={<Link to="/signin" />}
            active={pathname === "/signin"}
          >
            Sign In
          </MenuItem>
        ) : null}

        {!sessionUser ? (
          <MenuItem
            component={<Link to="/signup" />}
            active={pathname === "/signup"}
          >
            Sign Up
          </MenuItem>
        ) : null}

        <MenuItem
          component={<Link to="/builder/completed-courses" />}
          active={pathname === "/builder/completed-courses"}
        >
          Build Plan
        </MenuItem>
        {sessionUser ? (
          <MenuItem
            onClick={() => {
              void handleLogout();
            }}
          >
            Sign out
          </MenuItem>
        ) : null}
      </Menu>
    </Sidebar>
  );
}

export default BadgerSidebar;
