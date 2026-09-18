import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const profileRef = useRef(null)

  const savedUser = JSON.parse(
    localStorage.getItem("herbUser") || "null"
  )

  const doctorName = savedUser?.fullName || "Doctor"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  // Close dropdown with Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleProfileAction = (action) => {
    setIsProfileOpen(false)

    if (action === "profile") {
      navigate("/profile")
    }

    if (action === "settings") {
      navigate("/settings")
    }

    if (action === "help") {
      alert("Help and support will be available soon.")
    }

    if (action === "language") {
      navigate("/language")
    }

    if (action === "upgrade") {
      navigate("/upgrade")
    }

    if (action === "learn") {
      navigate("/learn-more")
    }

    if (action === "logout") {
      localStorage.removeItem("isAuthenticated")
      navigate("/auth")
    }
  }

  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="sidebar-brand">

        <div className="brand-icon">
          🌿
        </div>

        <div className="brand-text">
          <h1>Dravyaguna</h1>
          <span>Ayurvedic Herb Intelligence</span>
        </div>

      </div>


      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        <div className="nav-section">

          <p className="nav-label">
            WORKSPACE
          </p>


          {/* Home */}
          <Link
            to="/doctor"
            className={`nav-item ${
              location.pathname === "/doctor"
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">
              ⌂
            </span>

            <span>Home</span>
          </Link>


          {/* Search */}
          <Link
            to="/search"
            className={`nav-item ${
              location.pathname === "/search"
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">
              ⌕
            </span>

            <span>Search</span>
          </Link>


          {/* Compare */}
          <Link
            to="/compare"
            className={`nav-item ${
              location.pathname === "/compare"
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">
              ⇄
            </span>

            <span>Compare</span>
          </Link>


          {/* Favorites */}
          <Link
            to="/favorites"
            className={`nav-item ${
              location.pathname === "/favorites"
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">
              ♡
            </span>

            <span>Favorites</span>
          </Link>

        </div>

      </nav>


      {/* BOTTOM PROFILE */}
      <div className="sidebar-bottom">

        <div
          className="sidebar-profile-wrapper"
          ref={profileRef}
        >

<button
  type="button"
  className={`sidebar-profile ${
    isProfileOpen
      ? "profile-open"
      : ""
  }`}
  onClick={() => {
    setIsProfileOpen((previous) => !previous)
  }}
>

            <div className="profile-avatar">
              DR
            </div>

            <div className="profile-info">
              <strong>{doctorName}</strong>
              <span>Ayurvedic Physician</span>
            </div>

            <span className="sidebar-profile-arrow">
              ▴
            </span>

          </button>


          {/* Sidebar Dropdown */}
          {isProfileOpen && (
            <div className="profile-dropdown sidebar-profile-dropdown">

              {/* Account information */}
              <div className="profile-dropdown-header">

                <strong>
                  {doctorName}
                </strong>

                <span className="profile-dropdown-email">
                  {savedUser?.email ||
                    "Ayurvedic Physician"}
                </span>

              </div>


              {/* Menu */}
              <div className="profile-dropdown-menu">

                <button
                  className="profile-menu-item"
                  type="button"
                  onClick={() =>
                    handleProfileAction("profile")
                  }
                >
                  <span className="profile-menu-icon">
                    ◉
                  </span>

                  <span>Profile</span>
                </button>


                <button
                  className="profile-menu-item"
                  type="button"
                  onClick={() =>
                    handleProfileAction("settings")
                  }
                >
                  <span className="profile-menu-icon">
                    ⚙
                  </span>

                  <span>Settings</span>
                </button>


                <button
                  className="profile-menu-item"
                  type="button"
                  onClick={() =>
                    handleProfileAction("language")
                  }
                >
                  <span className="profile-menu-icon">
                    ◎
                  </span>

                  <span>Language</span>
                </button>


                <button
                  className="profile-menu-item"
                  type="button"
                  onClick={() =>
                    handleProfileAction("help")
                  }
                >
                  <span className="profile-menu-icon">
                    ?
                  </span>

                  <span>Help & support</span>
                </button>


                <button
                  className="profile-menu-item"
                  type="button"
                  onClick={() =>
                    handleProfileAction("upgrade")
                  }
                >
                  <span className="profile-menu-icon">
                    ✦
                  </span>

                  <span>Upgrade plan</span>
                </button>


                <button
                  className="profile-menu-item"
                  type="button"
                  onClick={() =>
                    handleProfileAction("learn")
                  }
                >
                  <span className="profile-menu-icon">
                    ◇
                  </span>

                  <span>Learn more</span>

                  <span className="profile-menu-arrow">
                    ›
                  </span>
                </button>

              </div>


              {/* Logout */}
              <div className="profile-dropdown-footer">

                <button
                  className="profile-menu-item logout-item"
                  type="button"
                  onClick={() =>
                    handleProfileAction("logout")
                  }
                >
                  <span className="profile-menu-icon">
                    ↪
                  </span>

                  <span>Log out</span>
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </aside>
  )
}

export default Sidebar