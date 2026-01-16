import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getSidebarItems } from "../../services/sidebarService";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const items = await getSidebarItems();
        setMenuItems(items);
      } catch (err) {
        console.error("Error loading sidebar:", err);
      }
    };
    fetchMenu();
  }, []);

  return (
    <>
      <button
        id="show-sidebar"
        className="btn btn-sm btn-dark"
        onClick={toggleSidebar}
        style={{ zIndex:3 }}
      >
        <i className="ri-menu-line ri-lg"></i>
      </button>
      <nav id="sidebar" className="sidebar-wrapper bg-dark text-white">
        <div className="sidebar-content">
          <div className="sidebar-brand d-flex justify-content-between align-items-center p-3">
            <Link to="/" className="text-white fw-bold text-decoration-none">
              <img
                src="/logorempli.png"
                alt="Logo"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </Link>
            <div id="close-sidebar" onClick={toggleSidebar} style={{ cursor: "pointer" }}>
              <i className="ri-close-line ri-lg"></i>
            </div>
          </div>
          <div className="sidebar-menu p-3">
            <ul className="nav flex-column mt-4 text-gray-400">
              {menuItems.map(({ path, icon, label }) => (
                <li className="nav-item" key={path}>
                  <Link
                    to={path}
                    className={`nav-link px-4 py-3 ${
                      location.pathname === path ? "active text-white" : ""
                    }`}
                  >
                    <i className={`${icon} me-3`}></i>
                    <span className="nav-text">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
