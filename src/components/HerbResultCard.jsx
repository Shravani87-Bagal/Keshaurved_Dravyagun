import { useEffect, useState } from "react"

function HerbResultCard({ herb }) {

  const [isFavorite, setIsFavorite] = useState(false)

  // Check whether this herb is already saved
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

  // Add / remove herb from favorites
  const handleFavorite = () => {

    const savedFavorites = localStorage.getItem("favoriteHerbs")

    let favorites = []

    if (savedFavorites) {
      try {
        favorites = JSON.parse(savedFavorites)
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
        id: herb.id || herb.name
      }

      const updatedFavorites = [
        ...favorites,
        updatedHerb
      ]

      localStorage.setItem(
        "favoriteHerbs",
        JSON.stringify(updatedFavorites)
      )

      setIsFavorite(true)
    }
  }

  return (
    <article className="herb-result-card">

      {/* Herb visual block */}

      <div
        className="herb-result-visual"
        style={{ backgroundColor: herb.visualColor }}
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


      {/* Herb information */}

      <div className="herb-result-info">

        <div className="herb-result-top">

          <div>

            <h2>
              {herb.name}
            </h2>

            <em>
              {herb.scientificName}
            </em>

          </div>


          {/* Favorite button */}

          <button
            className={`herb-favorite-button ${
              isFavorite ? "favorite-active" : ""
            }`}
            type="button"
            onClick={handleFavorite}
            aria-label={
              isFavorite
                ? `Remove ${herb.name} from favorites`
                : `Save ${herb.name}`
            }
          >
            {isFavorite ? "♥" : "♡"}
          </button>

        </div>


        {/* Match */}

        <div className="herb-match-row">

          <strong>
            {herb.match}%
          </strong>

          <span>
            match
          </span>

          <span
            className={`verification-badge ${herb.status.toLowerCase()}`}
          >
            ✓ {herb.status}
          </span>

        </div>


        {/* Ayurvedic attributes */}

        <div className="herb-result-tags">

          {herb.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}

        </div>


        {/* Description */}

        <p className="herb-result-description">
          {herb.description}
        </p>


        {/* Bottom actions */}

        <div className="herb-result-actions">

          <button
            className="view-profile-button"
            type="button"
          >
            View profile
            <span>›</span>
          </button>


          <button
            className="compare-herb-button"
            type="button"
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