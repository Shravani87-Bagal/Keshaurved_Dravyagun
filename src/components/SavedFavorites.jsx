import { useNavigate } from "react-router-dom"
import "../styles/SavedFavorites.css"

function SavedFavorites() {
  const navigate = useNavigate()

  const savedFavorites = [
    {
      id: "ashwagandha",
      name: "Ashwagandha",
      status: "Verified",
      rasa: "Madhura, Tikta",
      virya: "Ushna",
    },
    {
      id: "brahmi",
      name: "Brahmi",
      status: "Verified",
      rasa: "Tikta, Kashaya",
      virya: "Sheeta",
    },
    {
      id: "triphala",
      name: "Triphala",
      status: "Verified",
      rasa: "Pancha Rasa (no Lavana)",
      virya: "Sheeta",
    },
    {
      id: "guduchi",
      name: "Guduchi",
      status: "Verified",
      rasa: "Tikta, Kashaya",
      virya: "Ushna",
    },
    {
      id: "shatavari",
      name: "Shatavari",
      status: "Verified",
      rasa: "Madhura",
      virya: "Sheeta",
    },
    {
      id: "tulsi",
      name: "Tulsi",
      status: "Verified",
      rasa: "Katu, Tikta",
      virya: "Ushna",
    },
    {
      id: "neem",
      name: "Neem",
      status: "Verified",
      rasa: "Tikta, Kashaya",
      virya: "Sheeta",
    },
    {
      id: "haritaki",
      name: "Haritaki",
      status: "Verified",
      rasa: "Pancha Rasa (no Lavana)",
      virya: "Ushna",
    },
  ]

  const visibleFavorites = savedFavorites.slice(0, 4)
  const remainingCount = savedFavorites.length - visibleFavorites.length

  const handleViewAll = () => {
    navigate("/favorites")
  }

  const handleViewHerb = (herbId) => {
    navigate(`/herb/${herbId}`)
  }

  return (
    <section className="saved-favorites">
      <div className="saved-favorites-header">
        <h2>Saved Favorites</h2>

        <button
          className="saved-favorites-view-all"
          type="button"
          onClick={handleViewAll}
        >
          View All →
        </button>
      </div>

      <div className="saved-favorites-list">
        {visibleFavorites.map((herb) => (
          <div className="saved-favorite-item" key={herb.id}>
            <div className="saved-favorite-info">
              <div className="saved-favorite-name-row">
                <h3>{herb.name}</h3>

                <span className="saved-favorite-status">
                  {herb.status}
                </span>
              </div>

              <div className="saved-favorite-details">
                <span>Rasa: {herb.rasa}</span>
                <span>Virya: {herb.virya}</span>
              </div>
            </div>

            <button
              className="saved-favorite-view-button"
              type="button"
              onClick={() => handleViewHerb(herb.id)}
            >
              View
            </button>
          </div>
        ))}

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