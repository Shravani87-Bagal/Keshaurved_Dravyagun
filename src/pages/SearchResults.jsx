import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import HerbResultCard from "../components/HerbResultCard"

import "../styles/SearchResults.css"

function SearchResults() {
  /*
    These are real herb records from the cleaned project dataset.

    The final 176-record dataset will later be connected through the
    backend/data layer. Match percentage will also be calculated by
    the scoring system instead of being manually assigned here.
  */

  const herbResults = [
    {
      id: "HERB_REC_0001",
      name: "Guduchi",
      scientificName: "tinospora cordifolia",
      match: 0,
      status: "",
      visualColor: "#a5b195",
      tags: [
        "Tikta, Kashay",
        "Laghu, Snigdha",
        "Ushna",
        "Rasayana",
        "Balya",
      ],
      description:
        "Part used: stem. Major diseases/indications: vaatrakt, jwar, kamala, pandu, prameha, kushta, daah, krimirog, visha.",
    },

    {
      id: "HERB_REC_0002",
      name: "Indian Silver Fir",
      scientificName: "Abies webbiana",
      match: 0,
      status: "",
      visualColor: "#91a57d",
      tags: [
        "Madhura, Tikta",
        "Laghu, Snigdha, Tikshna",
        "Ushna",
        "Deepana",
        "Pachana",
      ],
      description:
        "Part used: Leaves. Major diseases/indications: Aruchi, gulm, agnimandya, aadhman, kaas, shwas, rajyakshma, swarbhed, kshayrog, daurbalya.",
    },

    {
      id: "HERB_REC_0003",
      name: "Irimed",
      scientificName: "Acacia ferruginea DC",
      match: 0,
      status: "",
      visualColor: "#c9bd8d",
      tags: [
        "Tikta, Kashay",
        "Laghu, Ruksha",
        "Sheeta",
        "Shothahara",
        "Kushtaghna",
      ],
      description:
        "Part used: Mainly stem bark, also heartwood/gum. Major diseases/indications: Kustha, pandu, krumi, pradar.",
    },

    {
      id: "HERB_REC_0004",
      name: "Pishachkarpaas",
      scientificName: "Abroma augusta",
      match: 0,
      status: "",
      visualColor: "#d4ad4d",
      tags: [
        "Katu, Tikta",
        "Laghu, Ruksha, Tikshna",
        "Ushna",
        "Deepana",
        "Pachana",
      ],
      description:
        "Part used: Root. Major diseases/indications: Artavutpatti, kashtartav, puymeh, garbhashay bal increase.",
    },

    {
      id: "HERB_REC_0005",
      name: "Aapamarg",
      scientificName: "Achyranthes aspera",
      match: 0,
      status: "",
      visualColor: "#9caf8d",
      tags: [
        "Katu, Tikta",
        "Snigdha, Ruksha, Tikshna, Sara",
        "Ushna",
        "Deepana",
        "Rechana",
      ],
      description:
        "Part used: Whole plant (Panchanga). Major diseases/indications: Ashmari, Mutrakrichra, Arsha, Krimi, Kandu, Kushta.",
    },

    {
      id: "HERB_REC_0006",
      name: "Gorakshi",
      scientificName: "Adansonia",
      match: 0,
      status: "",
      visualColor: "#b6aa8d",
      tags: [
        "Madhura, Amla",
        "Guru, Ruksha",
        "Sheeta",
        "Balya",
        "Grahi",
      ],
      description:
        "Part used: Fruit, fruit pulp, bark, leaves and seeds. Major diseases/indications: Atisara, Grahani, Daha, Trishna, Daurbalya.",
    },

    {
      id: "HERB_REC_0007",
      name: "Gunja",
      scientificName: "Abdus precatorius",
      match: 0,
      status: "",
      visualColor: "#a9b99d",
      tags: [
        "Katu, Tikta, Kashay",
        "Laghu, Ruksha, Tikshna",
        "Ushna",
        "Kushtaghna",
        "Krimighna",
      ],
      description:
        "Part used: Seeds, roots and leaves. Major diseases/indications: Alopecia, skin disorders, daurbalya, mutrakrushra, kushtha, jirnavran.",
    },

    {
      id: "HERB_REC_0008",
      name: "Babbula",
      scientificName: "Acasia arabica",
      match: 0,
      status: "",
      visualColor: "#c2b997",
      tags: [
        "Kashay",
        "Guru, Ruksha",
        "Sheeta",
        "Grahi",
        "Medohara",
      ],
      description:
        "Part used: Bark, flower and seeds. Major diseases/indications: Atisar, mukharog, shotha, vrana, prameh, dantarog, raktasrav.",
    },

    {
      id: "HERB_REC_0009",
      name: "Vatsanabh",
      scientificName: "Aconitum ferox",
      match: 0,
      status: "",
      visualColor: "#a4af96",
      tags: [
        "Madhura",
        "Ruksha, Tikshna",
        "Ushna",
        "Rasayana",
        "Deepana",
      ],
      description:
        "Part used: Root. Major diseases/indications: Shir-shul, vran, shotha, aruchi, arsha, kas, kushtha, trushna.",
    },

    {
      id: "HERB_REC_0010",
      name: "Ativisha",
      scientificName: "Aconitum Heterophyllum",
      match: 0,
      status: "",
      visualColor: "#b0b99f",
      tags: [
        "Katu, Tikta",
        "Laghu, Ruksha",
        "Ushna",
        "Deepana",
        "Pachana",
      ],
      description:
        "Part used: Root. Major diseases/indications: Grahani, vishamjwar, sthanyavikar, shwetatisar, kaphaj kas.",
    },
  ]

  return (
    <div className="search-results-layout">

      <DashboardNavbar />

      <div className="search-results-body">

        <Sidebar />

        <main className="search-results-page">

          <div className="search-results-content">

            {/* Results Header */}
            <section className="results-header">

              <div className="results-header-left">

                <p className="results-label">
                  SEARCH RESULTS
                </p>

                <h1>
                  Ayurvedic herb profiles
                </h1>

                <p className="results-count">
                  {herbResults.length} herb profiles currently displayed
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
                ✓ Structured Ayurvedic dataset
              </span>

            </div>

            {/* Herb Results */}
            <section className="herb-results-list">

              {herbResults.map((herb) => (
                <HerbResultCard
                  key={herb.id}
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