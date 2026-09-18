import { useState } from "react"
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

  const email = savedUser?.email || "Not available"

  const closeProfile = () => {
    navigate("/doctor")
  }

  const handleSave = () => {
    const updatedUser = {
      ...savedUser,
      fullName: fullName.trim(),
      displayName: displayName.trim()
    }

    localStorage.setItem(
      "herbUser",
      JSON.stringify(updatedUser)
    )

    alert("Profile updated successfully.")
  }

  return (
    <div className="profile-page-layout">

      <DashboardNavbar />

      <div className="profile-page-body">

        <Sidebar />

        <main className="profile-page-content">

          <div className="profile-overlay">

            <div className="profile-modal">

              {/* Close Button */}

              <button
                type="button"
                className="profile-close-button"
                onClick={closeProfile}
                aria-label="Close profile"
              >
                ×
              </button>


              {/* Header */}

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


              {/* Profile Avatar */}

              <div className="profile-avatar-section">

                <div className="profile-large-avatar">
                  {fullName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <button
                  type="button"
                  className="change-photo-button"
                  onClick={() =>
                    alert("Profile photo upload will be available soon.")
                  }
                >
                  Change photo
                </button>

              </div>


              {/* Profile Form */}

              <div className="profile-form">

                {/* Full Name */}

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


                {/* Display Name */}

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


                {/* Professional Role */}

                <div className="profile-field">

                  <label>
                    Professional role
                  </label>

                  <div className="profile-readonly">
                    Ayurvedic Physician
                  </div>

                </div>


                {/* Email */}

                <div className="profile-field">

                  <label>
                    Email address
                  </label>

                  <div className="profile-readonly">
                    {email}
                  </div>

                </div>


                {/* Account Status */}

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


                {/* Save Button */}

                <div className="profile-actions">

                  <button
                    type="button"
                    className="profile-save-button"
                    onClick={handleSave}
                  >
                    Save changes
                  </button>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default ProfilePage