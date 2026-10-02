import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function HerbResultCard({ herb }) {
  const navigate = useNavigate()

  const [isFavorite, setIsFavorite] = useState(false)

  // =========================================
  // CHECK FAVORITE STATUS
  // =========================================

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteHerbs")

    if (!savedFavorites) {
      setIsFavorite(false)
      return
    }

    try {
      const favorites = JSON.parse(savedFavorites)

      const alreadySaved = favorites.some(
        (savedHerb) => savedHerb.id === herb.id
      )

      setIsFavorite(alreadySaved)
    } catch (error) {
      console.error("Unable to load favorite herbs:", error)
      setIsFavorite(false)
    }
  }, [herb.id])

  // =========================================
  // FAVORITE
  // =========================================

  const handleFavorite = () => {
    const savedFavorites = localStorage.getItem("favoriteHerbs")

    let favorites = []

    if (savedFavorites) {
      try {
        favorites = JSON.parse(savedFavorites)

        if (!Array.isArray(favorites)) {
          favorites = []
        }
      } catch (error) {
        console.error("Unable to read favorite herbs:", error)
        favorites = []
      }
    }

    if (isFavorite) {
      // Remove herb
      const updatedFavorites = favorites.filter(
        (savedHerb) => savedHerb.id !== herb.id
      )

      localStorage.setItem(
        "favoriteHerbs",
        JSON.stringify(updatedFavorites)
      )

      setIsFavorite(false)
    } else {
      // Add herb
      const updatedHerb = {
        ...herb,
        id: herb.id || herb.englishName,
      }

      const updatedFavoritesList = [
        ...favorites,
        updatedHerb,
      ]

      localStorage.setItem(
        "favoriteHerbs",
        JSON.stringify(updatedFavoritesList)
      )

      setIsFavorite(true)
    }
  }

  // =========================================
  // VIEW HERB PROFILE
  // =========================================

  const handleViewProfile = () => {
    navigate(`/herb/${herb.id}`)
  }

  // =========================================
  // COMPARE HERB
  // =========================================

  const handleCompare = () => {
    const savedCompareHerbs =
      localStorage.getItem("selectedCompareHerbs")

    let compareHerbs = []

    if (savedCompareHerbs) {
      try {
        compareHerbs = JSON.parse(savedCompareHerbs)

        if (!Array.isArray(compareHerbs)) {
          compareHerbs = []
        }
      } catch (error) {
        console.error("Unable to read comparison herbs:", error)
        compareHerbs = []
      }
    }

    const alreadySelected = compareHerbs.some(
      (selectedHerb) => selectedHerb.id === herb.id
    )

    if (alreadySelected) {
      navigate("/compare")
      return
    }

    if (compareHerbs.length >= 4) {
      alert("You can compare up to 4 herbs.")
      return
    }

    const updatedCompareHerbs = [
      ...compareHerbs,
      herb,
    ]

    localStorage.setItem(
      "selectedCompareHerbs",
      JSON.stringify(updatedCompareHerbs)
    )

    navigate("/compare")
  }

  // =========================================
  // AYURVEDIC TAGS
  // =========================================
  //
  // Real dataset:
  // rasa       -> array
  // guna       -> array
  // virya      -> string
  // vipaka     -> string
  // karma      -> array
  //
  // We keep the same visual tag layout.
  // =========================================

  const herbTags = [
    ...(Array.isArray(herb.rasa) ? herb.rasa : []),
    ...(Array.isArray(herb.guna) ? herb.guna : []),
    herb.virya,
    herb.vipaka,
  ].filter(Boolean)

  // =========================================
  // INDICATIONS
  // =========================================

  const indications = Array.isArray(herb.indications)
    ? herb.indications.join(", ")
    : herb.indications || ""

  // =========================================
  // KARMA
  // =========================================

  const karma = Array.isArray(herb.karma)
    ? herb.karma.join(", ")
    : herb.karma || ""

  return (
    <article className="herb-result-card">

      {/* =========================================
          HERB VISUAL
          ========================================= */}

      <div
        className="herb-result-visual"
        style={{
          backgroundColor: herb.visualColor || "#a5b195",
        }}
      >

        <div className="herb-leaf-box">

          <svg
            viewBox="0 0 64 64"
            className="herb-leaf-icon"
            aria-hidden="true"
          >

            <path
              d="M52 10C31 12 16 22 12 38c-2 8 3 14 11 14 16 0 27-17 29-42Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M12 52c8-11 17-19 29-26"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />

          </svg>

        </div>

      </div>


      {/* =========================================
          HERB INFORMATION
          ========================================= */}

      <div className="herb-result-info">

        <div className="herb-result-top">

          <div>

            <h2>
              {herb.englishName || "Unnamed herb"}
            </h2>

            <em>
              {herb.botanicalName || "Botanical name unavailable"}
            </em>

          </div>


          {/* FAVORITE */}

          <button
            className={`herb-favorite-button ${
              isFavorite ? "favorite-active" : ""
            }`}
            type="button"
            onClick={handleFavorite}
            aria-label={
              isFavorite
                ? `Remove ${herb.englishName} from favorites`
                : `Save ${herb.englishName}`
            }
          >
            {isFavorite ? "♥" : "♡"}
          </button>

        </div>


        {/* =========================================
            MATCH + STATUS
            ========================================= */}

        <div className="herb-match-row">

          <strong>
            {herb.match ?? 0}%
          </strong>

          <span>
            match
          </span>

          {herb.verificationStatus && (
            <span
              className={`verification-badge ${
                herb.verificationStatus.toLowerCase()
              }`}
            >
              ✓ {herb.verificationStatus}
            </span>
          )}

        </div>


        {/* =========================================
            AYURVEDIC ATTRIBUTES
            ========================================= */}

        <div className="herb-result-tags">

          {herbTags.map((tag, index) => (
            <span key={`${herb.id}-tag-${index}`}>
              {tag}
            </span>
          ))}

        </div>


        {/* =========================================
            DESCRIPTION
            ========================================= */}

        <p className="herb-result-description">

          {herb.partUsed && (
            <>
              <strong>Part used:</strong>{" "}
              {herb.partUsed}
              {" "}
            </>
          )}

          {indications && (
            <>
              <strong>Major indications:</strong>{" "}
              {indications}
              {" "}
            </>
          )}

          {karma && (
            <>
              <strong>Karma:</strong>{" "}
              {karma}
            </>
          )}

        </p>


        {/* =========================================
            ACTIONS
            ========================================= */}

        <div className="herb-result-actions">

          <button
            className="view-profile-button"
            type="button"
            onClick={handleViewProfile}
          >
            View profile
            <span>›</span>
          </button>


          <button
            className="compare-herb-button"
            type="button"
            onClick={handleCompare}
          >
            <span>♧</span>
            Compare
          </button>

        </div>

      </div>

    </article>
  )
}

export default HerbResultCard