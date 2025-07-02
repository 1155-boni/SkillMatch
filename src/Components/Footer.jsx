import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-white dark:bg-gray-900 text-[#121416] dark:text-gray-100">
      <footer className="bg-gray-200 text-[#6a7581] py-6 mt-auto">
        <div className="layout-content-container max-w-[960px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-[#121416] text-lg font-semibold mb-2">
              SkillMatch
            </h3>
            <p className="text-sm">Connecting talent with opportunity.</p>
          </div>
          <nav className="flex flex-col md:flex-row gap-4 mb-4 md:mb-0">
            <Link to="/" className="hover:text-[#121416] text-sm">
              Home
            </Link>
            <Link to="/about" className="hover:text-[#121416] text-sm">
              About
            </Link>
            <Link to="/contact" className="hover:text-[#121416] text-sm">
              Contact
            </Link>
          </nav>
          <div>
            <p className="text-sm">
              <strong>Email:</strong> dietboni@gmail.com
            </p>
            <p className="text-sm">
              <strong>Phone:</strong> +254-7439-21109-SKILLMATCH
            </p>
            <p className="text-sm">© 2025 SkillMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
