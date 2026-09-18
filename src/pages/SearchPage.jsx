import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import DetailedSearch from "../components/DetailedSearch"
import "../styles/SearchPage.css"

function SearchPage() {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const mode = searchParams.get("mode") || "simple"

  // Stores what the user types in the search box
  const [searchQuery, setSearchQuery] = useState("")

  const handleModeChange = (selectedMode) => {
    navigate(`/search?mode=${selectedMode}`)
  }

  // Handle simple search
  const handleSimpleSearch = () => {
    if (!searchQuery.trim()) {
      return
    }

    navigate(
      `/search-results?mode=simple&query=${encodeURIComponent(
        searchQuery.trim()
      )}`
    )
  }

  // Handle Enter key inside search box
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSimpleSearch()
    }
  }

  // Select one of the suggested search patterns
  const handlePatternClick = (pattern) => {
    setSearchQuery(pattern)
  }

  return (
    <div className="search-page-layout">

      <DashboardNavbar />

      <div className="search-page-body">

        <Sidebar />

        <main className="search-page-content">

          {/* =========================================
              SEARCH PAGE HEADER
              ========================================= */}

          <section className="search-page-header">

            <div className="search-header-text">

              <p className="search-page-label">
                SEARCH
              </p>

              {mode === "detailed" ? (

                <>
                  <h1>
                    Search by Ayurvedic parameters
                  </h1>

                  <p className="search-page-description">
                    Select classical Ayurvedic attributes to find herbs
                    that match multiple clinical criteria.
                  </p>
                </>

              ) : (

                <>
                  <h1>
                    Describe the patient's concern
                  </h1>

                  <p className="search-page-description">
                    Use everyday language. The engine will map your
                    description to relevant Ayurvedic properties and
                    indications.
                  </p>
                </>

              )}

            </div>


            {/* =========================================
                SEARCH MODE SWITCH
                ========================================= */}

            <div className="search-mode-switch">

              <button
                className={`search-mode-button ${
                  mode === "simple" ? "active" : ""
                }`}
                type="button"
                onClick={() => handleModeChange("simple")}
              >
                <span>✦</span>
                Simple search
              </button>


              <button
                className={`search-mode-button ${
                  mode === "detailed" ? "active" : ""
                }`}
                type="button"
                onClick={() => handleModeChange("detailed")}
              >
                <span>☷</span>
                Detailed search
              </button>

            </div>

          </section>


          {/* =========================================
              SEARCH CONTENT
              ========================================= */}

          {mode === "detailed" ? (

            <DetailedSearch />

          ) : (

            <>

              {/* =========================================
                  SIMPLE SEARCH CARD
                  ========================================= */}

              <section className="simple-search-card">

                <div className="simple-search-heading">

                  <div className="simple-search-icon">
                    ✦
                  </div>

                  <div>

                    <h2>
                      Tell us what you're seeing
                    </h2>

                    <p>
                      Symptoms, patterns, timing, and triggers all help
                      refine the match.
                    </p>

                  </div>

                </div>


                {/* =========================================
                    SEARCH INPUT
                    ========================================= */}

                <div className="simple-search-input-row">

                  <div className="simple-search-input">

                    <span className="input-search-icon">
                      ⌕
                    </span>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="e.g. joint pain, worse in cold weather, morning stiffness"
                    />

                  </div>


                  {/* Search Button */}

                  <button
                    className="simple-search-button"
                    type="button"
                    disabled={!searchQuery.trim()}
                    onClick={handleSimpleSearch}
                  >
                    Search
                    <span>⌕</span>
                  </button>

                </div>


                {/* =========================================
                    SEARCH PATTERNS
                    ========================================= */}

                <div className="search-patterns">

                  <span className="patterns-label">
                    Start with a pattern
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handlePatternClick(
                        "Digestive discomfort after meals"
                      )
                    }
                  >
                    Digestive discomfort after meals
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePatternClick(
                        "Low energy and restless sleep"
                      )
                    }
                  >
                    Low energy and restless sleep
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePatternClick(
                        "Seasonal congestion"
                      )
                    }
                  >
                    Seasonal congestion
                  </button>

                </div>

              </section>


              {/* =========================================
                  CLINICAL NUANCE
                  ========================================= */}

              <section className="clinical-nuance-card">

                <div className="clinical-nuance-icon">
                  ✧
                </div>

                <div className="clinical-nuance-content">

                  <h2>
                    Search with clinical nuance
                  </h2>

                  <p>
                    Include timing, triggers, qualities, and associated
                    symptoms for a more precise match.
                  </p>

                </div>

                <span className="clinical-nuance-number">
                  01
                </span>

              </section>

            </>

          )}

        </main>

      </div>

    </div>
  )
}

export default SearchPage