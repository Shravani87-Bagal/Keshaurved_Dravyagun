import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import HerbResultCard from "../components/HerbResultCard"

import "../styles/SearchResults.css"


/* =========================================
   TEMPORARY FRONTEND HERB DATA

   This is only for the frontend demo.

   Later:
   backend / RAG / scoring engine
   will provide the real results.
   ========================================= */

const herbDataset = [
  {
    id: "HERB_REC_0001",
    englishName: "Ashwagandha",
    botanicalName: "Withania somnifera",
    partUsed: "Root",
    rasa: "Madhura, Tikta",
    guna: "Laghu, Snigdha",
    virya: "Ushna",
    vipaka: "Madhura",
    dosha: "Vata · Decreases, Kapha · Decreases",
    dhatu: "Mamsa, Majja",
    importantKarma: "Balya, Rasayana",
    majorDiseases:
      "Daurbalya, Vata disorders, stress-related conditions",
    status: "Verified",
    visualColor: "#a5b195",
  },

  {
    id: "HERB_REC_0002",
    englishName: "Guduchi",
    botanicalName: "Tinospora cordifolia",
    partUsed: "Stem",
    rasa: "Tikta, Kashay",
    guna: "Laghu, Snigdha",
    virya: "Ushna",
    vipaka: "Madhura",
    dosha: "Tridoshic",
    dhatu: "Rasa, Rakta",
    importantKarma: "Rasayana, Balya",
    majorDiseases:
      "Jvara, Kamala, Pandu, Prameha, Kushta, Krimi",
    status: "Verified",
    visualColor: "#91a57d",
  },

  {
    id: "HERB_REC_0003",
    englishName: "Shatavari",
    botanicalName: "Asparagus racemosus",
    partUsed: "Root",
    rasa: "Madhura, Tikta",
    guna: "Guru, Snigdha",
    virya: "Sheeta",
    vipaka: "Madhura",
    dosha: "Vata · Decreases, Pitta · Decreases",
    dhatu: "Rasa, Shukra",
    importantKarma: "Rasayana, Balya",
    majorDiseases:
      "Artava disorders, weakness, reproductive health",
    status: "Reviewed",
    visualColor: "#c9bd8d",
  },

  {
    id: "HERB_REC_0004",
    englishName: "Tulsi",
    botanicalName: "Ocimum tenuiflorum",
    partUsed: "Leaves",
    rasa: "Katu, Tikta",
    guna: "Laghu, Ruksha",
    virya: "Ushna",
    vipaka: "Katu",
    dosha: "Kapha · Decreases, Vata · Decreases",
    dhatu: "Rasa, Rakta",
    importantKarma: "Deepana, Pachana",
    majorDiseases:
      "Kasa, Shwasa, Kapha disorders, seasonal congestion",
    status: "Verified",
    visualColor: "#d4ad4d",
  },

  {
    id: "HERB_REC_0005",
    englishName: "Yashtimadhu",
    botanicalName: "Glycyrrhiza glabra",
    partUsed: "Root",
    rasa: "Madhura",
    guna: "Guru, Snigdha",
    virya: "Sheeta",
    vipaka: "Madhura",
    dosha: "Vata · Decreases, Pitta · Decreases",
    dhatu: "Rasa, Rakta",
    importantKarma: "Brimhana, Rasayana",
    majorDiseases:
      "Kasa, Shwasa, Daha, weakness",
    status: "Reviewed",
    visualColor: "#9caf8d",
  },

  {
    id: "HERB_REC_0006",
    englishName: "Neem",
    botanicalName: "Azadirachta indica",
    partUsed: "Leaves, bark",
    rasa: "Tikta, Kashay",
    guna: "Laghu, Ruksha",
    virya: "Sheeta",
    vipaka: "Katu",
    dosha: "Pitta · Decreases, Kapha · Decreases",
    dhatu: "Rakta, Mamsa",
    importantKarma: "Krimighna, Kandughna",
    majorDiseases:
      "Kushta, skin disorders, Krimi",
    status: "Verified",
    visualColor: "#b6aa8d",
  },

  {
    id: "HERB_REC_0007",
    englishName: "Haritaki",
    botanicalName: "Terminalia chebula",
    partUsed: "Fruit",
    rasa: "Kashay",
    guna: "Laghu, Ruksha",
    virya: "Ushna",
    vipaka: "Madhura",
    dosha: "Tridoshic, Vata · Decreases",
    dhatu: "Rasa, Mamsa",
    importantKarma: "Rasayana, Anulomana",
    majorDiseases:
      "Grahani, constipation, digestive disorders",
    status: "Verified",
    visualColor: "#a9b99d",
  },

  {
    id: "HERB_REC_0008",
    englishName: "Amalaki",
    botanicalName: "Phyllanthus emblica",
    partUsed: "Fruit",
    rasa: "Amla, Madhura",
    guna: "Laghu, Ruksha",
    virya: "Sheeta",
    vipaka: "Madhura",
    dosha: "Tridoshic, Pitta · Decreases",
    dhatu: "Rasa, Rakta",
    importantKarma: "Rasayana, Chakshushya",
    majorDiseases:
      "Pitta disorders, weakness, digestive disorders",
    status: "Verified",
    visualColor: "#c2b997",
  },

  {
    id: "HERB_REC_0009",
    englishName: "Turmeric",
    botanicalName: "Curcuma longa",
    partUsed: "Rhizome",
    rasa: "Tikta, Katu",
    guna: "Laghu, Ruksha",
    virya: "Ushna",
    vipaka: "Katu",
    dosha: "Kapha · Decreases, Vata · Decreases",
    dhatu: "Rakta, Mamsa",
    importantKarma: "Kaphaghna, Varnya",
    majorDiseases:
      "Kushta, skin disorders, Kapha disorders",
    status: "Verified",
    visualColor: "#a4af96",
  },

  {
    id: "HERB_REC_0010",
    englishName: "Ativisha",
    botanicalName: "Aconitum heterophyllum",
    partUsed: "Root",
    rasa: "Katu, Tikta",
    guna: "Laghu, Ruksha",
    virya: "Ushna",
    vipaka: "Katu",
    dosha: "Kapha · Decreases",
    dhatu: "Rasa",
    importantKarma: "Deepana, Pachana",
    majorDiseases:
      "Grahani, Vishamjwara, Atisara, Kasa",
    status: "Verified",
    visualColor: "#b0b99f",
  },
]


