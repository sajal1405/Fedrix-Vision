import React, { useContext } from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { SidebarContext } from "../../context/SidebarContext";

const DashboardLayout = ({ children }) => {
  const { isOpen } = useContext(SidebarContext);
  return (
    <>
      <Sidebar />
      <div className={`dashboard-main ${isOpen ? 'ml-56' : 'ml-20'} min-h-screen flex flex-col`}>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
