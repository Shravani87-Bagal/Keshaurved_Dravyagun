import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/ProfilePage.css"

function ProfilePage() {
  const navigate = useNavigate()

  const savedUser = JSON.parse(
    localStorage.getItem("herbUser") || "null"
  )

  const [fullName, setFullName] = useState(
    savedUser?.fullName || "Doctor"
  )

  const [displayName, setDisplayName] = useState(
    savedUser?.displayName || savedUser?.fullName || "Doctor"
  )

  const [profilePhoto, setProfilePhoto] = useState(
    savedUser?.profilePhoto || ""
  )

  const [saveMessage, setSaveMessage] = useState("")

  const fileInputRef = useRef(null)

  const email = savedUser?.email || "Not available"

  const closeProfile = () => {
    navigate("/doctor")
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

    // Allow only image files
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.")
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setProfilePhoto(reader.result)
    }

    reader.readAsDataURL(file)

    // Allows selecting the same file again later
    event.target.value = ""
  }

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSave = () => {
    const updatedUser = {
      ...(savedUser || {}),
      fullName: fullName.trim() || "Doctor",
      displayName:
        displayName.trim() ||
        fullName.trim() ||
        "Doctor",
      profilePhoto: profilePhoto
    }

    localStorage.setItem(
      "herbUser",
      JSON.stringify(updatedUser)
    )

    setSaveMessage("Profile updated successfully.")

    // Automatically close profile page
    setTimeout(() => {
      navigate("/doctor")
    }, 1200)
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
    <div className="profile-page-layout">

      <DashboardNavbar />

      <div className="profile-page-body">

        <Sidebar />

        <main className="profile-page-content">

          <div className="profile-overlay">

            <div className="profile-modal">

              {/* =========================================
                  CLOSE BUTTON
                  ========================================= */}

              <button
                type="button"
                className="profile-close-button"
                onClick={closeProfile}
                aria-label="Close profile"
              >
                ×
              </button>


              {/* =========================================
                  HEADER
                  ========================================= */}

              <div className="profile-header">

                <p className="profile-label">
                  ACCOUNT
                </p>

                <h1>
                  Profile
                </h1>

                <p>
                  Manage your personal and professional profile information.
                </p>

              </div>


              {/* =========================================
                  PROFILE AVATAR
                  ========================================= */}

              <div className="profile-avatar-section">

                <div className="profile-large-avatar">

                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="profile-photo"
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
                  className="profile-photo-input"
                  onChange={handlePhotoChange}
                />


                {/* Add / Change Photo */}

               {/* Add / Change Photo */}

<button 
  type="button" 
  className="change-photo-button" 
  onClick={handlePhotoClick} 
> 
  {profilePhoto
    ? "Change photo"
    : "Add photo"} 
</button>


{/* Delete Photo — only show when photo exists */}

{profilePhoto && (
  <button
    type="button"
    className="delete-photo-button"
    onClick={() => setProfilePhoto("")}
  >
    Delete photo
  </button>
)}

              </div>


              {/* =========================================
                  PROFILE FORM
                  ========================================= */}

              <div className="profile-form">

                {/* FULL NAME */}

                <div className="profile-field">

                  <label htmlFor="fullName">
                    Full name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                  />

                </div>


                {/* DISPLAY NAME */}

                <div className="profile-field">

                  <label htmlFor="displayName">
                    Display name
                  </label>

                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(event) =>
                      setDisplayName(event.target.value)
                    }
                  />

                  <span className="profile-field-help">
                    This is the name displayed across the application.
                  </span>

                </div>


                {/* PROFESSIONAL ROLE */}

                <div className="profile-field">

                  <label>
                    Professional role
                  </label>

                  <div className="profile-readonly">
                    Ayurvedic Physician
                  </div>

                </div>


                {/* EMAIL */}

                <div className="profile-field">

                  <label>
                    Email address
                  </label>

                  <div className="profile-readonly">
                    {email}
                  </div>

                </div>


                {/* ACCOUNT INFORMATION */}

                <div className="profile-info-row">

                  <div>

                    <span className="profile-info-label">
                      Account status
                    </span>

                    <strong>
                      Active
                    </strong>

                  </div>

                  <div>

                    <span className="profile-info-label">
                      Account type
                    </span>

                    <strong>
                      Doctor
                    </strong>

                  </div>

                </div>


                {/* =========================================
                    SAVE BUTTON
                    ========================================= */}

                <div className="profile-actions">

                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={handleSave}
                  >
                    Save changes
                  </button>

                </div>


                {/* =========================================
                    SUCCESS MESSAGE
                    ========================================= */}

                {saveMessage && (
                  <p className="profile-save-message">
                    {saveMessage}
                  </p>
                )}

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default ProfilePage