/* =========================================
   SIMPLE SEARCH DEMO MAPPING

   Temporary frontend-only semantic mapping.
   Backend/RAG will replace this later.
   ========================================= */

const simpleSearchMappings = {
  congestion: [
    "Tulsi",
    "Yashtimadhu",
  ],

  respiratory: [
    "Tulsi",
    "Yashtimadhu",
  ],

  cough: [
    "Tulsi",
    "Yashtimadhu",
    "Ativisha",
  ],

  kasa: [
    "Tulsi",
    "Yashtimadhu",
    "Ativisha",
  ],

  shwasa: [
    "Tulsi",
    "Yashtimadhu",
  ],

  digestion: [
    "Haritaki",
    "Ativisha",
    "Guduchi",
  ],

  digestive: [
    "Haritaki",
    "Ativisha",
    "Guduchi",
  ],

  "after meals": [
    "Haritaki",
    "Ativisha",
    "Guduchi",
  ],

  energy: [
    "Ashwagandha",
    "Shatavari",
    "Yashtimadhu",
  ],

  weakness: [
    "Ashwagandha",
    "Shatavari",
    "Yashtimadhu",
  ],

  sleep: [
    "Ashwagandha",
  ],

  stress: [
    "Ashwagandha",
  ],

  skin: [
    "Neem",
    "Turmeric",
  ],

  kushta: [
    "Neem",
    "Turmeric",
  ],

  fever: [
    "Guduchi",
    "Ativisha",
  ],

  jvara: [
    "Guduchi",
    "Ativisha",
  ],
}


/* =========================================
   NORMALIZE DATA FOR HERB RESULT CARD
   ========================================= */

function prepareHerbForCard(herb, match) {
  return {
    ...herb,

    name: herb.englishName,

    scientificName: herb.botanicalName,

    match,

    tags: [
      herb.rasa,
      herb.guna,
      herb.virya,
      herb.vipaka,
      herb.importantKarma,
    ].filter(Boolean),

    description: `Part used: ${herb.partUsed}. Major indications: ${herb.majorDiseases}.`,
  }
}


/* =========================================
   CALCULATE SIMPLE SEARCH DEMO SCORE
   ========================================= */

