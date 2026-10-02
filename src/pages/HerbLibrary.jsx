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

  /*
    REAL HERB DATASET

    These records use the same structure as the dataset
    used by the search result page.

    Later, this array can be replaced directly by API data
    without changing the UI structure.
  */
  const herbs = [
    {
      id: "HERB_REC_0001",
      englishName: "heart leaved moon seed",
      botanicalName: "tinospora cordifolia",

      regionalNames: [
        "Guduchi",
        "gulvel",
      ],

      partUsed: "stem",

      rasa: [
        "Tikta",
        "Kashay",
      ],

      guna: [
        "Laghu",
        "Snigdha",
      ],

      virya: "Ushna",
      vipaka: "Madhura",

      prabhava: "vrushya and pitta shaman",

      dosha: {
        vata: "Decreases",
        pitta: "Decreases",
        kapha: "Decreases",
      },

      dhatu: [
        "Rasa (5)",
        "Rakta (5)",
        "Mamsa (4)",
        "Meda (4)",
        "Asthi (3)",
        "Majja (4)",
        "Shukra (3)",
      ],

      mala: [
        "Purisha: Decreases",
        "Mutra: Increases",
      ],

      srotas: [
        "Rasavaha",
        "Raktavaha",
        "Mamsavaha",
        "Medovaha",
        "Shukravaha",
        "Mutravaha",
        "Artavavaha",
      ],

      avayava: [],

      karma: [
        "Rasayana",
        "Balya",
        "Deepana",
        "Pachana",
        "Krimighna",
        "Mutrala",
        "jwaraghna",
        "tridoshhar",
        "vishaghna",
        "dahashamak",
        "Grahi",
        "Medhya",
      ],

      indications: [
        "vaatrakt",
        "jwar",
        "kamala",
        "pandu.prameha",
        "kushta",
        "daah",
        "krimirog",
        "visha",
      ],

      references: [],

      verificationStatus: "Draft",

      variant: "green",
    },

    {
      id: "HERB_REC_0002",
      englishName: "Indian Silver fir",
      botanicalName: "Abies webbiana",

      regionalNames: [
        "Indian Silver Fir",
        "Talispatra",
      ],

      partUsed: "Leaves",

      rasa: [
        "Madhura",
        "Tikta",
      ],

      guna: [
        "Laghu",
        "Snigdha",
        "Tikshna",
      ],

      virya: "Ushna",
      vipaka: "Katu",

      prabhava: "Kasahar",

      dosha: {
        vata: "Decreases",
        pitta: "",
        kapha: "Decreases",
      },

      dhatu: [
        "Rasa (0)",
      ],

      mala: [
        "Purisha: Increases",
      ],

      srotas: [
        "Pranavaha",
        "Annavaha",
        "Rasavaha",
      ],

      avayava: [],

      karma: [
        "Deepana",
        "Pachana",
        "Grahi",
        "Rechana",
        "Vatanuloman",
      ],

      indications: [
        "Aruchi",
        "gulm",
        "agnimandya",
        "aadhman",
        "kaas",
        "shwas",
        "rajyakshma",
        "swarbhed",
        "kshayrog",
        "daurbalya",
      ],

      references: [],

      verificationStatus: "Draft",

      variant: "sage",
    },

    {
      id: "HERB_REC_0003",
      englishName: "Irimed",
      botanicalName: "Acacia ferruginea DC",

      regionalNames: [
        "Dhavi khair",
      ],

      partUsed: "Mainly stem bark, also heartwood/gum",

      rasa: [
        "Tikta",
        "Kashay",
      ],

      guna: [
        "Laghu",
        "Ruksha",
      ],

      virya: "Sheeta",
      vipaka: "Katu",

      prabhava: "",

      dosha: {
        vata: "Increases",
        pitta: "Decreases",
        kapha: "Decreases",
      },

      dhatu: [
        "Rasa (0)",
        "Rakta (5)",
        "Shukra (5)",
      ],

      mala: [
        "Purisha: Increases",
        "Mutra: Increases",
      ],

      srotas: [
        "Pranavaha",
        "Raktavaha",
        "Mamsavaha",
        "Purishavaha",
      ],

      avayava: [],

      karma: [
        "Shothahara",
        "Kushtaghna",
        "Krimighna",
        "Raktaprasadak",
        "garbhashay-shaythilyahar",
        "plihavruddhi",
        "Swarbhed",
        "raktstrav",
        "dantarog",
        "atisar",
      ],

      indications: [
        "Kustha",
        "pandu",
        "krumi",
        "pradar",
      ],

      references: [],

      verificationStatus: "Draft",

      variant: "cream",
    },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHerbs, setSelectedHerbs] = useState([])
  const [favoriteHerbs, setFavoriteHerbs] = useState([])

  /*
    LOAD FAVORITES
  */
  useEffect(() => {
    try {
      const savedFavorites =
        JSON.parse(localStorage.getItem("favoriteHerbs")) || []

      setFavoriteHerbs(savedFavorites)
    } catch (error) {
      console.error("Unable to load favorite herbs:", error)
      setFavoriteHerbs([])
    }
  }, [])

  /*
    CHECK FAVORITE
  */
  const isFavorite = (herbId) => {
    return favoriteHerbs.some(
      (item) => item.id === herbId
    )
  }

  /*
    ADD / REMOVE FAVORITE
  */
  const handleFavorite = (event, herb) => {
    event.stopPropagation()

    setFavoriteHerbs((previous) => {
      const alreadyFavorite = previous.some(
        (item) => item.id === herb.id
      )

      const updatedFavorites = alreadyFavorite
        ? previous.filter(
            (item) => item.id !== herb.id
          )
        : [...previous, herb]

      localStorage.setItem(
        "favoriteHerbs",
        JSON.stringify(updatedFavorites)
      )

      return updatedFavorites
    })
  }

  /*
    SEARCH

    Search works with:
    - English name
    - Botanical name
    - Regional names
  */
  const filteredHerbs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return herbs
    }

    return herbs.filter((herb) => {
      const englishName =
        herb.englishName?.toLowerCase() || ""

      const botanicalName =
        herb.botanicalName?.toLowerCase() || ""

      const regionalNames =
        herb.regionalNames
          ?.join(" ")
          .toLowerCase() || ""

      return (
        englishName.includes(query) ||
        botanicalName.includes(query) ||
        regionalNames.includes(query)
      )
    })
  }, [searchQuery])

  /*
    SELECT / DESELECT HERB
  */
  const toggleHerb = (herb) => {
    setSelectedHerbs((previous) => {
      const alreadySelected = previous.some(
        (item) => item.id === herb.id
      )

      if (alreadySelected) {
        return previous.filter(
          (item) => item.id !== herb.id
        )
      }

      return [...previous, herb]
    })
  }

  /*
    CLEAR SELECTION
  */
  const clearSelection = () => {
    setSelectedHerbs([])
  }

  /*
    COMPARE SELECTED HERBS
  */
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

  /*
    OPEN HERB DETAIL PAGE

    IMPORTANT:
    The exact same herb object is identified using
    its real dataset ID.
  */
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
                <span className="selection-network-icon">
                  ♧
                </span>

                <span>
                  {selectedHerbs.length}{" "}
                  {selectedHerbs.length === 1
                    ? "herb"
                    : "herbs"}{" "}
                  selected
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
              <span className="library-search-icon">
                ⌕
              </span>

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

                const regionalName =
                  herb.regionalNames?.join(" · ")

                const rasa =
                  herb.rasa?.join(" · ")

                const guna =
                  herb.guna?.join(" · ")

                const karma =
                  herb.karma?.slice(0, 2).join(" · ")

                const indications =
                  herb.indications?.slice(0, 4).join(", ")

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
                        aria-label={`Select ${herb.englishName}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleHerb(herb)
                        }}
                      >
                        {isSelected && "✓"}
                      </button>

                      <LeafIcon
                        variant={herb.variant}
                      />

                      <div className="herb-card-information">

                        {/* NAME */}
                        <h2>
                          {herb.englishName}
                        </h2>

                        {/* BOTANICAL NAME */}
                        <em>
                          {herb.botanicalName}
                        </em>

                        {/* REGIONAL NAMES */}
                        {regionalName && (
                          <p>
                            <strong>
                              Also known as:
                            </strong>{" "}
                            {regionalName}
                          </p>
                        )}

                        {/* DESCRIPTION */}
                        <p>
                          <strong>
                            Part used:
                          </strong>{" "}
                          {herb.partUsed}
                        </p>

                        {/* AYURVEDIC SUMMARY */}
                        <p>
                          <strong>
                            Rasa:
                          </strong>{" "}
                          {rasa}
                          {" · "}
                          <strong>
                            Guna:
                          </strong>{" "}
                          {guna}
                        </p>

                        <p>
                          <strong>
                            Virya:
                          </strong>{" "}
                          {herb.virya}
                          {" · "}
                          <strong>
                            Vipaka:
                          </strong>{" "}
                          {herb.vipaka}
                        </p>

                        {/* STATUS */}
                        <div
                          className={`herb-status ${
                            herb.verificationStatus ===
                            "Verified"
                              ? "verified"
                              : herb.verificationStatus ===
                                "Reviewed"
                              ? "reviewed"
                              : "draft"
                          }`}
                        >
                          <span>
                            {herb.verificationStatus ===
                            "Verified"
                              ? "✓"
                              : herb.verificationStatus ===
                                "Reviewed"
                              ? "◷"
                              : "○"}
                          </span>

                          {herb.verificationStatus}
                        </div>

                        {/* ACTIONS */}
                        <div className="herb-card-actions">

                          {/* FAVORITE */}
                          <button
                            type="button"
                            className={`herb-favorite-action ${
                              isFavorite(herb.id)
                                ? "favorite-active"
                                : ""
                            }`}
                            onClick={(event) =>
                              handleFavorite(
                                event,
                                herb
                              )
                            }
                          >
                            {isFavorite(herb.id)
                              ? "♥ Remove from favorites"
                              : "♡ Add to favorites"}
                          </button>

                          {/* VIEW INFORMATION */}
                          <button
                            type="button"
                            className="herb-view-information"
                            onClick={(event) =>
                              handleViewInformation(
                                event,
                                herb
                              )
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
                  Try searching with another herb name,
                  botanical name, or regional name.
                </p>
              </div>
            )}

            {/* FOOTER */}
            <div className="herb-library-footer">
              <span>
                Showing {filteredHerbs.length} herbs
              </span>

              <div className="library-pagination">
                <button
                  type="button"
                  disabled
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="active"
                >
                  1
                </button>

                <button
                  type="button"
                  disabled
                >
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