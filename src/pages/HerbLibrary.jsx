import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import "../styles/HerbLibrary.css"

function LeafIcon({ variant = "green" }) {
  return (
    <div className={`herb-leaf-icon ${variant}`}>
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M48.5 10.5C35.5 12 23.2 17.2 16.5 26.3C9.8 35.4 11.8 47 12.4 49.6C15 49.9 27.5 49.5 36.1 41.2C44.3 33.3 48.4 20.7 48.5 10.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M13 50C21.5 41.2 29.5 34.3 41.5 25.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <path
          d="M23.5 39.5C20.5 38.2 18.2 36.3 16.5 33.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M31 32.8C28.8 31.8 26.7 30.3 25 28.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function HerbLibrary() {
  const navigate = useNavigate()

  const herbs = [
    {
      id: "HERB_REC_0001",
      name: "Ashwagandha",
      scientificName: "Withania somnifera",
      description:
        "A grounding Rasayana traditionally used to support strength, restorative sleep, and balanced energy.",
      dosha: "Vata ↓ · Kapha ↓",
      dhatu: "Mamsa · Majja",
      rasa: "Bitter · Sweet",
      guna: "Light · Unctuous",
      virya: "Heating",
      vipaka: "Sweet",
      karma: "Balya · Rasayana",
      status: "Verified",
      variant: "green",
    },

    {
      id: "HERB_REC_0002",
      name: "Guduchi",
      scientificName: "Tinospora cordifolia",
      description:
        "A rejuvenating vine traditionally used in Rasayana and digestive-supportive applications.",
      dosha: "Tridoshic",
      dhatu: "Rasa · Rakta",
      rasa: "Bitter",
      guna: "Light · Unctuous",
      virya: "Heating",
      vipaka: "Sweet",
      karma: "Rasayana · Deepana",
      status: "Verified",
      variant: "sage",
    },

    {
      id: "HERB_REC_0003",
      name: "Shatavari",
      scientificName: "Asparagus racemosus",
      description:
        "A nourishing root traditionally associated with hydration, vitality, and reproductive tissues.",
      dosha: "Vata ↓ · Pitta ↓",
      dhatu: "Rasa · Rakta · Shukra",
      rasa: "Sweet · Bitter",
      guna: "Heavy · Unctuous",
      virya: "Cooling",
      vipaka: "Sweet",
      karma: "Rasayana · Stanyajanana",
      status: "Reviewed",
      variant: "cream",
    },

    {
      id: "HERB_REC_0004",
      name: "Tulsi",
      scientificName: "Ocimum tenuiflorum",
      description:
        "An aromatic leaf traditionally used to support clear breathing, digestion, and mental clarity.",
      dosha: "Kapha ↓ · Vata ↓",
      dhatu: "Rasa · Rakta",
      rasa: "Pungent · Bitter",
      guna: "Light · Dry",
      virya: "Heating",
      vipaka: "Pungent",
      karma: "Deepana · Kaphaghna",
      status: "Verified",
      variant: "sage",
    },

    {
      id: "HERB_REC_0005",
      name: "Yashtimadhu",
      scientificName: "Glycyrrhiza glabra",
      description:
        "A soothing root traditionally valued for nourishing the voice, stomach, and respiratory tissues.",
      dosha: "Vata ↓ · Pitta ↓",
      dhatu: "Rasa · Rakta · Shukra",
      rasa: "Sweet",
      guna: "Heavy · Unctuous",
      virya: "Cooling",
      vipaka: "Sweet",
      karma: "Rasayana · Varnya",
      status: "Reviewed",
      variant: "cream",
    },

    {
      id: "HERB_REC_0006",
      name: "Neem",
      scientificName: "Azadirachta indica",
      description:
        "A cooling bitter herb traditionally used in cleansing protocols and support for clear skin.",
      dosha: "Pitta ↓ · Kapha ↓",
      dhatu: "Rakta · Mamsa",
      rasa: "Bitter · Astringent",
      guna: "Light · Dry",
      virya: "Cooling",
      vipaka: "Pungent",
      karma: "Krimighna · Kusthaghna",
      status: "Verified",
      variant: "green",
    },

    {
      id: "HERB_REC_0007",
      name: "Haritaki",
      scientificName: "Terminalia chebula",
      description:
        "A classical herb traditionally used to support digestion, elimination, and Rasayana purposes.",
      dosha: "Tridoshic · Vata ↓",
      dhatu: "Rasa · Rakta · Mamsa",
      rasa: "Astringent · Five tastes except Salt",
      guna: "Light · Dry",
      virya: "Heating",
      vipaka: "Sweet",
      karma: "Anulomana · Rasayana",
      status: "Verified",
      variant: "sage",
    },

    {
      id: "HERB_REC_0008",
      name: "Amalaki",
      scientificName: "Phyllanthus emblica",
      description:
        "A potent Rasayana traditionally used for nourishment, vitality, and tissue support.",
      dosha: "Tridoshic · Pitta ↓",
      dhatu: "Rasa · Rakta · Shukra",
      rasa: "Sour · Sweet · Bitter · Astringent · Pungent",
      guna: "Light · Dry",
      virya: "Cooling",
      vipaka: "Sweet",
      karma: "Rasayana · Vayasthapana",
      status: "Verified",
      variant: "green",
    },

    {
      id: "HERB_REC_0009",
      name: "Turmeric",
      scientificName: "Curcuma longa",
      description:
        "A classical herb traditionally used for its cleansing, tissue-supportive, and balancing properties.",
      dosha: "Kapha ↓ · Vata ↓",
      dhatu: "Rakta · Mamsa",
      rasa: "Bitter · Pungent",
      guna: "Light · Dry",
      virya: "Heating",
      vipaka: "Pungent",
      karma: "Kaphaghna · Krimighna",
      status: "Verified",
      variant: "cream",
    },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHerbs, setSelectedHerbs] = useState([])
  const [favoriteHerbs, setFavoriteHerbs] = useState([])

useEffect(() => {
  const savedFavorites =
    JSON.parse(localStorage.getItem("favoriteHerbs")) || []

  setFavoriteHerbs(savedFavorites)
}, [])

const isFavorite = (herbId) => {
  return favoriteHerbs.some((item) => item.id === herbId)
}

const handleFavorite = (event, herb) => {
  event.stopPropagation()

  setFavoriteHerbs((previous) => {
    const alreadyFavorite = previous.some(
      (item) => item.id === herb.id
    )

    const updatedFavorites = alreadyFavorite
      ? previous.filter((item) => item.id !== herb.id)
      : [...previous, herb]

    localStorage.setItem(
      "favoriteHerbs",
      JSON.stringify(updatedFavorites)
    )

    return updatedFavorites
  })
}

  const filteredHerbs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return herbs
    }

    return herbs.filter(
      (herb) =>
        herb.name.toLowerCase().includes(query) ||
        herb.scientificName.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const toggleHerb = (herb) => {
    setSelectedHerbs((previous) => {
      const alreadySelected = previous.some(
        (item) => item.id === herb.id
      )

      if (alreadySelected) {
        return previous.filter((item) => item.id !== herb.id)
      }

      return [...previous, herb]
    })
  }

  const clearSelection = () => {
    setSelectedHerbs([])
  }

  const handleCompare = () => {
    if (selectedHerbs.length < 2) {
      return
    }

    localStorage.setItem(
      "selectedCompareHerbs",
      JSON.stringify(selectedHerbs)
    )

    navigate("/compare")
  }

  const handleViewInformation = (event, herb) => {
    event.stopPropagation()
    navigate(`/herb/${herb.id}`)
  }

  return (
    <div className="herb-library-layout">
      <DashboardNavbar />

      <div className="herb-library-body">
        <Sidebar />

        <main className="herb-library-content">
          <div className="herb-library-inner">

            {/* HEADER */}
            <section className="herb-library-header">
              <div>
                <p className="herb-library-breadcrumb">
                  COMPARE / HERB LIBRARY
                </p>

                <h1>Select herbs to compare</h1>
              </div>

              <div className="library-selected-count">
                <span className="selection-network-icon">♧</span>

                <span>
                  {selectedHerbs.length}{" "}
                  {selectedHerbs.length === 1 ? "herb" : "herbs"} selected
                </span>
              </div>
            </section>

            {/* SELECTION INFORMATION */}
            <section className="selection-banner">
              <div className="selection-banner-text">
                <p>
                  Choose two or more herbs to compare their Ayurvedic
                  properties side by side.
                </p>

                <strong>
                  {selectedHerbs.length < 2
                    ? "Select at least 2 herbs to compare."
                    : `${selectedHerbs.length} herbs selected. Ready to compare.`}
                </strong>
              </div>

              <div className="selection-banner-actions">
                <button
                  className="clear-selection-button"
                  type="button"
                  onClick={clearSelection}
                  disabled={selectedHerbs.length === 0}
                >
                  Clear selection
                </button>

                <button
                  className="compare-selected-button"
                  type="button"
                  disabled={selectedHerbs.length < 2}
                  onClick={handleCompare}
                >
                  Compare selected
                  <span>›</span>
                </button>
              </div>
            </section>

            {/* SEARCH */}
            <section className="herb-library-search">
              <span className="library-search-icon">⌕</span>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search herbs by name..."
              />
            </section>

            {/* HERB GRID */}
            <section className="herb-library-grid">
              {filteredHerbs.map((herb) => {
                const isSelected = selectedHerbs.some(
                  (item) => item.id === herb.id
                )

                return (
                  <article
                    className={`herb-library-card ${
                      isSelected ? "selected" : ""
                    }`}
                    key={herb.id}
                    onClick={() => toggleHerb(herb)}
                  >
                    {/* CHECKBOX + ICON */}
                    <div className="herb-card-main">
                      <button
                        type="button"
                        className={`herb-checkbox ${
                          isSelected ? "checked" : ""
                        }`}
                        aria-label={`Select ${herb.name}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleHerb(herb)
                        }}
                      >
                        {isSelected && "✓"}
                      </button>

                      <LeafIcon variant={herb.variant} />

                      <div className="herb-card-information">
                        <h2>{herb.name}</h2>

                        <em>{herb.scientificName}</em>

                        <p>{herb.description}</p>

                        <div
                          className={`herb-status ${
                            herb.status === "Reviewed"
                              ? "reviewed"
                              : "verified"
                          }`}
                        >
                          <span>
                            {herb.status === "Verified" ? "✓" : "◷"}
                          </span>

                          {herb.status}
                        </div>

                        <div className="herb-card-actions">
  <button
    type="button"
    className={`herb-favorite-action ${
      isFavorite(herb.id) ? "favorite-active" : ""
    }`}
    onClick={(event) => handleFavorite(event, herb)}
  >
    {isFavorite(herb.id) ? "♥ Remove from favorites" : "♡ Add to favorites"}
  </button>

  <button
    type="button"
    className="herb-view-information"
    onClick={(event) =>
      handleViewInformation(event, herb)
    }
  >
    View information
    <span>›</span>
  </button>
</div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            {/* NO RESULTS */}
            {filteredHerbs.length === 0 && (
              <div className="herb-library-no-results">
                <h2>No herbs found</h2>

                <p>
                  Try searching with another herb name or scientific name.
                </p>
              </div>
            )}

            {/* FOOTER */}
            <div className="herb-library-footer">
              <span>
                Showing {filteredHerbs.length} herbs
              </span>

              <div className="library-pagination">
                <button type="button" disabled>
                  ‹
                </button>

                <button
                  type="button"
                  className="active"
                >
                  1
                </button>

                <button type="button" disabled>
                  ›
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default HerbLibrary