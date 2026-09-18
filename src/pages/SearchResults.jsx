import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import HerbResultCard from "../components/HerbResultCard"

import "../styles/SearchResults.css"

function SearchResults() {

  const herbResults = [
    {
      name: "Ashwagandha",
      scientificName: "Withania somnifera",
      match: 96,
      status: "Verified",
      visualColor: "#a5b195",
      tags: [
        "Vata-pacifying: strong",
        "Rasayana",
        "Muscle tissue",
      ],
      description:
        "A grounding adaptogen traditionally used to support strength, restorative sleep, and balanced energy.",
    },

    {
      name: "Guduchi",
      scientificName: "Tinospora cordifolia",
      match: 91,
      status: "Verified",
      visualColor: "#91a57d",
      tags: [
        "Tridoshic",
        "Immunity",
        "Bitter",
      ],
      description:
        "A rejuvenating vine with broad traditional applications for vitality and balanced physiological function.",
    },

    {
      name: "Shatavari",
      scientificName: "Asparagus racemosus",
      match: 87,
      status: "Reviewed",
      visualColor: "#c9bd8d",
      tags: [
        "Pitta-pacifying",
        "Rasayana",
        "Ojas",
      ],
      description:
        "A nourishing root traditionally associated with hydration, vitality, and support of the reproductive tissues.",
    },

    {
      name: "Haridra",
      scientificName: "Curcuma longa",
      match: 82,
      status: "Verified",
      visualColor: "#d4ad4d",
      tags: [
        "Kapha-pacifying",
        "Anti-inflammatory",
        "Pungent",
      ],
      description:
        "A bright rhizome used in classical formulations for healthy circulation and clear digestion.",
    },
  ]

  return (
    <div className="search-results-layout">

      {/* Top Dashboard Navbar */}
      <DashboardNavbar />

      <div className="search-results-body">

        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Results Area */}
        <main className="search-results-page">

          <div className="search-results-content">

            {/* Results Header */}
            <section className="results-header">

              <div className="results-header-left">

                <p className="results-label">
                  SEARCH RESULTS
                </p>

                <h1>
                  Joint pain, cold weather, stiffness
                </h1>

                <p className="results-count">
                  24 herbs matched your description
                </p>

              </div>

              <div className="results-header-actions">

                <button
                  className="results-filter-button"
                  type="button"
                >
                  <span>☷</span>
                  Filters
                </button>

                <button
                  className="results-sort-button"
                  type="button"
                >
                  Best match
                  <span>⌄</span>
                </button>

              </div>

            </section>

            {/* Result Meta */}
            <div className="results-meta-row">

              <span>
                ✓ Includes verified profiles
              </span>

            </div>

            {/* Herb Results */}
            <section className="herb-results-list">

              {herbResults.map((herb) => (
                <HerbResultCard
                  key={herb.name}
                  herb={herb}
                />
              ))}

            </section>

          </div>

        </main>

      </div>

    </div>
  )
}

export default SearchResults