import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/FavoritesPage.css"

function FavoritesPage() {
  const navigate = useNavigate()

  const [savedHerbs, setSavedHerbs] = useState([])

  // Load saved herbs from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteHerbs")

    if (!savedFavorites) {
      setSavedHerbs([])
      return
    }

    try {
      const favorites = JSON.parse(savedFavorites)
      setSavedHerbs(favorites)
    } catch (error) {
      console.error("Unable to load saved herbs:", error)
      setSavedHerbs([])
    }
  }, [])

  // Remove herb from favorites
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

  // Open Herb Library
  const handleExploreHerbs = () => {
    navigate("/herb-library")
  }

  // Open Herb Detail page
  const handleViewProfile = (herbId) => {
    navigate(`/herb/${herbId}`)
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

            {/* Page Header */}
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
                  {savedHerbs.length} herbs saved
                </span>

              </div>

            </section>

            {/* Tabs */}
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

            {/* Empty State */}
            {savedHerbs.length === 0 ? (

              <section className="favorites-empty-state">

                <div className="empty-favorites-icon">
                  ♡
                </div>

                <h2>
                  Your saved library is empty
                </h2>

                <p>
                  Save herbs from their information pages to return
                  to them quickly.
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

              /* Saved Herbs */
              <section className="saved-herbs-grid">

                {savedHerbs.map((herb) => (

                  <article
                    className="saved-herb-card"
                    key={herb.id}
                  >

                    <div className="saved-herb-visual">
                      <span>♧</span>
                    </div>

                    <div className="saved-herb-info">

                      <div className="saved-herb-top">

                        <div>

                          <h2>
                            {herb.name}
                          </h2>

                          <em>
                            {herb.scientificName}
                          </em>

                        </div>

                        <button
                          className="saved-herb-favorite"
                          type="button"
                          onClick={() => removeFavorite(herb.id)}
                          aria-label={`Remove ${herb.name} from favorites`}
                        >
                          ♥
                        </button>

                      </div>

                      {/* Herb status */}
                      <div className="saved-herb-match">

                        <span className="saved-verified">
                          ✓ {herb.status || "Verified"}
                        </span>

                      </div>

                      {/* Ayurvedic properties */}
                      <div className="saved-herb-tags">

                        {herb.rasa && (
                          <span>
                            Rasa: {herb.rasa}
                          </span>
                        )}

                        {herb.guna && (
                          <span>
                            Guna: {herb.guna}
                          </span>
                        )}

                        {herb.dosha && (
                          <span>
                            Dosha: {herb.dosha}
                          </span>
                        )}

                      </div>

                      <p>
                        {herb.description}
                      </p>

                      <button
                        className="saved-view-profile"
                        type="button"
                        onClick={() => handleViewProfile(herb.id)}
                      >
                        View profile
                        <span>›</span>
                      </button>

                    </div>

                  </article>

                ))}

              </section>

            )}

          </div>

        </main>

      </div>

    </div>
  )
}

export default FavoritesPage