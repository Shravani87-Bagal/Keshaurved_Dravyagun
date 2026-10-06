import { useState } from "react"

function AdminNavbar() {

  return (
    <header className="admin-topbar">

      <span className="admin-topbar-title">
        Admin Dashboard
      </span>

      <div className="admin-topbar-actions">

        {/* Quick Search */}
        <div className="admin-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Quick search..."
          />

        </div>


        {/* Notification */}
        <button
          type="button"
          className="admin-notification"
        >
          ♧
          <span></span>
        </button>

      </div>

    </header>
  )
}

export default AdminNavbar