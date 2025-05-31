// src/components/common/Footer.js

import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <span>
        Made with <span style={{ color: "red" }}>❤</span> by{" "}
        <a href="https://fedrixgroup.com" target="_blank" rel="noreferrer" style={linkStyle}>
          Fedrix MediaLab
        </a>
      </span>
    </footer>
  );
};

const footerStyle = {
  width: "100%",
  textAlign: "center",
  padding: "1rem 0",
  color: "rgba(255,255,255,0.5)",
  fontSize: "0.9rem",
  borderTop: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0, 0, 0, 0.6)",
  position: "relative",
  zIndex: 1,
};

const linkStyle = {
  color: "#6f0c8a",
  fontWeight: 500,
  textDecoration: "none",
};

export default Footer;
