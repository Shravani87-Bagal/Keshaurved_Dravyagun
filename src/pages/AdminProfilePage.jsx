import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/AdminProfilePage.css"

function AdminProfilePage() {
  const navigate = useNavigate()

  // =========================================
  // ADMIN USER
  // =========================================

  const savedAdmin = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  )

  const [fullName, setFullName] = useState(
    savedAdmin?.fullName || "Dr. Anand Sharma"
  )

  const [displayName, setDisplayName] = useState(
    savedAdmin?.displayName ||
      savedAdmin?.fullName ||
      "Dr. Anand Sharma"
  )

  const [email] = useState(
    savedAdmin?.email || "admin@dravyaguna.com"
  )

  const [profilePhoto, setProfilePhoto] = useState(
    savedAdmin?.profilePhoto || ""
  )

  const [saveMessage, setSaveMessage] = useState("")

  const fileInputRef = useRef(null)

  // =========================================
  // CLOSE PROFILE
  // =========================================

  const closeProfile = () => {
    navigate("/admin")
  }

  // =========================================
  // PROFILE PHOTO
  // =========================================

  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.")
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setProfilePhoto(reader.result)
    }

    reader.readAsDataURL(file)

    // Allows selecting the same file again
    event.target.value = ""
  }

  const handleDeletePhoto = () => {
    setProfilePhoto("")
  }

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSave = () => {
    const updatedAdmin = {
      ...(savedAdmin || {}),

      fullName:
        fullName.trim() || "Dr. Anand Sharma",

      displayName:
        displayName.trim() ||
        fullName.trim() ||
        "Dr. Anand Sharma",

      email,

      role: "Administrator",

      profilePhoto
    }

    localStorage.setItem(
      "adminUser",
      JSON.stringify(updatedAdmin)
    )
    
    window.dispatchEvent(new Event("adminProfileUpdated"))

    setSaveMessage(
      "Profile updated successfully."
    )
  }

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

  return (
    <div className="admin-profile-page">

      {/* =========================================
          HEADER
         ========================================= */}

      <div className="admin-profile-page-header">

        <div>

          <p className="admin-profile-page-label">
            ACCOUNT
          </p>

          <h1>
            Profile
          </h1>

          <p className="admin-profile-page-description">
            Manage your administrator profile and account information.
          </p>

        </div>

        {/* Close / Back button */}

        <button
          type="button"
          className="admin-profile-close-button"
          onClick={closeProfile}
          aria-label="Close profile"
        >
          ×
        </button>

      </div>


      {/* =========================================
          PROFILE PHOTO
         ========================================= */}

      <section className="admin-profile-section">

        <div className="admin-profile-section-header">

          <h2>
            Profile photo
          </h2>

          <p>
            Add a photo to personalize your administrator account.
          </p>

        </div>


        <div className="admin-profile-photo-section">

          {/* Avatar */}

          <div className="admin-profile-large-avatar">

            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Administrator profile"
                className="admin-profile-photo"
              />
            ) : (
              initials
            )}

          </div>


          {/* Hidden file input */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="admin-profile-photo-input"
            onChange={handlePhotoChange}
          />


          {/* Photo actions */}

          <div className="admin-profile-photo-actions">

            <button
              type="button"
              className="admin-profile-change-photo"
              onClick={handlePhotoClick}
            >
              {profilePhoto
                ? "Change photo"
                : "Add photo"}
            </button>


            {profilePhoto && (
              <button
                type="button"
                className="admin-profile-delete-photo"
                onClick={handleDeletePhoto}
              >
                Delete photo
              </button>
            )}

          </div>

        </div>

      </section>


      {/* =========================================
          BASIC INFORMATION
         ========================================= */}

      <section className="admin-profile-section">

        <div className="admin-profile-section-header">

          <h2>
            Basic information
          </h2>

          <p>
            Your basic administrator account information.
          </p>

        </div>


        <div className="admin-profile-form">

          {/* Full name */}

          <div className="admin-profile-field">

            <label htmlFor="adminFullName">
              Full name
            </label>

            <input
              id="adminFullName"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
            />

          </div>


          {/* Display name */}

          <div className="admin-profile-field">

            <label htmlFor="adminDisplayName">
              Display name
            </label>

            <input
              id="adminDisplayName"
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(event.target.value)
              }
            />

            <span className="admin-profile-field-help">
              This name will be displayed across the admin workspace.
            </span>

          </div>


          {/* Email */}

          <div className="admin-profile-field">

            <label>
              Email address
            </label>

            <div className="admin-profile-readonly">
              {email}
            </div>

          </div>


          {/* Role */}

          <div className="admin-profile-field">

            <label>
              Role
            </label>

            <div className="admin-profile-readonly">
              Administrator
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          ACCOUNT INFORMATION
         ========================================= */}

      <section className="admin-profile-section">

        <div className="admin-profile-section-header">

          <h2>
            Account information
          </h2>

          <p>
            Current status and administrator account details.
          </p>

        </div>


        <div className="admin-profile-info-grid">

          <div className="admin-profile-info-card">

            <span>
              Account status
            </span>

            <strong className="admin-status-active">
              Active
            </strong>

          </div>


          <div className="admin-profile-info-card">

            <span>
              Account type
            </span>

            <strong>
              Administrator
            </strong>

          </div>


          <div className="admin-profile-info-card">

            <span>
              Access level
            </span>

            <strong>
              Full access
            </strong>

          </div>


          <div className="admin-profile-info-card">

            <span>
              Workspace
            </span>

            <strong>
              Dravyaguna
            </strong>

          </div>

        </div>

      </section>


      {/* =========================================
          ADMIN PERMISSIONS
         ========================================= */}

      <section className="admin-profile-section">

        <div className="admin-profile-section-header">

          <h2>
            Administrator permissions
          </h2>

          <p>
            Areas currently available to your administrator account.
          </p>

        </div>


        <div className="admin-profile-permissions">

          <div className="admin-permission-item">
            <span>✓</span>
            <span>Manage Herbs</span>
          </div>

          <div className="admin-permission-item">
            <span>✓</span>
            <span>Add and Edit Herbs</span>
          </div>

          <div className="admin-permission-item">
            <span>✓</span>
            <span>Vocabulary Management</span>
          </div>

          <div className="admin-permission-item">
            <span>✓</span>
            <span>Scoring Configuration</span>
          </div>

          <div className="admin-permission-item">
            <span>✓</span>
            <span>Search Analytics</span>
          </div>

          <div className="admin-permission-item">
            <span>✓</span>
            <span>User & Role Management</span>
          </div>

          <div className="admin-permission-item">
            <span>✓</span>
            <span>Audit Log</span>
          </div>

        </div>

      </section>


      {/* =========================================
          ACTIONS
         ========================================= */}

      <div className="admin-profile-actions">

        <button
          type="button"
          className="admin-profile-cancel-button"
          onClick={closeProfile}
        >
          Cancel
        </button>


        <button
          type="button"
          className="admin-profile-save-button"
          onClick={handleSave}
        >
          Save changes
        </button>

      </div>


      {/* =========================================
          SUCCESS MESSAGE
         ========================================= */}

      {saveMessage && (
        <p className="admin-profile-save-message">
          {saveMessage}
        </p>
      )}

    </div>
  )
}

export default AdminProfilePage