import React, { useContext } from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { SidebarContext } from "../../context/SidebarContext";

const DashboardLayout = ({ children }) => {
  const { isOpen } = useContext(SidebarContext);
  return (
    <>
      <Sidebar />
      <div className={`dashboard-main ${isOpen ? 'ml-[220px]' : 'ml-0'}`}>
        <Header />
        {children}
      </div>
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
