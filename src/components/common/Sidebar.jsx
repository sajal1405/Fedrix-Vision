import React, { useContext } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserProfileContext } from "../../context/UserProfileContext";
import { SidebarContext } from "../../context/SidebarContext";
import {
  HiViewBoards,
  HiOutlineCalendar,
  HiOutlineNewspaper,
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineBell,
} from "react-icons/hi";

const Sidebar = ({ headerHeight = 0, footerHeight = 0 }) => {
  const { user } = useContext(AuthContext);
  const { profile } = useContext(UserProfileContext);
  const { isOpen, openSidebar, closeSidebar } = useContext(SidebarContext);
  const role = profile?.role || user?.role || "user";

  const navItems = [
    { to: "/dashboard", icon: <HiViewBoards />, label: "Dashboard" },
    { to: "/dashboard/kanban", icon: <HiViewBoards />, label: "Kanban", roles: ["admin", "member", "super_admin"] },
    { to: "/dashboard/calendar", icon: <HiOutlineCalendar />, label: "Calendar", roles: ["admin", "super_admin"] },
    { to: "/dashboard/blog", icon: <HiOutlineNewspaper />, label: "Blog", roles: ["admin", "member", "super_admin"] },
    { to: "/dashboard/agent", icon: <HiOutlineSparkles />, label: "AI Agent", roles: ["admin", "super_admin"] },
    { to: "/dashboard/reminders", icon: <HiOutlineBell />, label: "Reminders", roles: ["admin", "member", "super_admin"] },
    { to: "/dashboard/clients", icon: <HiOutlineUsers />, label: "Brands", roles: ["admin", "super_admin"] },
    { to: "/dashboard/users", icon: <HiOutlineUsers />, label: "Users", roles: ["super_admin"] },
  ];

  return (
    <aside
      onMouseEnter={openSidebar}
      onMouseLeave={closeSidebar}
      style={{ top: headerHeight, bottom: footerHeight }}
      className={`fixed left-0 bg-black border-r border-white/10 px-4 py-8 z-50 shadow-xl overflow-x-hidden transition-all duration-300 ${
        isOpen ? "w-56" : "w-20"
      }`}
    >

      <nav className="flex flex-col space-y-4">
        {navItems
          .filter((item) => !item.roles || item.roles.includes(role))
          .map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-all text-white ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 font-semibold shadow-md'
                    : 'hover:bg-white/10 hover:text-gray-300'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className={`${isOpen ? "inline" : "hidden"}`}>{item.label}</span>
            </NavLink>
          ))}
      </nav>

    </aside>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  headerHeight: PropTypes.number,
  footerHeight: PropTypes.number,
};
