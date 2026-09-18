import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

function DashboardNavbar() {
  const navigate = useNavigate()

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const profileRef = useRef(null)

  const savedUser = JSON.parse(
    localStorage.getItem("herbUser") || "null"
  )

  const doctorName = savedUser?.fullName || "Doctor"
  const doctorEmail = savedUser?.email || "Ayurvedic Physician"

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

  // Close dropdown with Escape key
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
    <header className="dashboard-navbar">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-separator">›</span>
        <strong>Home</strong>
      </div>


      {/* Right Side */}
      <div className="navbar-actions">

        {/* Notification */}
        <button
          className="notification-button"
          type="button"
        >
          🔔
        </button>


        {/* Profile */}
        <div
          className="navbar-profile-wrapper"
          ref={profileRef}
        >

          <button
            className={`navbar-profile ${
              isProfileOpen ? "profile-open" : ""
            }`}
            type="button"
            onClick={() =>
              setIsProfileOpen((previous) => !previous)
            }
          >

            <div className="navbar-avatar">
              DR
            </div>

            <div className="navbar-doctor-info">
              <strong>{doctorName}</strong>
              <span>Ayurvedic Physician</span>
            </div>

            <span className="profile-dropdown-arrow">
              ▾
            </span>

          </button>


          {/* Dropdown */}
          {isProfileOpen && (
            <div className="profile-dropdown">

              {/* Account information */}
              <div className="profile-dropdown-header">

                <strong>{doctorName}</strong>

                <span className="profile-dropdown-email">
                  {doctorEmail}
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

    </header>
  )
}

export default DashboardNavbar