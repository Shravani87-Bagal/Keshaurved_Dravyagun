function AdminNavbar() {
    return (
      <header className="admin-topbar">
  
        <span className="admin-topbar-title">
          Admin Dashboard
        </span>
  
        <div className="admin-topbar-actions">
  
          <div className="admin-search">
            <span>⌕</span>
  
            <input
              type="text"
              placeholder="Quick search..."
            />
          </div>

          <button
            type="button"
            className="admin-notification"
          >
            ♧
            <span></span>
          </button>
  
          <div className="admin-top-avatar">
            AD
          </div>

        </div>
  
      </header>
    )
  }
  
  export default AdminNavbar 