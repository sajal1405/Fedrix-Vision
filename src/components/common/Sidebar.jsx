import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserProfileContext } from "../../context/UserProfileContext";
import {
  HiViewBoards,
  HiOutlineCalendar,
  HiOutlineNewspaper,
  HiOutlineLogout,
} from "react-icons/hi";

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const { logoutProfile, profile } = useContext(UserProfileContext);
  const navigate = useNavigate();
  const tier = profile?.tier || user?.role || "client";

  const handleLogout = () => {
    logout();
    logoutProfile();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: <HiViewBoards />, label: "Dashboard" },
    { to: "/dashboard/kanban", icon: <HiViewBoards />, label: "Kanban", roles: ["admin", "client", "superadmin"] },
    { to: "/dashboard/calendar", icon: <HiOutlineCalendar />, label: "Calendar", roles: ["admin", "superadmin"] },
    { to: "/dashboard/blog", icon: <HiOutlineNewspaper />, label: "Blog", roles: ["admin", "superadmin"] },
  ];

  return (
    <aside
      className="fixed top-0 left-0 h-full w-56 bg-black border-r border-white/10 px-6 py-8 z-50 shadow-xl"
      data-aos="fade-right"
    >
      <div className="text-center mb-10">
        <h1 className="text-fedrix text-xl font-bold">Fedrix Vision</h1>
        <p className="text-white/40 text-xs mt-1">Welcome, {profile?.name?.split(" ")[0]}</p>
      </div>

      <nav className="flex flex-col space-y-4">
        {navItems
          .filter((item) => !item.roles || item.roles.includes(tier))
          .map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-all text-white ${
                  isActive
                    ? "bg-fedrix font-semibold shadow-md"
                    : "hover:bg-white/10 hover:text-fedrix"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="absolute bottom-6 w-full left-0 px-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-white/70 hover:text-red-500 transition-all"
        >
          <HiOutlineLogout className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
