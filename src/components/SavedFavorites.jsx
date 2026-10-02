import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/SavedFavorites.css"

function SavedFavorites() {
  const navigate = useNavigate()

  const [savedFavorites, setSavedFavorites] = useState([])

  // =========================================================
  // LOAD REAL SAVED FAVORITES
  // =========================================================

  useEffect(() => {
    const loadFavorites = () => {
      const savedData = localStorage.getItem("favoriteHerbs")

      if (!savedData) {
        setSavedFavorites([])
        return
      }

      try {
        const favorites = JSON.parse(savedData)

        if (Array.isArray(favorites)) {
          setSavedFavorites(favorites)
        } else {
          setSavedFavorites([])
        }
      } catch (error) {
        console.error(
          "Unable to load saved favorites:",
          error
        )

        setSavedFavorites([])
      }
    }

    loadFavorites()

    // Listen for changes made from other components
    const handleStorageChange = (event) => {
      if (event.key === "favoriteHerbs") {
        loadFavorites()
      }
    }

    window.addEventListener(
      "storage",
      handleStorageChange
    )

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      )
    }
  }, [])

  // =========================================================
  // FORMAT DATA
  // =========================================================

  const formatValue = (value) => {
    if (!value) {
      return "—"
    }

    if (typeof value === "string") {
      return value
    }

    if (Array.isArray(value)) {
      return value
        .filter(Boolean)
        .join(" · ")
    }

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
            key.charAt(0).toUpperCase() +
            key.slice(1)

          return `${formattedKey}: ${itemValue}`
        })
        .join(" · ")
    }

    return String(value)
  }

  // =========================================================
  // HERB NAME
  // =========================================================

  const getHerbName = (herb) => {
    return (
      herb.englishName ||
      herb.name ||
      "Unnamed herb"
    )
  }

  // =========================================================
  // VIEW ALL
  // =========================================================

  const handleViewAll = () => {
    navigate("/favorites")
  }

  // =========================================================
  // VIEW HERB
  // =========================================================

  const handleViewHerb = (herbId) => {
    navigate(`/herb/${herbId}`)
  }

  // =========================================================
  // SHOW ONLY FIRST 4
  // =========================================================

  const visibleFavorites =
    savedFavorites.slice(0, 4)

  const remainingCount =
    Math.max(
      savedFavorites.length -
        visibleFavorites.length,
      0
    )

  return (
    <section className="saved-favorites">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="saved-favorites-header">

        <h2>
          Saved Favorites
        </h2>

        <button
          className="saved-favorites-view-all"
          type="button"
          onClick={handleViewAll}
        >
          View All →
        </button>

      </div>

      {/* =====================================================
          FAVORITES LIST
          ===================================================== */}

      <div className="saved-favorites-list">

        {/* EMPTY STATE */}

        {savedFavorites.length === 0 && (

          <div className="saved-favorite-item">

            <div className="saved-favorite-info">

              <div className="saved-favorite-name-row">

                <h3>
                  No saved herbs
                </h3>

              </div>

              <div className="saved-favorite-details">

                <span>
                  Save herbs to see them here.
                </span>

              </div>

            </div>

            <button
              className="saved-favorite-view-button"
              type="button"
              onClick={() =>
                navigate("/herb-library")
              }
            >
              Explore
            </button>

          </div>

        )}

        {/* SAVED HERBS */}

        {visibleFavorites.map((herb) => {

          const herbName =
            getHerbName(herb)

          const rasa =
            formatValue(herb.rasa)

          const virya =
            formatValue(herb.virya)

          return (

            <div
              className="saved-favorite-item"
              key={herb.id}
            >

              <div className="saved-favorite-info">

                <div className="saved-favorite-name-row">

                  <h3>
                    {herbName}
                  </h3>

                  <span className="saved-favorite-status">

                    {herb.status ===
                    "Verified"
                      ? "✓ "
                      : ""}

                    {herb.status ||
                      "Draft"}

                  </span>

                </div>

                <div className="saved-favorite-details">

                  <span>
                    Rasa: {rasa}
                  </span>

                  <span>
                    Virya: {virya}
                  </span>

                </div>

              </div>

              <button
                className="saved-favorite-view-button"
                type="button"
                onClick={() =>
                  handleViewHerb(herb.id)
                }
              >
                View
              </button>

            </div>

          )
        })}

        {/* SHOW MORE */}

        {remainingCount > 0 && (

          <button
            className="saved-favorites-show-more"
            type="button"
            onClick={handleViewAll}
          >
            ↓ Show {remainingCount} more
          </button>

        )}

      </div>

    </section>
  )
}

export default SavedFavorites