import "./AdminLayout.css";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/admin/Header";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleCloseSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="admin-layout">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      <div className="admin-main">

        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
