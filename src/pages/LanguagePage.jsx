import { useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/SettingsPage.css"
import "../styles/LanguagePage.css"

function LanguagePage() {
  const navigate = useNavigate()

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "English"
  )

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language)
    localStorage.setItem("language", language)
  }

  const closeLanguage = () => {
    navigate("/doctor")
  }

  return (
    <div className="settings-page-layout">

      {/* Top Navbar */}
      <DashboardNavbar />

      <div className="settings-page-body">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="settings-page-content">

          {/* Same overlay used by Settings */}
          <div className="settings-overlay">

            {/* Language Modal */}
            <div className="language-modal">

              {/* Close button */}
              <button
                type="button"
                className="settings-close-button"
                onClick={closeLanguage}
                aria-label="Close language"
              >
                ×
              </button>


              {/* Language Content */}
              <div className="language-modal-content">

                {/* Header */}
                <div className="language-header">

                  <p className="language-label">
                    PREFERENCES
                  </p>

                  <h1>
                    Language
                  </h1>

                  <p className="language-description">
                    Choose the language you prefer for the application.
                  </p>

                </div>


                {/* Language Options */}
                <div className="language-options">

                  {/* English */}
                  <button
                    type="button"
                    className={`language-option ${
                      selectedLanguage === "English"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleLanguageChange("English")
                    }
                  >

                    <div>
                      <h2>English</h2>
                      <p>English</p>
                    </div>

                    <span className="language-radio">
                      {selectedLanguage === "English" && "✓"}
                    </span>

                  </button>


                  {/* Hindi */}
                  <button
                    type="button"
                    className={`language-option ${
                      selectedLanguage === "Hindi"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleLanguageChange("Hindi")
                    }
                  >

                    <div>
                      <h2>हिन्दी</h2>
                      <p>Hindi</p>
                    </div>

                    <span className="language-radio">
                      {selectedLanguage === "Hindi" && "✓"}
                    </span>

                  </button>


                  {/* Marathi */}
                  <button
                    type="button"
                    className={`language-option ${
                      selectedLanguage === "Marathi"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleLanguageChange("Marathi")
                    }
                  >

                    <div>
                      <h2>मराठी</h2>
                      <p>Marathi</p>
                    </div>

                    <span className="language-radio">
                      {selectedLanguage === "Marathi" && "✓"}
                    </span>

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

export default LanguagePage