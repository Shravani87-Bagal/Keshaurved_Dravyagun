import { useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/SettingsPage.css"

function SettingsPage() {
  const navigate = useNavigate()

  const savedUser = JSON.parse(
    localStorage.getItem("herbUser") || "null"
  )

  const doctorName = savedUser?.fullName || "Doctor"
  const doctorEmail = savedUser?.email || "Not available"

  const [activeSetting, setActiveSetting] = useState("general")
  const [searchText, setSearchText] = useState("")

  const [defaultSearch, setDefaultSearch] = useState("simple")
  const [resultsPerPage, setResultsPerPage] = useState("20")

  const [verifiedProfiles, setVerifiedProfiles] = useState(true)
  const [showMatchPercentage, setShowMatchPercentage] = useState(true)
  const [showScoringBreakdown, setShowScoringBreakdown] = useState(true)

  const [searchUpdates, setSearchUpdates] = useState(true)
  const [savedReminders, setSavedReminders] = useState(false)
  const [referenceUpdates, setReferenceUpdates] = useState(true)

  const [showClassicalReferences, setShowClassicalReferences] =
    useState(true)

  const [showVerificationStatus, setShowVerificationStatus] =
    useState(true)

  const [showClinicalNotes, setShowClinicalNotes] =
    useState(true)

  const settingsItems = [
    {
      id: "general",
      label: "General",
      icon: "⚙"
    },
    {
      id: "account",
      label: "Account",
      icon: "◉"
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: "▣"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "♧"
    },
    {
      id: "search",
      label: "Search Preferences",
      icon: "⌕"
    },
    {
      id: "clinical",
      label: "Clinical Preferences",
      icon: "✦"
    }
  ]

  const filteredItems = settingsItems.filter((item) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  )

  const closeSettings = () => {
    navigate("/doctor")
  }

  const renderGeneral = () => (
    <div className="settings-panel-content">

      <div className="settings-panel-title">
        <h2>Profile</h2>
        <p>
          Manage the information used across your clinical workspace.
        </p>
      </div>

      <div className="settings-profile-block">

        <div className="settings-profile-line">
          <div className="settings-field-label">
            <strong>Avatar</strong>
          </div>

          <div className="settings-large-avatar">
            DR
          </div>
        </div>

        <div className="settings-field-row">
          <div className="settings-field-label">
            <strong>Full name</strong>
          </div>

          <div className="settings-value-box">
            {doctorName}
          </div>
        </div>

        <div className="settings-field-row">
          <div className="settings-field-label">
            <strong>What should we call you?</strong>
          </div>

          <div className="settings-value-box">
            {doctorName}
          </div>
        </div>

        <div className="settings-field-row">
          <div className="settings-field-label">
            <strong>Professional role</strong>
          </div>

          <div className="settings-value-text">
            Ayurvedic Physician
          </div>
        </div>

        <div className="settings-field-row">
          <div className="settings-field-label">
            <strong>Email</strong>
          </div>

          <div className="settings-value-box">
            {doctorEmail}
          </div>
        </div>

      </div>

      <div className="settings-subsection">

        <h3>Preferences</h3>

        <div className="settings-simple-row">
          <div>
            <strong>Default search mode</strong>
            <span>
              Choose the search method that opens first.
            </span>
          </div>

          <select
            value={defaultSearch}
            onChange={(e) => setDefaultSearch(e.target.value)}
            className="settings-small-select"
          >
            <option value="simple">Simple Search</option>
            <option value="detailed">Detailed Search</option>
          </select>
        </div>

      </div>

    </div>
  )

  const renderAccount = () => (
    <div className="settings-panel-content">

      <div className="settings-panel-title">
        <h2>Account</h2>
        <p>
          Manage your account information and access preferences.
        </p>
      </div>

      <div className="settings-form-list">

        <div className="settings-form-row">
          <div>
            <strong>Full name</strong>
            <span>Your name associated with this account.</span>
          </div>

          <div className="settings-value-box">
            {doctorName}
          </div>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Email address</strong>
            <span>Your registered account email.</span>
          </div>

          <div className="settings-value-box">
            {doctorEmail}
          </div>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Professional role</strong>
            <span>Your role within the clinical workspace.</span>
          </div>

          <div className="settings-value-text">
            Ayurvedic Physician
          </div>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Password</strong>
            <span>Update your account password.</span>
          </div>

          <button
            type="button"
            className="settings-text-button"
            onClick={() =>
              alert("Password change will be connected to the backend later.")
            }
          >
            Change password
          </button>
        </div>

      </div>

    </div>
  )

  const renderPrivacy = () => (
    <div className="settings-panel-content">

      <div className="settings-panel-title">
        <h2>Privacy</h2>
        <p>
          Control how your research activity is handled within the workspace.
        </p>
      </div>

      <div className="settings-form-list">

        <div className="settings-form-row">
          <div>
            <strong>Search history</strong>
            <span>
              Your recent searches may be stored for quick access.
            </span>
          </div>

          <button
            type="button"
            className="settings-text-button"
            onClick={() =>
              alert("Recent search history will be cleared here.")
            }
          >
            Clear
          </button>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Saved herb profiles</strong>
            <span>
              Manage herbs saved to your clinical library.
            </span>
          </div>

          <button
            type="button"
            className="settings-text-button"
            onClick={() =>
              navigate("/favorites")
            }
          >
            Manage
          </button>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Local research activity</strong>
            <span>
              Review locally stored workspace activity.
            </span>
          </div>

          <span className="settings-status-text">
            Protected
          </span>
        </div>

      </div>

    </div>
  )

  const renderNotifications = () => (
    <div className="settings-panel-content">

      <div className="settings-panel-title">
        <h2>Notifications</h2>
        <p>
          Control updates and reminders from your clinical workspace.
        </p>
      </div>

      <div className="settings-form-list">

        <div className="settings-form-row">
          <div>
            <strong>Search updates</strong>
            <span>
              Receive important updates related to your searches.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              searchUpdates ? "on" : ""
            }`}
            type="button"
            onClick={() => setSearchUpdates(!searchUpdates)}
          >
            <span></span>
          </button>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Saved herb reminders</strong>
            <span>
              Receive reminders about saved herb profiles.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              savedReminders ? "on" : ""
            }`}
            type="button"
            onClick={() => setSavedReminders(!savedReminders)}
          >
            <span></span>
          </button>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Reference updates</strong>
            <span>
              Receive updates related to Ayurvedic references.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              referenceUpdates ? "on" : ""
            }`}
            type="button"
            onClick={() =>
              setReferenceUpdates(!referenceUpdates)
            }
          >
            <span></span>
          </button>
        </div>

      </div>

    </div>
  )

  const renderSearchPreferences = () => (
    <div className="settings-panel-content">

      <div className="settings-panel-title">
        <h2>Search Preferences</h2>
        <p>
          Configure how the herb intelligence engine presents results.
        </p>
      </div>

      <div className="settings-form-list">

        <div className="settings-form-row">
          <div>
            <strong>Default search mode</strong>
            <span>
              Choose which search method opens first.
            </span>
          </div>

          <select
            value={defaultSearch}
            onChange={(e) =>
              setDefaultSearch(e.target.value)
            }
            className="settings-small-select"
          >
            <option value="simple">Simple Search</option>
            <option value="detailed">Detailed Search</option>
          </select>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Results per page</strong>
            <span>
              Number of herb profiles shown in results.
            </span>
          </div>

          <select
            value={resultsPerPage}
            onChange={(e) =>
              setResultsPerPage(e.target.value)
            }
            className="settings-small-select"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Show verified profiles</strong>
            <span>
              Highlight profiles that have been reviewed and verified.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              verifiedProfiles ? "on" : ""
            }`}
            type="button"
            onClick={() =>
              setVerifiedProfiles(!verifiedProfiles)
            }
          >
            <span></span>
          </button>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Show match percentage</strong>
            <span>
              Display the relevance percentage for each result.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              showMatchPercentage ? "on" : ""
            }`}
            type="button"
            onClick={() =>
              setShowMatchPercentage(!showMatchPercentage)
            }
          >
            <span></span>
          </button>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Show scoring breakdown</strong>
            <span>
              Display how Ayurvedic parameters contributed to ranking.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              showScoringBreakdown ? "on" : ""
            }`}
            type="button"
            onClick={() =>
              setShowScoringBreakdown(!showScoringBreakdown)
            }
          >
            <span></span>
          </button>
        </div>

      </div>

    </div>
  )

  const renderClinicalPreferences = () => (
    <div className="settings-panel-content">

      <div className="settings-panel-title">
        <h2>Clinical Preferences</h2>
        <p>
          Configure the clinical information displayed with herb results.
        </p>
      </div>

      <div className="settings-form-list">

        <div className="settings-form-row">
          <div>
            <strong>Show classical references</strong>
            <span>
              Display classical Ayurvedic references with herb profiles.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              showClassicalReferences ? "on" : ""
            }`}
            type="button"
            onClick={() =>
              setShowClassicalReferences(
                !showClassicalReferences
              )
            }
          >
            <span></span>
          </button>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Show verification status</strong>
            <span>
              Display whether a herb profile is draft, reviewed, or verified.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              showVerificationStatus ? "on" : ""
            }`}
            type="button"
            onClick={() =>
              setShowVerificationStatus(
                !showVerificationStatus
              )
            }
          >
            <span></span>
          </button>
        </div>

        <div className="settings-form-row">
          <div>
            <strong>Show clinical notes</strong>
            <span>
              Display additional clinical information where available.
            </span>
          </div>

          <button
            className={`settings-toggle ${
              showClinicalNotes ? "on" : ""
            }`}
            type="button"
            onClick={() =>
              setShowClinicalNotes(!showClinicalNotes)
            }
          >
            <span></span>
          </button>
        </div>

      </div>

    </div>
  )

  const renderActivePanel = () => {
    switch (activeSetting) {
      case "account":
        return renderAccount()

      case "privacy":
        return renderPrivacy()

      case "notifications":
        return renderNotifications()

      case "search":
        return renderSearchPreferences()

      case "clinical":
        return renderClinicalPreferences()

      case "general":
      default:
        return renderGeneral()
    }
  }

  return (
    <div className="settings-page-layout">

      <DashboardNavbar />

      <div className="settings-page-body">
        <Sidebar />

        <main className="settings-page-content">
          {/* Dashboard remains underneath */}

          <div className="settings-overlay">

            <div className="settings-modal">

              {/* Search / Left Navigation */}

              <aside className="settings-modal-sidebar">

                <div className="settings-search">

                  <span className="settings-search-icon">
                    ⌕
                  </span>

                  <input
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) =>
                      setSearchText(e.target.value)
                    }
                  />

                </div>

                <div className="settings-sidebar-label">
                  Settings
                </div>

                <nav className="settings-sidebar-nav">

                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`settings-sidebar-item ${
                        activeSetting === item.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setActiveSetting(item.id)
                      }
                    >
                      <span className="settings-sidebar-icon">
                        {item.icon}
                      </span>

                      <span>
                        {item.label}
                      </span>
                    </button>
                  ))}

                </nav>

              </aside>


              {/* Right Content */}

              <section className="settings-modal-main">

                <button
                  type="button"
                  className="settings-close-button"
                  onClick={closeSettings}
                  aria-label="Close settings"
                >
                  ×
                </button>

                <div className="settings-scroll-area">
                  {renderActivePanel()}
                </div>

              </section>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default SettingsPage