function getSimpleSearchScore(herb, query) {
  const normalizedQuery = query.toLowerCase()

  let score = 0

  const herbName = herb.englishName.toLowerCase()
  const searchableText = [
    herb.englishName,
    herb.botanicalName,
    herb.rasa,
    herb.guna,
    herb.virya,
    herb.vipaka,
    herb.importantKarma,
    herb.majorDiseases,
    herb.partUsed,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (searchableText.includes(normalizedQuery)) {
    score += 55
  }

  Object.entries(simpleSearchMappings).forEach(
    ([keyword, herbs]) => {
      if (normalizedQuery.includes(keyword)) {
        if (herbs.includes(herb.englishName)) {
          score += 30
        }
      }
    }
  )

  if (herbName.includes(normalizedQuery)) {
    score += 20
  }

  return Math.min(score, 98)
}


/* =========================================
   CALCULATE DETAILED SEARCH SCORE
   ========================================= */

function getDetailedSearchScore(herb, selectedParameters) {
  let totalSelections = 0
  let matchedSelections = 0

  Object.entries(selectedParameters).forEach(
    ([parameter, options]) => {
      options.forEach((option) => {
        totalSelections += 1

        let herbValue = ""

        switch (parameter) {
          case "Rasa":
            herbValue = herb.rasa
            break

          case "Guna":
            herbValue = herb.guna
            break

          case "Virya":
            herbValue = herb.virya
            break

          case "Vipaka":
            herbValue = herb.vipaka
            break

          case "Dosha":
            herbValue = herb.dosha
            break

          case "Dhatu":
            herbValue = herb.dhatu
            break

          case "Karma":
            herbValue = herb.importantKarma
            break

          case "Major Diseases / Indications":
            herbValue = herb.majorDiseases
            break

          case "Mala":
          case "Srotas":
            herbValue = ""
            break

          default:
            herbValue = ""
        }

        if (
          herbValue &&
          herbValue
            .toLowerCase()
            .includes(option.toLowerCase().split(" · ")[0])
        ) {
          matchedSelections += 1
        }
      })
    }
  )

  if (totalSelections === 0) {
    return 0
  }

  const percentage =
    (matchedSelections / totalSelections) * 100

  return Math.round(percentage)
}


/* =========================================
   SEARCH RESULTS COMPONENT
   ========================================= */

function SearchResults() {
  const [searchParams] = useSearchParams()

  const query =
    searchParams.get("query")?.trim() || ""

  const mode =
    searchParams.get("mode") || "simple"

  const parametersString =
    searchParams.get("parameters") || ""


  /* =========================================
     READ DETAILED SEARCH PARAMETERS
     ========================================= */

  const selectedParameters = useMemo(() => {
    if (!parametersString) {
      return {}
    }

    try {
      return JSON.parse(
        decodeURIComponent(parametersString)
      )
    } catch (error) {
      console.error(
        "Unable to read detailed search parameters:",
        error
      )

      return {}
    }
  }, [parametersString])


  /* =========================================
     CREATE DEMO RESULTS
     ========================================= */

  const herbResults = useMemo(() => {
    let results = []

    /* -----------------------------------------
       DETAILED SEARCH
       ----------------------------------------- */

    if (mode === "detailed") {
      const hasParameters =
        Object.keys(selectedParameters).length > 0

      if (!hasParameters) {
        return []
      }

      results = herbDataset
        .map((herb) => {
          const match = getDetailedSearchScore(
            herb,
            selectedParameters
          )

          return {
            herb,
            match,
          }
        })
        .filter((item) => item.match > 0)
        .sort((a, b) => b.match - a.match)
    }

    /* -----------------------------------------
       SIMPLE SEARCH
       ----------------------------------------- */

    else {
      if (!query) {
        results = herbDataset.map((herb) => ({
          herb,
          match: 50,
        }))
      } else {
        results = herbDataset
          .map((herb) => ({
            herb,
            match: getSimpleSearchScore(
              herb,
              query
            ),
          }))
          .filter((item) => item.match > 0)
          .sort((a, b) => b.match - a.match)
      }
    }

    return results.map((item) =>
      prepareHerbForCard(
        item.herb,
        item.match
      )
    )
  }, [
    mode,
    query,
    selectedParameters,
  ])


  return (
    <div className="search-results-layout">

      <DashboardNavbar />

      <div className="search-results-body">

        <Sidebar />

        <main className="search-results-page">

          <div className="search-results-content">

            {/* =========================================
                RESULTS HEADER
                ========================================= */}

            <section className="results-header">

              <div className="results-header-left">

                <p className="results-label">
                  SEARCH RESULTS
                </p>

                <h1>
                  Ayurvedic herb profiles
                </h1>

                <p className="results-count">
                  {herbResults.length}{" "}
                  {herbResults.length === 1
                    ? "herb profile"
                    : "herb profiles"}{" "}
                  currently displayed
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


            {/* =========================================
                SEARCH INFORMATION
                ========================================= */}

            <div className="results-context">

              {mode === "simple" && query && (
                <div className="results-query">

                  <span className="context-label">
                    SEARCH
                  </span>

                  <strong>
                    "{query}"
                  </strong>

                </div>
              )}


              {mode === "detailed" && (
                <div className="results-query">

                  <span className="context-label">
                    SEARCH MODE
                  </span>

                  <strong>
                    Structured Ayurvedic parameters
                  </strong>

                </div>
              )}

              <div className="results-dataset-status">
                ✓ Structured Ayurvedic dataset
              </div>

            </div>


            {/* =========================================
                NO RESULTS
                ========================================= */}

            {herbResults.length === 0 && (

              <section className="no-search-results">

                <div className="no-results-icon">
                  ✦
                </div>

                <p className="no-results-label">
                  NO MATCHING PROFILE
                </p>

                <h2>
                  We couldn't find a close herb match
                </h2>

                <p className="no-results-description">
                  Try using a broader symptom description,
                  Ayurvedic quality, indication, or another
                  clinical parameter.
                </p>

                <div className="no-results-suggestions">

                  <span>Try:</span>

                  <button type="button">
                    digestive discomfort
                  </button>

                  <button type="button">
                    seasonal congestion
                  </button>

                  <button type="button">
                    low energy
                  </button>

                </div>

              </section>
            )}


            {/* =========================================
                HERB RESULTS
                ========================================= */}

            {herbResults.length > 0 && (

              <section className="herb-results-list">

                {herbResults.map((herb) => (

                  <HerbResultCard
                    key={herb.id}
                    herb={herb}
                  />

                ))}

              </section>

            )}

          </div>

        </main>

      </div>

    </div>
  )
}

export default SearchResults