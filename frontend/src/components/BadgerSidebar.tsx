import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import "./BadgerSidebar.css";

function BadgerSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar className="badgerSidebar" width="260px">
      <div className="sidebarHeader">
        <div className="sidebarBrand">BadgerPlan</div>
        <div className="sidebarSub">UW–Madison course planner</div>
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

        <MenuItem
          component={<Link to="/builder" />}
          active={pathname === "/builder"}
        >
          Build Plan
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default BadgerSidebar;
