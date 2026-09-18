import { useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/EditProfilePage.css"

function EditProfilePage() {

  const navigate = useNavigate()

  const [fullName, setFullName] = useState("Doctor")
  const [email, setEmail] = useState("doctor@example.com")
  const [profession, setProfession] = useState("Ayurvedic Physician")

  return (
    <div className="edit-profile-page-layout">

      {/* Top Navbar */}
      <DashboardNavbar />

      <div className="edit-profile-page-body">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="edit-profile-page-content">

          <div className="edit-profile-content-inner">

            {/* Back */}
            <button
              className="edit-profile-back"
              type="button"
              onClick={() => navigate("/settings")}
            >
              ← Back to settings
            </button>


            {/* Page Header */}
            <section className="edit-profile-header">

              <p className="edit-profile-breadcrumb">
                WORKSPACE / SETTINGS / PROFILE
              </p>

              <h1>
                Edit profile
              </h1>

              <p>
                Update the professional information associated with your account.
              </p>

            </section>


            {/* Profile Picture */}
            <section className="edit-profile-section">

              <div className="edit-profile-section-heading">

                <div>
                  <p className="edit-profile-section-label">
                    PROFILE PICTURE
                  </p>

                  <h2>
                    Your profile image
                  </h2>

                  <p>
                    This image will be displayed across your clinical workspace.
                  </p>
                </div>

              </div>


              <div className="profile-picture-area">

                <div className="edit-profile-avatar">
                  DR
                </div>

                <div className="profile-picture-actions">

                  <button
                    className="profile-picture-button"
                    type="button"
                  >
                    Change picture
                  </button>

                  <button
                    className="profile-picture-remove"
                    type="button"
                  >
                    Remove
                  </button>

                  <p>
                    JPG or PNG. Recommended size: 400 × 400 px.
                  </p>

                </div>

              </div>

            </section>


            {/* Personal Information */}
            <section className="edit-profile-section">

              <div className="edit-profile-section-heading">

                <div>
                  <p className="edit-profile-section-label">
                    PERSONAL INFORMATION
                  </p>

                  <h2>
                    Profile details
                  </h2>

                  <p>
                    Keep your account information up to date.
                  </p>
                </div>

              </div>


              <div className="edit-profile-form">

                {/* Full Name */}
                <div className="edit-profile-field">

                  <label htmlFor="fullName">
                    Full name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />

                </div>


                {/* Email */}
                <div className="edit-profile-field">

                  <label htmlFor="email">
                    Registered email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />

                  <span>
                    This email is used for account verification and password recovery.
                  </span>

                </div>


                {/* Profession */}
                <div className="edit-profile-field">

                  <label htmlFor="profession">
                    Professional designation
                  </label>

                  <input
                    id="profession"
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Ayurvedic Physician"
                  />

                </div>

              </div>

            </section>


            {/* Account Security */}
            <section className="edit-profile-section">

              <div className="edit-profile-section-heading">

                <div>
                  <p className="edit-profile-section-label">
                    ACCOUNT SECURITY
                  </p>

                  <h2>
                    Password and security
                  </h2>

                  <p>
                    Manage your account password securely.
                  </p>
                </div>

              </div>


              <div className="security-action">

                <div>
                  <h3>
                    Change password
                  </h3>

                  <p>
                    Verify your registered email before creating a new password.
                  </p>
                </div>

                <button
                  className="security-change-button"
                  type="button"
                >
                  Change password
                </button>

              </div>

            </section>


            {/* Bottom Actions */}
            <div className="edit-profile-actions">

              <button
                className="edit-profile-cancel"
                type="button"
                onClick={() => navigate("/settings")}
              >
                Cancel
              </button>

              <button
                className="edit-profile-save"
                type="button"
              >
                Save changes
              </button>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default EditProfilePage