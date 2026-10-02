import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/FavoritesPage.css"

function FavoritesPage() {
  const navigate = useNavigate()

  const [savedHerbs, setSavedHerbs] = useState([])

  // =========================================================
  // LOAD SAVED HERBS
  // =========================================================

  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem("favoriteHerbs")

      if (!savedFavorites) {
        setSavedHerbs([])
        return
      }

      try {
        const favorites = JSON.parse(savedFavorites)

        if (Array.isArray(favorites)) {
          setSavedHerbs(favorites)
        } else {
          setSavedHerbs([])
        }
      } catch (error) {
        console.error("Unable to load saved herbs:", error)
        setSavedHerbs([])
      }
    }

    loadFavorites()
  }, [])

  // =========================================================
  // REMOVE HERB FROM FAVORITES
  // =========================================================

  const removeFavorite = (herbId) => {
    const updatedFavorites = savedHerbs.filter(
      (herb) => herb.id !== herbId
    )

    setSavedHerbs(updatedFavorites)

    localStorage.setItem(
      "favoriteHerbs",
      JSON.stringify(updatedFavorites)
    )
  }

  // =========================================================
  // OPEN HERB LIBRARY
  // =========================================================

  const handleExploreHerbs = () => {
    navigate("/herb-library")
  }

  // =========================================================
  // OPEN HERB DETAIL PAGE
  // =========================================================

  const handleViewProfile = (herbId) => {
    navigate(`/herb/${herbId}`)
  }

  // =========================================================
  // FORMAT OBJECT VALUES
  // =========================================================

  const formatValue = (value) => {
    if (!value) {
      return null
    }

    // If value is already a string
    if (typeof value === "string") {
      return value
    }

    // If value is an array
    if (Array.isArray(value)) {
      return value
        .filter(Boolean)
        .join(" · ")
    }

    // If value is an object
    if (typeof value === "object") {
      return Object.entries(value)
        .filter(
          ([, itemValue]) =>
            itemValue !== undefined &&
            itemValue !== null &&
            itemValue !== "" &&
            itemValue !== "—"
        )
        .map(([key, itemValue]) => {
          const formattedKey =
            key.charAt(0).toUpperCase() + key.slice(1)

          return `${formattedKey}: ${itemValue}`
        })
        .join(" · ")
    }

    return String(value)
  }

  // =========================================================
  // GET HERB NAME
  // =========================================================

  const getHerbName = (herb) => {
    return (
      herb.englishName ||
      herb.name ||
      "Unnamed herb"
    )
  }

  // =========================================================
  // GET BOTANICAL NAME
  // =========================================================

  const getBotanicalName = (herb) => {
    return (
      herb.botanicalName ||
      herb.scientificName ||
      "Botanical name unavailable"
    )
  }

  return (
    <div className="favorites-page-layout">

      {/* Top Navbar */}
      <DashboardNavbar />

      <div className="favorites-page-body">

        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="favorites-page-content">

          <div className="favorites-content-inner">

            {/* =================================================
                PAGE HEADER
                ================================================= */}

            <section className="favorites-header">

              <div>

                <p className="favorites-breadcrumb">
                  WORKSPACE / SAVED
                </p>

                <h1>
                  Your saved library
                </h1>

              </div>

              <div className="saved-count">

                <span className="saved-count-icon">
                  ♡
                </span>

                <span>
                  {savedHerbs.length}{" "}
                  {savedHerbs.length === 1
                    ? "herb"
                    : "herbs"}{" "}
                  saved
                </span>

              </div>

            </section>

            {/* =================================================
                TABS
                ================================================= */}

            <div className="favorites-tabs">

              <button
                className="favorites-tab active"
                type="button"
              >
                Herbs
              </button>

              <button
                className="favorites-tab"
                type="button"
              >
                Searches
              </button>

            </div>

            {/* =================================================
                EMPTY STATE
                ================================================= */}

            {savedHerbs.length === 0 ? (

              <section className="favorites-empty-state">

                <div className="empty-favorites-icon">
                  ♡
                </div>

                <h2>
                  Your saved library is empty
                </h2>

                <p>
                  Save herbs from their information pages
                  to return to them quickly.
                </p>

                <button
                  className="explore-herbs-button"
                  type="button"
                  onClick={handleExploreHerbs}
                >
                  Explore herbs
                </button>

              </section>

            ) : (

              /* =================================================
                 SAVED HERBS
                 ================================================= */

              <section className="saved-herbs-grid">

                {savedHerbs.map((herb) => {

                  const herbName = getHerbName(herb)
                  const botanicalName =
                    getBotanicalName(herb)

                  const dosha =
                    formatValue(herb.dosha)

                  const rasa =
                    formatValue(herb.rasa)

                  const guna =
                    formatValue(herb.guna)

                  const virya =
                    formatValue(herb.virya)

                  const vipaka =
                    formatValue(herb.vipaka)

                  const karma = [
                    herb.importantKarma,
                    herb.otherKarma,
                  ]
                    .filter(Boolean)
                    .map((value) =>
                      formatValue(value)
                    )
                    .filter(Boolean)
                    .join(" · ")

                  return (

                    <article
                      className="saved-herb-card"
                      key={herb.id}
                    >

                      {/* =================================================
                          HERB VISUAL
                          ================================================= */}

                      <div
                        className="saved-herb-visual"
                        style={{
                          backgroundColor:
                            herb.visualColor ||
                            "#a5b195",
                        }}
                      >
                        <span>♧</span>
                      </div>

                      {/* =================================================
                          HERB INFORMATION
                          ================================================= */}

                      <div className="saved-herb-info">

                        <div className="saved-herb-top">

                          <div>

                            <h2>
                              {herbName}
                            </h2>

                            <em>
                              {botanicalName}
                            </em>

                          </div>

                          {/* REMOVE FAVORITE */}

                          <button
                            className="saved-herb-favorite"
                            type="button"
                            onClick={() =>
                              removeFavorite(herb.id)
                            }
                            aria-label={`Remove ${herbName} from favorites`}
                          >
                            ♥
                          </button>

                        </div>

                        {/* =================================================
                            STATUS
                            ================================================= */}

                        <div className="saved-herb-match">

                          <span className="saved-verified">

                            {herb.status ===
                            "Verified"
                              ? "✓"
                              : "◷"}

                            {" "}
                            {herb.status ||
                              "Draft"}

                          </span>

                        </div>

                        {/* =================================================
                            AYURVEDIC PROPERTIES
                            ================================================= */}

                        <div className="saved-herb-tags">

                          {rasa && (
                            <span>
                              Rasa: {rasa}
                            </span>
                          )}

                          {guna && (
                            <span>
                              Guna: {guna}
                            </span>
                          )}

                          {virya && (
                            <span>
                              Virya: {virya}
                            </span>
                          )}

                          {vipaka && (
                            <span>
                              Vipaka: {vipaka}
                            </span>
                          )}

                          {dosha && (
                            <span>
                              Dosha: {dosha}
                            </span>
                          )}

                        </div>

                        {/* =================================================
                            DESCRIPTION
                            ================================================= */}

                        <p>

                          {herb.partUsed && (
                            <>
                              <strong>
                                Part used:
                              </strong>{" "}
                              {formatValue(
                                herb.partUsed
                              )}
                              {" "}
                            </>
                          )}

                          {herb.majorDiseases && (
                            <>
                              <strong>
                                Major indications:
                              </strong>{" "}
                              {formatValue(
                                herb.majorDiseases
                              )}
                            </>
                          )}

                          {!herb.partUsed &&
                            !herb.majorDiseases &&
                            herb.description && (
                              <>
                                {herb.description}
                              </>
                            )}

                        </p>

                        {/* =================================================
                            KARMA
                            ================================================= */}

                        {karma && (
                          <div className="saved-herb-tags">

                            <span>
                              Karma: {karma}
                            </span>

                          </div>
                        )}

                        {/* =================================================
                            VIEW PROFILE
                            ================================================= */}

                        <button
                          className="saved-view-profile"
                          type="button"
                          onClick={() =>
                            handleViewProfile(
                              herb.id
                            )
                          }
                        >
                          View profile
                          <span>›</span>
                        </button>

                      </div>

                    </article>

                  )
                })}

              </section>

            )}

          </div>

        </main>

      </div>

    </div>
  )
}

export default FavoritesPage