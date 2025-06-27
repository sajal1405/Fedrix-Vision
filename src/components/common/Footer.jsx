import React, { forwardRef } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = forwardRef((props, ref) => (
  <footer
    ref={ref}
    className="fixed bottom-0 left-0 w-full bg-dark-gray border-t border-mid-gray h-12 flex items-center justify-between px-8 z-30"
  >
    <span className="font-mono text-[12px] text-teal-300 tracking-widest select-none">
      Fedrix Vision Suite
    </span>
    <div className="flex items-center space-x-3">
      <a
        href="https://github.com/fedrix-vision"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-teal-400 text-light-gray text-lg"
      >
        <FaGithub />
      </a>
      <a
        href="https://linkedin.com/company/fedrix-vision"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-teal-400 text-light-gray text-lg"
      >
        <FaLinkedin />
      </a>
      <a
        href="https://twitter.com/fedrix_vision"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-teal-400 text-light-gray text-lg"
      >
        <FaTwitter />
      </a>
      <span className="text-xs text-white/40 ml-4 font-mono">
        v1.0.0 | Fedrix MediaLab
      </span>
    </div>
 </footer>
));
Footer.displayName = 'Footer';
export default Footer;
