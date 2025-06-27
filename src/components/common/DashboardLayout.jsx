import React, { useContext, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { SidebarContext } from "../../context/SidebarContext";

const DashboardLayout = ({ children }) => {
  const { isOpen } = useContext(SidebarContext);
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [offsets, setOffsets] = useState({ header: 0, footer: 0 });

  useEffect(() => {
    const update = () => {
      setOffsets({
        header: headerRef.current?.offsetHeight || 0,
        footer: footerRef.current?.offsetHeight || 0,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      <Sidebar headerHeight={offsets.header} footerHeight={offsets.footer} />
      <div
        className={`dashboard-main ${isOpen ? 'ml-56' : 'ml-20'} min-h-screen flex flex-col`}
        style={{ paddingTop: offsets.header, paddingBottom: offsets.footer }}
      >
        <Header ref={headerRef} />
        <div
          className="flex-1 overflow-y-auto"
          style={{ minHeight: `calc(100vh - ${offsets.header + offsets.footer}px)` }}
        >
          {children}
        </div>
        <Footer ref={footerRef} />
      </div>
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
