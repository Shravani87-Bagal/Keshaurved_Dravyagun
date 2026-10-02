import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import DetailedSearch from "../components/DetailedSearch"
import "../styles/SearchPage.css"

function SearchPage() {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // =========================================
  // READ SAVED SEARCH SETTINGS
  // =========================================

  const savedSettings = JSON.parse(
    localStorage.getItem("herbSettings") || "null"
  )

  const savedDefaultSearch =
    savedSettings?.defaultSearch || "simple"

  // URL mode has priority.
  // If there is no mode in URL, use saved setting.
  const mode =
    searchParams.get("mode") || savedDefaultSearch


  // =========================================
  // SIMPLE SEARCH STATE
  // =========================================

  const [searchQuery, setSearchQuery] = useState("")

  const [rasa, setRasa] = useState("")
  const [virya, setVirya] = useState("")
  const [vipaka, setVipaka] = useState("")
  const [majorDisease, setMajorDisease] = useState("")


  // =========================================
  // SEARCH MODE CHANGE
  // =========================================

  const handleModeChange = (selectedMode) => {
    navigate(`/search?mode=${selectedMode}`)
  }


  // =========================================
  // SIMPLE SEARCH
  // =========================================

  const handleSimpleSearch = () => {

    if (
      !searchQuery.trim() &&
      !rasa &&
      !virya &&
      !vipaka &&
      !majorDisease
    ) {
      return
    }

    const params = new URLSearchParams()

    params.set("mode", "simple")

    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim())
    }

    if (rasa) {
      params.set("rasa", rasa)
    }

    if (virya) {
      params.set("virya", virya)
    }

    if (vipaka) {
      params.set("vipaka", vipaka)
    }

    if (majorDisease) {
      params.set("majorDisease", majorDisease)
    }

    navigate(`/search-results?${params.toString()}`)
  }


  // =========================================
  // ENTER KEY
  // =========================================

  const handleSearchKeyDown = (e) => {

    if (e.key === "Enter") {
      handleSimpleSearch()
    }

  }


  // =========================================
  // SEARCH PATTERN
  // =========================================

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
                    Use everyday language and add Ayurvedic clinical
                    factors to refine the results.
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


                <div className="simple-search-input-row">

                  <div className="simple-search-input">

                    <span className="input-search-icon">
                      ⌕
                    </span>

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                      onKeyDown={handleSearchKeyDown}
                      placeholder="e.g. joint pain, worse in cold weather, morning stiffness"
                    />

                  </div>


                  <button
                    className="simple-search-button"
                    type="button"
                    disabled={
                      !searchQuery.trim() &&
                      !rasa &&
                      !virya &&
                      !vipaka &&
                      !majorDisease
                    }
                    onClick={handleSimpleSearch}
                  >
                    Search
                    <span>⌕</span>
                  </button>

                </div>


                <div className="simple-search-factors">

                  <div className="simple-search-factors-header">

                    <div>

                      <span className="factors-label">
                        AYURVEDIC CLINICAL CONTEXT
                      </span>

                      <h3>
                        Refine the search
                      </h3>

                    </div>

                    <p>
                      Add classical factors to narrow the herb match.
                    </p>

                  </div>


                  <div className="simple-search-factors-grid">

                    <div className="simple-search-factor">

                      <label htmlFor="rasa">
                        Rasa
                      </label>

                      <select
                        id="rasa"
                        value={rasa}
                        onChange={(e) =>
                          setRasa(e.target.value)
                        }
                      >

                        <option value="">
                          Any Rasa
                        </option>

                        <option value="Madhura">
                          Madhura
                        </option>

                        <option value="Amla">
                          Amla
                        </option>

                        <option value="Lavana">
                          Lavana
                        </option>

                        <option value="Katu">
                          Katu
                        </option>

                        <option value="Tikta">
                          Tikta
                        </option>

                        <option value="Kashaya">
                          Kashaya
                        </option>

                      </select>

                    </div>


                    <div className="simple-search-factor">

                      <label htmlFor="virya">
                        Virya
                      </label>

                      <select
                        id="virya"
                        value={virya}
                        onChange={(e) =>
                          setVirya(e.target.value)
                        }
                      >

                        <option value="">
                          Any Virya
                        </option>

                        <option value="Ushna">
                          Ushna
                        </option>

                        <option value="Sheeta">
                          Sheeta
                        </option>

                      </select>

                    </div>


                    <div className="simple-search-factor">

                      <label htmlFor="vipaka">
                        Vipaka
                      </label>

                      <select
                        id="vipaka"
                        value={vipaka}
                        onChange={(e) =>
                          setVipaka(e.target.value)
                        }
                      >

                        <option value="">
                          Any Vipaka
                        </option>

                        <option value="Madhura">
                          Madhura
                        </option>

                        <option value="Amla">
                          Amla
                        </option>

                        <option value="Katu">
                          Katu
                        </option>

                      </select>

                    </div>


                    <div className="simple-search-factor">

                      <label htmlFor="majorDisease">
                        Major Disease
                      </label>

                      <select
                        id="majorDisease"
                        value={majorDisease}
                        onChange={(e) =>
                          setMajorDisease(e.target.value)
                        }
                      >

                        <option value="">
                          Any Disease
                        </option>

                        <option value="Diabetes">
                          Diabetes
                        </option>

                        <option value="Hypertension">
                          Hypertension
                        </option>

                        <option value="Arthritis">
                          Arthritis
                        </option>

                        <option value="Asthma">
                          Asthma
                        </option>

                      </select>

                    </div>

                  </div>

                </div>


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


              <section className="clinical-nuance-card">

                <div className="clinical-nuance-icon">
                  ✧
                </div>

                <div className="clinical-nuance-content">

                  <h2>
                    Search with clinical nuance
                  </h2>

                  <p>
                    Include timing, triggers, qualities, associated
                    symptoms, and Ayurvedic factors for a more precise match.
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