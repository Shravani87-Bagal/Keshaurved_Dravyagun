import { Link, useLocation } from "react-router-dom"

function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className="admin-sidebar">

      {/* Brand */}
      <div className="admin-brand">
        <div className="admin-brand-icon">🌿</div>

        <div className="admin-brand-text">
          <h2>Dravyaguna</h2>
          <span>Ayurvedic Herb Intelligence</span>
        </div>
      </div>


      {/* Navigation */}
      <nav className="admin-navigation">

        <p className="admin-nav-label">WORKSPACE</p>

        {/* Dashboard */}
        <Link
          to="/admin"
          className={`admin-nav-item ${
            location.pathname === "/admin" ? "active" : ""
          }`}
        >
          <span>▦</span>
          <span>Dashboard</span>
        </Link>


        {/* Manage Herbs */}
        <Link
          to="/admin/manage-herbs"
          className={`admin-nav-item ${
            location.pathname === "/admin/manage-herbs" ? "active" : ""
          }`}
        >
          <span>♧</span>
          <span>Manage Herbs</span>
        </Link>


        {/* Add Herb */}
<Link
  to="/admin/add-herb"
  className={`admin-nav-item ${
    location.pathname === "/admin/add-herb" ? "active" : ""
  }`}
>
  <span>＋</span>
  <span>Add Herb</span>
</Link>


        {/* Vocabulary */}
<Link
  to="/admin/vocabulary"
  className={`admin-nav-item ${
    location.pathname === "/admin/vocabulary" ? "active" : ""
  }`}
>
  <span>▣</span>
  <span>Vocabulary</span>
</Link>


        {/* Scoring Configuration */}
<Link
  to="/admin/scoring"
  className={`admin-nav-item ${
    location.pathname === "/admin/scoring" ? "active" : ""
  }`}
>
  <span>⚙</span>
  <span>Scoring Configuration</span>
</Link>


        {/* Search Analytics */}
<Link
  to="/admin/search-analytics"
  className={`admin-nav-item ${
    location.pathname === "/admin/search-analytics"
      ? "active"
      : ""
  }`}
>
  <span>⌁</span>
  <span>Search Analytics</span>
</Link>


        {/* User & Role Management */}
<Link
  to="/admin/users"
  className={`admin-nav-item ${
    location.pathname === "/admin/users" ? "active" : ""
  }`}
>
  <span>♙</span>
  <span>User & Role Management</span>
</Link>

        {/* Audit Log */}
        <Link
        to="/admin/audit-log"
        className={`admin-nav-item ${
          location.pathname === "/admin/audit-log" ? "active" : ""
           }`}
      >
        <span>▤</span>
        <span>Audit Log</span>
      </Link>
      
      </nav>


      {/* Admin Profile */}
      <div className="admin-profile">

        <div className="admin-profile-avatar">
          AD
        </div>

        <div className="admin-profile-info">
          <strong>Dr. Anand Sharma</strong>
          <span>Administrator</span>
        </div>

        <span className="admin-profile-arrow">⌄</span>

      </div>

    </aside>
  )
}

export default AdminSidebar