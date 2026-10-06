import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/AdminSettingsPage.css"

function AdminSettingsPage() {
  const navigate = useNavigate()

  // =========================================
  // SETTINGS STATE
  // =========================================

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const [emailNotifications, setEmailNotifications] = useState(true)

  const [verificationNotifications, setVerificationNotifications] =
    useState(true)

  const [systemNotifications, setSystemNotifications] =
    useState(true)

  const [requireReferences, setRequireReferences] =
    useState(true)

  const [showPendingChanges, setShowPendingChanges] =
    useState(true)

  const [showAnalytics, setShowAnalytics] =
    useState(true)

  const [showRecentActivity, setShowRecentActivity] =
    useState(true)

  const [activityLogging, setActivityLogging] =
    useState(true)

  const [saveMessage, setSaveMessage] = useState("")


  // =========================================
  // PASSWORD MODAL STATE
  // =========================================

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(false)

  const [currentPassword, setCurrentPassword] =
    useState("")

  const [newPassword, setNewPassword] =
    useState("")

  const [confirmPassword, setConfirmPassword] =
    useState("")

  const [passwordMessage, setPasswordMessage] =
    useState("")


  // =========================================
  // CLOSE SETTINGS
  // =========================================

  const closeSettings = () => {
    navigate("/admin")
  }


  // =========================================
  // OPEN PASSWORD MODAL
  // =========================================

  const openPasswordModal = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordMessage("")

    setIsPasswordModalOpen(true)
  }


  // =========================================
  // CLOSE PASSWORD MODAL
  // =========================================

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false)

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setPasswordMessage("")
  }


  // =========================================
  // PASSWORD VALIDATION
  // =========================================

  const handlePasswordUpdate = () => {

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordMessage(
        "Please fill in all password fields."
      )

      return
    }


    if (newPassword !== confirmPassword) {
      setPasswordMessage(
        "New passwords do not match."
      )

      return
    }


    if (newPassword.length < 8) {
      setPasswordMessage(
        "Password must contain at least 8 characters."
      )

      return
    }


    /*
      Frontend validation is complete.

      The actual password change will be handled
      by the backend when authentication is connected.
    */

    setPasswordMessage(
      "Password validation successful. Backend connection is required to change the actual password."
    )
  }


  // =========================================
  // SAVE SETTINGS
  // =========================================

  const handleSave = () => {

    const adminSettings = {

      twoFactorEnabled,

      emailNotifications,

      verificationNotifications,

      systemNotifications,

      requireReferences,

      showPendingChanges,

      showAnalytics,

      showRecentActivity,

      activityLogging
    }


    localStorage.setItem(
      "adminSettings",
      JSON.stringify(adminSettings)
    )


    setSaveMessage(
      "Settings updated successfully."
    )
  }


  return (
    <div className="admin-settings-overlay">

      <div className="admin-settings-modal">

        {/* =========================================
            HEADER
           ========================================= */}

        <div className="admin-settings-page-header">

          <div>

            <p className="admin-settings-page-label">
              ADMINISTRATION
            </p>

            <h1>
              Settings
            </h1>

            <p className="admin-settings-page-description">
              Manage your administrator account and workspace preferences.
            </p>

          </div>


          {/* Close settings */}

          <button
            type="button"
            className="admin-settings-close-button"
            onClick={closeSettings}
            aria-label="Close settings"
          >
            ×
          </button>

        </div>


        {/* =========================================
            ACCOUNT & SECURITY
           ========================================= */}

        <section className="admin-settings-section">

          <div className="admin-settings-section-header">

            <h2>
              Account & Security
            </h2>

            <p>
              Manage your administrator account security.
            </p>

          </div>


          {/* CHANGE PASSWORD */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Change password
              </strong>

              <span>
                Update your administrator account password.
              </span>

            </div>


            <button
              type="button"
              className="admin-settings-secondary-button"
              onClick={openPasswordModal}
            >
              Change
            </button>

          </div>


          {/* TWO FACTOR */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Two-factor authentication
              </strong>

              <span>
                Add an additional layer of protection to your account.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(event) =>
                  setTwoFactorEnabled(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>


          {/* ACTIVE SESSIONS */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Active sessions
              </strong>

              <span>
                Review devices currently signed into your account.
              </span>

            </div>


            <button
              type="button"
              className="admin-settings-secondary-button"
              onClick={() =>
                alert(
                  "Active sessions will be available after backend authentication is connected."
                )
              }
            >
              View
            </button>

          </div>


          {/* LOGIN ACTIVITY */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Login activity
              </strong>

              <span>
                Review recent administrator login activity.
              </span>

            </div>


            <button
              type="button"
              className="admin-settings-secondary-button"
              onClick={() =>
                alert(
                  "Login activity will be available after backend authentication is connected."
                )
              }
            >
              View
            </button>

          </div>

        </section>


        {/* =========================================
            ADMIN WORKSPACE
           ========================================= */}

        <section className="admin-settings-section">

          <div className="admin-settings-section-header">

            <h2>
              Admin Workspace
            </h2>

            <p>
              Control how the administrator workspace behaves.
            </p>

          </div>


          {/* CONFIRM DELETE */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Confirm before deleting herbs
              </strong>

              <span>
                Ask for confirmation before permanent deletion.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>


          {/* AUTO SAVE */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Auto-save preferences
              </strong>

              <span>
                Automatically remember workspace preferences.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                defaultChecked
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>

        </section>


        {/* =========================================
            NOTIFICATIONS
           ========================================= */}

        <section className="admin-settings-section">

          <div className="admin-settings-section-header">

            <h2>
              Notifications
            </h2>

            <p>
              Choose which administrator notifications you receive.
            </p>

          </div>


          {/* NEW HERB SUBMISSIONS */}

          <div className="admin-settings-option">

            <div>

              <strong>
                New herb submissions
              </strong>

              <span>
                Notify when a new herb is submitted.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(event) =>
                  setEmailNotifications(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>


          {/* VERIFICATION */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Herb verification requests
              </strong>

              <span>
                Notify when herbs require verification.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={verificationNotifications}
                onChange={(event) =>
                  setVerificationNotifications(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>


          {/* SYSTEM ALERTS */}

          <div className="admin-settings-option">

            <div>

              <strong>
                System alerts
              </strong>

              <span>
                Receive important system and security alerts.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={systemNotifications}
                onChange={(event) =>
                  setSystemNotifications(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>

        </section>


        {/* =========================================
            HERB & KNOWLEDGE MANAGEMENT
           ========================================= */}

        <section className="admin-settings-section">

          <div className="admin-settings-section-header">

            <h2>
              Herb & Knowledge Management
            </h2>

            <p>
              Configure verification and knowledge management preferences.
            </p>

          </div>


          {/* REQUIRE REFERENCES */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Require references before verification
              </strong>

              <span>
                Require supporting references before an herb is verified.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={requireReferences}
                onChange={(event) =>
                  setRequireReferences(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>


          {/* PENDING CHANGES */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Show pending changes
              </strong>

              <span>
                Display pending herb and vocabulary changes.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={showPendingChanges}
                onChange={(event) =>
                  setShowPendingChanges(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>

        </section>


        {/* =========================================
            DASHBOARD PREFERENCES
           ========================================= */}

        <section className="admin-settings-section">

          <div className="admin-settings-section-header">

            <h2>
              Dashboard Preferences
            </h2>

            <p>
              Customize the information shown on your admin dashboard.
            </p>

          </div>


          {/* ANALYTICS */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Show analytics
              </strong>

              <span>
                Display analytics information on the dashboard.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={showAnalytics}
                onChange={(event) =>
                  setShowAnalytics(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>


          {/* RECENT ACTIVITY */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Show recent activity
              </strong>

              <span>
                Display recent administrator activity.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={showRecentActivity}
                onChange={(event) =>
                  setShowRecentActivity(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>

        </section>


        {/* =========================================
            PRIVACY & DATA
           ========================================= */}

        <section className="admin-settings-section">

          <div className="admin-settings-section-header">

            <h2>
              Privacy & Data
            </h2>

            <p>
              Control administrator activity and data preferences.
            </p>

          </div>


          {/* ACTIVITY LOGGING */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Activity logging
              </strong>

              <span>
                Keep a record of important administrator actions.
              </span>

            </div>


            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={activityLogging}
                onChange={(event) =>
                  setActivityLogging(
                    event.target.checked
                  )
                }
              />

              <span className="admin-settings-slider"></span>

            </label>

          </div>


          {/* EXPORT */}

          <div className="admin-settings-option">

            <div>

              <strong>
                Export account data
              </strong>

              <span>
                Export your administrator account information.
              </span>

            </div>


            <button
              type="button"
              className="admin-settings-secondary-button"
              onClick={() =>
                alert(
                  "Account data export will be connected to the backend later."
                )
              }
            >
              Export
            </button>

          </div>

        </section>


        {/* =========================================
            ACTIONS
           ========================================= */}

        <div className="admin-settings-actions">

          <button
            type="button"
            className="admin-settings-cancel-button"
            onClick={closeSettings}
          >
            Cancel
          </button>


          <button
            type="button"
            className="admin-settings-save-button"
            onClick={handleSave}
          >
            Save changes
          </button>

        </div>


        {/* =========================================
            SUCCESS MESSAGE
           ========================================= */}

        {saveMessage && (

          <p className="admin-settings-save-message">
            {saveMessage}
          </p>

        )}

      </div>


      {/* =====================================================
          CHANGE PASSWORD MODAL
         ===================================================== */}

      {isPasswordModalOpen && (

        <div className="admin-password-modal-overlay">

          <div className="admin-password-modal">

            {/* HEADER */}

            <div className="admin-password-modal-header">

              <div>

                <p className="admin-password-modal-label">
                  ACCOUNT SECURITY
                </p>

                <h2>
                  Change password
                </h2>

                <p>
                  Update your administrator account password.
                </p>

              </div>


              <button
                type="button"
                className="admin-password-modal-close"
                onClick={closePasswordModal}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="admin-password-form">

              <div className="admin-password-field">

                <label>
                  Current password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter current password"
                />

              </div>


              <div className="admin-password-field">

                <label>
                  New password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter new password"
                />

              </div>


              <div className="admin-password-field">

                <label>
                  Confirm new password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                />

              </div>

            </div>


            {/* PASSWORD MESSAGE */}

            {passwordMessage && (

              <p className="admin-password-message">
                {passwordMessage}
              </p>

            )}


            {/* ACTIONS */}

            <div className="admin-password-actions">

              <button
                type="button"
                className="admin-password-cancel"
                onClick={closePasswordModal}
              >
                Cancel
              </button>


              <button
                type="button"
                className="admin-password-save"
                onClick={handlePasswordUpdate}
              >
                Update password
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default AdminSettingsPage