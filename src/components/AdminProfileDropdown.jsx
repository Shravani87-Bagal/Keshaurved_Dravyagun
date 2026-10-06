import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminProfileDropdown({
  isOpen,
  onToggle,
  onClose
}) {

  const navigate = useNavigate()

  // =========================================
  // ADMIN USER DATA
  // =========================================

  const getAdminUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("adminUser") || "null"
      )
    } catch {
      return null
    }
  }

  const [adminUser, setAdminUser] = useState(getAdminUser())


  // =========================================
  // UPDATE PROFILE DATA WHEN PROFILE IS SAVED
  // =========================================

  useEffect(() => {

    const handleProfileUpdate = () => {
      setAdminUser(getAdminUser())
    }

    window.addEventListener(
      "adminProfileUpdated",
      handleProfileUpdate
    )

    return () => {
      window.removeEventListener(
        "adminProfileUpdated",
        handleProfileUpdate
      )
    }

  }, [])


  // =========================================
  // ADMIN INFORMATION
  // =========================================

  const fullName =
    adminUser?.displayName ||
    adminUser?.fullName ||
    "Dr. Anand Sharma"

  const role =
    adminUser?.role ||
    "Administrator"

  const profilePhoto =
    adminUser?.profilePhoto ||
    ""


  // =========================================
  // AVATAR INITIALS
  // =========================================

  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()


  // =========================================
  // DROPDOWN OPTION CLICK
  // =========================================

  const handleOptionClick = (option) => {

    // Close dropdown first
    onClose()


    // Profile
    if (option === "Profile") {
      navigate("/admin/profile")
      return
    }

    if (option === "Upgrade Plan") {
      navigate("/admin/upgrade-plan")
      return
    }


    // Settings
    if (option === "Settings") {
      navigate("/admin/settings")
      return
    }


    // Language
    if (option === "Language") {
      navigate("/admin/language")
      return
    }


    // Upgrade Plan
    if (option === "Upgrade Plan") {
      navigate("/admin/upgrade")
      return
    }


    // Help Center
    if (option === "Help Center") {
      navigate("/admin/help-support")
      return
    }


    // Privacy & Security
    if (option === "Privacy & Security") {
      navigate("/admin/privacy-security")
      return
    }


    // Logout
    if (option === "Log Out") {
      console.log("Log Out clicked")
      return
    }

  }


  return (
    <div className="admin-profile-dropdown-wrapper">


      {/* =========================================
          ADMIN PROFILE BUTTON
         ========================================= */}

      <button
        type="button"
        className="admin-profile"
        onClick={onToggle}
      >


        {/* =========================================
            ADMIN AVATAR
           ========================================= */}

        <div className="admin-profile-avatar">

          {profilePhoto ? (

            <img
              src={profilePhoto}
              alt="Administrator"
              className="admin-profile-avatar-image"
            />

          ) : (

            initials

          )}

        </div>


        {/* =========================================
            ADMIN INFORMATION
           ========================================= */}

        <div className="admin-profile-info">

          <strong>
            {fullName}
          </strong>

          <span>
            {role}
          </span>

        </div>


        {/* =========================================
            ARROW
           ========================================= */}

        <span
          className={`admin-profile-arrow ${
            isOpen ? "open" : ""
          }`}
        >
          ⌄
        </span>

      </button>


      {/* =========================================
          DROPDOWN MENU
         ========================================= */}

      {isOpen && (

        <div className="admin-profile-dropdown-menu">


          {/* PROFILE */}

          <button
            type="button"
            onClick={() =>
              handleOptionClick("Profile")
            }
          >
            <span>👤</span>
            <span>Profile</span>
          </button>


          {/* SETTINGS */}

          <button
            type="button"
            onClick={() =>
              handleOptionClick("Settings")
            }
          >
            <span>⚙</span>
            <span>Settings</span>
          </button>


          {/* LANGUAGE */}

          <button
            type="button"
            onClick={() =>
              handleOptionClick("Language")
            }
          >
            <span>🌐</span>
            <span>Language</span>
          </button>


          {/* UPGRADE PLAN */}

          <button
            type="button"
            onClick={() =>
              handleOptionClick("Upgrade Plan")
            }
          >
            <span>✦</span>
            <span>Upgrade Plan</span>
          </button>


          {/* HELP CENTER */}

          <button
            type="button"
            onClick={() =>
              handleOptionClick("Help Center")
            }
          >
            <span>?</span>
            <span>Help Center</span>
          </button>


          {/* PRIVACY & SECURITY */}

          <button
            type="button"
            onClick={() =>
              handleOptionClick(
                "Privacy & Security"
              )
            }
          >
            <span>🔒</span>
            <span>Privacy & Security</span>
          </button>


          {/* DIVIDER */}

          <div className="admin-profile-dropdown-divider" />


          {/* LOGOUT */}

          <button
            type="button"
            className="admin-profile-logout"
            onClick={() =>
              handleOptionClick("Log Out")
            }
          >
            <span>↪</span>
            <span>Log Out</span>
          </button>


        </div>

      )}

    </div>
  )
}

export default AdminProfileDropdown