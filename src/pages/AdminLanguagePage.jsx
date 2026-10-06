import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/AdminLanguagePage.css"

function AdminLanguagePage() {
  const navigate = useNavigate()

  const savedLanguage =
    localStorage.getItem("adminLanguage") || "English"

  const [selectedLanguage, setSelectedLanguage] =
    useState(savedLanguage)

  const [saveMessage, setSaveMessage] = useState("")

  // =========================================
  // CLOSE LANGUAGE PAGE
  // =========================================

  const closeLanguagePage = () => {
    navigate("/admin")
  }

  // =========================================
  // SAVE LANGUAGE
  // =========================================

  const handleSave = () => {
    localStorage.setItem(
      "adminLanguage",
      selectedLanguage
    )

    setSaveMessage(
      "Language preference updated successfully."
    )
  }

  // =========================================
  // LANGUAGE OPTIONS
  // =========================================

  const languages = [
    {
      name: "English",
      nativeName: "English",
      description: "Use English across the admin workspace."
    },
    {
      name: "Hindi",
      nativeName: "हिन्दी",
      description: "Use Hindi across the admin workspace."
    },
    {
      name: "Marathi",
      nativeName: "मराठी",
      description: "Use Marathi across the admin workspace."
    }
  ]

  return (
    <div className="admin-language-overlay">

      <div className="admin-language-modal">

        {/* =========================================
            HEADER
           ========================================= */}

        <div className="admin-language-page-header">

          <div>

            <p className="admin-language-page-label">
              PREFERENCE
            </p>

            <h1>
              Language
            </h1>

            <p className="admin-language-page-description">
              Choose the language you want to use across your admin workspace.
            </p>

          </div>

          {/* Close */}

          <button
            type="button"
            className="admin-language-close-button"
            onClick={closeLanguagePage}
            aria-label="Close language settings"
          >
            ×
          </button>

        </div>


        {/* =========================================
            LANGUAGE SECTION
           ========================================= */}

        <section className="admin-language-section">

          <div className="admin-language-section-header">

            <h2>
              Select language
            </h2>

            <p>
              Your selected language will be saved as your admin preference.
            </p>

          </div>


          {/* =========================================
              LANGUAGE OPTIONS
             ========================================= */}

          <div className="admin-language-options">

            {languages.map((language) => (

              <button
                key={language.name}
                type="button"
                className={`admin-language-option ${
                  selectedLanguage === language.name
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedLanguage(language.name)
                  setSaveMessage("")
                }}
              >

                {/* Language text */}

                <div className="admin-language-option-content">

                  <strong>
                    {language.nativeName}
                  </strong>

                  <span>
                    {language.description}
                  </span>

                </div>


                {/* Selection indicator */}

                <div
                  className="admin-language-radio"
                  aria-hidden="true"
                >
                  {selectedLanguage === language.name && (
                    <span></span>
                  )}
                </div>

              </button>

            ))}

          </div>

        </section>


        {/* =========================================
            CURRENT LANGUAGE
           ========================================= */}

        <div className="admin-language-current">

          <span>
            Current language
          </span>

          <strong>
            {selectedLanguage}
          </strong>

        </div>


        {/* =========================================
            ACTIONS
           ========================================= */}

        <div className="admin-language-actions">

          <button
            type="button"
            className="admin-language-cancel-button"
            onClick={closeLanguagePage}
          >
            Cancel
          </button>


          <button
            type="button"
            className="admin-language-save-button"
            onClick={handleSave}
          >
            Save changes
          </button>

        </div>


        {/* =========================================
            SUCCESS MESSAGE
           ========================================= */}

        {saveMessage && (
          <p className="admin-language-save-message">
            {saveMessage}
          </p>
        )}

      </div>

    </div>
  )
}

export default AdminLanguagePage