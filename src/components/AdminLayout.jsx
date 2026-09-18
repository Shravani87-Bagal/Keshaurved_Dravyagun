import { Outlet } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminNavbar from "./AdminNavbar"
import "../styles/AdminDashboard.css"

function AdminLayout() {
  return (
    <div className="admin-dashboard">

      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Admin Main Area */}
      <div className="admin-main">

        {/* Admin Top Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default AdminLayout