import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useApp } from "../../context/AppContext";
import NotificationToast from "../Common/NotificationToast";
import "./Layout.css";

const Layout = () => {
  const { theme } = useApp();

  return (
    <div className={`app-container ${theme}`}>
      <Navbar />
      <div className="main-layout">
        <Outlet />
      </div>
      <NotificationToast />
    </div>
  );
};

export default Layout;
