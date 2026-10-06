import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import HerbResultCard from "../components/HerbResultCard"
import herbDataset from "../data/herbDataset"

import { addSearchHistory } from "../utils/searchHistory"

import "../styles/SearchResults.css"


/* =========================================
   SEARCH TERM MAPPING
   ========================================= */

const searchTermMappings = {
  fever: ["fever", "jwar", "jwara", "jwaraghna"],
  cough: ["cough", "kaas", "kasa", "kasahar"],
  cold: ["cold", "shwas", "shwasa", "pranavaha"],
  breathing: ["breathing", "shwas", "shwasa", "pranavaha"],
  respiratory: ["respiratory", "shwas", "shwasa", "pranavaha"],
  digestion: [
    "digestion",
    "digestive",
    "agnimandya",
    "ajeerna",
    "aruchi",
    "deepana",
    "pachana",
  ],
  digestive: [
    "digestion",
    "digestive",
    "agnimandya",
    "ajeerna",
    "aruchi",
    "deepana",
    "pachana",
  ],
  weakness: ["weakness", "daurbalya", "balya", "rasayana"],
  skin: ["skin", "kushta", "kustha", "kandughna", "kushtaghna"],
  itching: ["itching", "kandu", "kandughna"],
  worms: ["worms", "krimi", "krimirog", "krimighna"],
  inflammation: ["inflammation", "shotha", "shothahara"],
  urine: ["urine", "mutra", "mutrala", "mutravaha"],
  feverish: ["feverish", "jwar", "jwara", "jwaraghna"],
  stress: ["stress", "medhya", "rasayana"],
  energy: ["energy", "balya", "rasayana", "daurbalya"],
}


/* =========================================
   PREPARE HERB FOR RESULT CARD
   ========================================= */

function prepareHerbForCard(herb, match) {
  return {
    ...herb,

    name: herb.englishName,
    scientificName: herb.botanicalName,

    match,

    status: herb.verificationStatus,

    description: `Part used: ${
      herb.partUsed || "Not specified"
    }. Indications: ${
      Array.isArray(herb.indications)
        ? herb.indications.join(", ")
        : herb.indications || "Not specified"
    }.`,
  }
}


/* =========================================
   GET ALL SEARCHABLE HERB DATA
   ========================================= */

function getSearchableValues(herb) {
  const values = []

  values.push(
    herb.englishName,
    herb.botanicalName,
    herb.partUsed,
    herb.prabhava
  )

  if (Array.isArray(herb.regionalNames)) {
    values.push(...herb.regionalNames)
  }

  if (Array.isArray(herb.rasa)) {
    values.push(...herb.rasa)
  }

  if (Array.isArray(herb.guna)) {
    values.push(...herb.guna)
  }

  values.push(herb.virya)
  values.push(herb.vipaka)

  if (
    herb.dosha &&
    typeof herb.dosha === "object"
  ) {
    Object.entries(herb.dosha).forEach(
      ([dosha, action]) => {
        if (action) {
          values.push(dosha)
          values.push(action)
          values.push(`${dosha} ${action}`)
        }
      }
    )
  }

  if (Array.isArray(herb.dhatu)) {
    values.push(...herb.dhatu)
  }

  if (Array.isArray(herb.mala)) {
    values.push(...herb.mala)
  }

  if (Array.isArray(herb.srotas)) {
    values.push(...herb.srotas)
  }

  if (Array.isArray(herb.avayava)) {
    values.push(...herb.avayava)
  }

  if (Array.isArray(herb.karma)) {
    values.push(...herb.karma)
  }

  if (Array.isArray(herb.indications)) {
    values.push(...herb.indications)
  }

  return values
    .filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== ""
    )
    .map((value) =>
      String(value).toLowerCase().trim()
    )
}


/* =========================================
   NORMALIZE SEARCH QUERY
   ========================================= */

function normalizeQuery(query) {
  return query
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ")
}


/* =========================================
   GET SEARCH TERMS
   ========================================= */

function getSearchTerms(query) {
  const normalizedQuery = normalizeQuery(query)

  const terms = new Set()

  terms.add(normalizedQuery)

  normalizedQuery
    .split(" ")
    .filter(Boolean)
    .forEach((word) => {
      terms.add(word)
    })

  Object.entries(searchTermMappings).forEach(
    ([keyword, mappedTerms]) => {
      if (normalizedQuery.includes(keyword)) {
        mappedTerms.forEach((term) => {
          terms.add(term.toLowerCase())
        })
      }
    }
  )

  return [...terms]
}


/* =========================================
   SIMPLE SEARCH SCORE
   ========================================= */

function getSimpleSearchScore(herb, query) {
  const normalizedQuery = normalizeQuery(query)

  if (!normalizedQuery) {
    return 0
  }

  const searchableValues =
    getSearchableValues(herb)

  const searchableText =
    searchableValues.join(" ")

  const searchTerms =
    getSearchTerms(normalizedQuery)

  let score = 0

  const herbName =
    String(
      herb.englishName || ""
    ).toLowerCase()

  if (herbName === normalizedQuery) {
    score += 100
  }

  const botanicalName =
    String(
      herb.botanicalName || ""
    ).toLowerCase()

  if (botanicalName === normalizedQuery) {
    score += 95
  }

  const regionalNames =
    Array.isArray(herb.regionalNames)
      ? herb.regionalNames.map((name) =>
          String(name).toLowerCase()
        )
      : []

  if (
    regionalNames.some(
      (name) => name === normalizedQuery
    )
  ) {
    score += 95
  }

  if (
    searchableText.includes(normalizedQuery)
  ) {
    score += 60
  }

  searchTerms.forEach((term) => {
    if (!term) {
      return
    }

    if (
      searchableValues.some(
        (value) => value === term
      )
    ) {
      score += 35
      return
    }

    if (
      searchableValues.some(
        (value) => value.includes(term)
      )
    ) {
      score += 20
      return
    }

    if (
      searchableText.includes(term)
    ) {
      score += 10
    }
  })

  if (Array.isArray(herb.indications)) {
    herb.indications.forEach(
      (indication) => {
        const normalizedIndication =
          String(indication).toLowerCase()

        searchTerms.forEach(
          (term) => {
            if (
              normalizedIndication.includes(term)
            ) {
              score += 25
            }
          }
        )
      }
    )
  }

  if (Array.isArray(herb.karma)) {
    herb.karma.forEach(
      (karma) => {
        const normalizedKarma =
          String(karma).toLowerCase()

        searchTerms.forEach(
          (term) => {
            if (
              normalizedKarma.includes(term)
            ) {
              score += 15
            }
          }
        )
      }
    )
  }

  return Math.min(score, 98)
}


/* =========================================
   DETAILED SEARCH SCORE
   ========================================= */

function getDetailedSearchScore(
  herb,
  selectedParameters
) {
  let totalSelections = 0
  let matchedSelections = 0

  Object.entries(
    selectedParameters
  ).forEach(
    ([parameter, options]) => {
      options.forEach((option) => {
        totalSelections += 1

        let herbValues = []

        switch (parameter) {
          case "Rasa":
            herbValues =
              Array.isArray(herb.rasa)
                ? herb.rasa
                : []
            break

          case "Guna":
            herbValues =
              Array.isArray(herb.guna)
                ? herb.guna
                : []
            break

          case "Virya":
            herbValues =
              herb.virya
                ? [herb.virya]
                : []
            break

          case "Vipaka":
            herbValues =
              herb.vipaka
                ? [herb.vipaka]
                : []
            break

          case "Dosha":
            if (
              herb.dosha &&
              typeof herb.dosha === "object"
            ) {
              Object.entries(
                herb.dosha
              ).forEach(
                ([dosha, action]) => {
                  if (action) {
                    herbValues.push(
                      `${dosha} · ${action}`
                    )
                  }
                }
              )
            }
            break

          case "Dhatu":
            herbValues =
              Array.isArray(herb.dhatu)
                ? herb.dhatu
                : []
            break

          case "Mala":
            herbValues =
              Array.isArray(herb.mala)
                ? herb.mala
                : []
            break

          case "Srotas":
            herbValues =
              Array.isArray(herb.srotas)
                ? herb.srotas
                : []
            break

          case "Karma":
            herbValues =
              Array.isArray(herb.karma)
                ? herb.karma
                : []
            break

          case "Major Diseases / Indications":
            herbValues =
              Array.isArray(herb.indications)
                ? herb.indications
                : []
            break

          default:
            herbValues = []
        }

        const normalizedOption =
          String(option)
            .toLowerCase()
            .trim()

        const matched =
          herbValues.some(
            (value) =>
              String(value)
                .toLowerCase()
                .includes(normalizedOption)
          )

        if (matched) {
          matchedSelections += 1
        }
      })
    }
  )

  if (totalSelections === 0) {
    return 0
  }

  return Math.round(
    (matchedSelections /
      totalSelections) *
      100
  )
}


/* =========================================
   FILTER HELPERS
   ========================================= */

function getUniqueValues(field) {
  const values = new Set()

  herbDataset.forEach((herb) => {
    const fieldValue = herb[field]

    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((value) => {
        if (value) {
          values.add(String(value))
        }
      })
    } else if (
      fieldValue !== null &&
      fieldValue !== undefined &&
      fieldValue !== ""
    ) {
      values.add(String(fieldValue))
    }
  })

  return [...values].sort()
}


function getDoshaValues() {
  const values = new Set()

  herbDataset.forEach((herb) => {
    if (
      herb.dosha &&
      typeof herb.dosha === "object"
    ) {
      Object.keys(herb.dosha).forEach(
        (dosha) => {
          values.add(dosha)
        }
      )
    }
  })

  return [...values].sort()
}


/* =========================================
   CHECK FILTER
   ========================================= */

function herbMatchesFilter(
  herb,
  filterType,
  selectedValue
) {
  if (!selectedValue) {
    return true
  }

  if (filterType === "status") {
    return (
      String(
        herb.verificationStatus || ""
      ).toLowerCase() ===
      selectedValue.toLowerCase()
    )
  }

  if (filterType === "virya") {
    return (
      String(
        herb.virya || ""
      ).toLowerCase() ===
      selectedValue.toLowerCase()
    )
  }

  if (filterType === "rasa") {
    return (
      Array.isArray(herb.rasa) &&
      herb.rasa.some(
        (value) =>
          String(value).toLowerCase() ===
          selectedValue.toLowerCase()
      )
    )
  }

  if (filterType === "guna") {
    return (
      Array.isArray(herb.guna) &&
      herb.guna.some(
        (value) =>
          String(value).toLowerCase() ===
          selectedValue.toLowerCase()
      )
    )
  }

  if (filterType === "dosha") {
    if (
      !herb.dosha ||
      typeof herb.dosha !== "object"
    ) {
      return false
    }

    return Object.keys(herb.dosha)
      .map((value) => value.toLowerCase())
      .includes(
        selectedValue.toLowerCase()
      )
  }

  return true
}


/* =========================================
   SEARCH RESULTS COMPONENT
   ========================================= */

function SearchResults() {
  const [searchParams, setSearchParams] =
    useSearchParams()

  const query =
    searchParams
      .get("query")
      ?.trim() || ""

  const mode =
    searchParams.get("mode") ||
    "simple"

  const parametersString =
    searchParams.get("parameters") || ""

  const [showFilters, setShowFilters] =
    useState(false)

  const [showSort, setShowSort] =
    useState(false)

  const [sortOption, setSortOption] =
    useState("best")

  const [filters, setFilters] =
    useState({
      status: "",
      virya: "",
      rasa: "",
      guna: "",
      dosha: "",
    })

    const savedSettings = JSON.parse(
      localStorage.getItem("herbSettings") || "null"
    )
    
    const resultsPerPage = Number(
      savedSettings?.resultsPerPage || 20
    )


  /* =========================================
     READ DETAILED SEARCH PARAMETERS
     ========================================= */

  const selectedParameters =
    useMemo(() => {
      if (!parametersString) {
        return {}
      }

      try {
        return JSON.parse(
          decodeURIComponent(
            parametersString
          )
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
     CREATE BASE RESULTS
     ========================================= */

  const baseResults =
    useMemo(() => {
      let results = []

      if (mode === "detailed") {
        const hasParameters =
          Object.keys(
            selectedParameters
          ).length > 0

        if (!hasParameters) {
          return []
        }

        results =
          herbDataset
            .map((herb) => {
              const match =
                getDetailedSearchScore(
                  herb,
                  selectedParameters
                )

              return {
                herb,
                match,
              }
            })
            .filter(
              (item) =>
                item.match > 0
            )
            .sort(
              (a, b) =>
                b.match - a.match
            )
      } else {
        if (!query) {
          results =
            herbDataset.map(
              (herb) => ({
                herb,
                match: 50,
              })
            )
        } else {
          results =
            herbDataset
              .map((herb) => {
                const match =
                  getSimpleSearchScore(
                    herb,
                    query
                  )

                return {
                  herb,
                  match,
                }
              })
              .filter(
                (item) =>
                  item.match > 0
              )
              .sort(
                (a, b) =>
                  b.match - a.match
              )
        }
      }

      return results.map(
        (item) =>
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


  /* =========================================
     APPLY FILTERS + SORT
     ========================================= */

  const herbResults =
    useMemo(() => {
      let results =
        [...baseResults]

      Object.entries(filters).forEach(
        ([filterType, selectedValue]) => {
          if (!selectedValue) {
            return
          }

          results =
            results.filter(
              (herb) =>
                herbMatchesFilter(
                  herb,
                  filterType,
                  selectedValue
                )
            )
        }
      )

      if (sortOption === "best") {
        results.sort(
          (a, b) =>
            (b.match || 0) -
            (a.match || 0)
        )
      }

      if (sortOption === "nameAsc") {
        results.sort((a, b) =>
          String(a.englishName || "")
            .localeCompare(
              String(b.englishName || "")
            )
        )
      }

      if (sortOption === "nameDesc") {
        results.sort((a, b) =>
          String(b.englishName || "")
            .localeCompare(
              String(a.englishName || "")
            )
        )
      }

      return results.slice(0, resultsPerPage)
    }, [
      baseResults,
      filters,
      sortOption,
    ])

    // =========================================
// RECORD SEARCH HISTORY
// =========================================

useEffect(() => {

  if (
    !query &&
    mode !== "detailed"
  ) {
    return
  }

  const averageMatch =
    herbResults.length > 0
      ? Math.round(
          herbResults.reduce(
            (total, herb) =>
              total + (herb.match || 0),
            0
          ) / herbResults.length
        )
      : 0

  const topResults =
    herbResults
      .slice(0, 5)
      .map(
        (herb) =>
          herb.englishName
      )

  addSearchHistory({

    mode,

    query,

    parameters:
      selectedParameters,

    resultCount:
      herbResults.length,

    averageMatch,

    topResults

  })

}, [
  mode,
  query,
  selectedParameters
])


  /* =========================================
     FILTER OPTIONS
     ========================================= */

  const filterOptions = {
    status: getUniqueValues(
      "verificationStatus"
    ),

    virya: getUniqueValues(
      "virya"
    ),

    rasa: getUniqueValues(
      "rasa"
    ),

    guna: getUniqueValues(
      "guna"
    ),

    dosha: getDoshaValues(),
  }


  /* =========================================
     HANDLERS
     ========================================= */

  const updateFilter = (
    filterType,
    value
  ) => {
    setFilters((previous) => ({
      ...previous,
      [filterType]: value,
    }))
  }


  const clearFilters = () => {
    setFilters({
      status: "",
      virya: "",
      rasa: "",
      guna: "",
      dosha: "",
    })
  }


  const handleSort = (option) => {
    setSortOption(option)
    setShowSort(false)
  }


  const handleSuggestion = (
    suggestion
  ) => {
    setSearchParams({
      query: suggestion,
      mode: "simple",
    })
  }


  const activeFilterCount =
    Object.values(filters).filter(
      Boolean
    ).length


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

                {/* FILTER BUTTON */}

                <div className="results-control-wrapper">

                  <button
                    className={`results-filter-button ${
                      showFilters
                        ? "control-active"
                        : ""
                    }`}
                    type="button"
                    onClick={() => {
                      setShowFilters(
                        !showFilters
                      )
                      setShowSort(false)
                    }}
                  >
                    <span>☷</span>
                    Filters

                    {activeFilterCount >
                      0 && (
                      <b>
                        {activeFilterCount}
                      </b>
                    )}
                  </button>


                  {showFilters && (
                    <div className="results-filter-panel">

                      <div className="filter-panel-header">

                        <strong>
                          Filter results
                        </strong>

                        <button
                          type="button"
                          onClick={
                            clearFilters
                          }
                        >
                          Clear
                        </button>

                      </div>


                      <label>
                        Verification status

                        <select
                          value={
                            filters.status
                          }
                          onChange={(event) =>
                            updateFilter(
                              "status",
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            All statuses
                          </option>

                          {filterOptions.status.map(
                            (value) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </label>


                      <label>
                        Virya

                        <select
                          value={
                            filters.virya
                          }
                          onChange={(event) =>
                            updateFilter(
                              "virya",
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            All Virya
                          </option>

                          {filterOptions.virya.map(
                            (value) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </label>


                      <label>
                        Rasa

                        <select
                          value={
                            filters.rasa
                          }
                          onChange={(event) =>
                            updateFilter(
                              "rasa",
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            All Rasa
                          </option>

                          {filterOptions.rasa.map(
                            (value) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </label>


                      <label>
                        Guna

                        <select
                          value={
                            filters.guna
                          }
                          onChange={(event) =>
                            updateFilter(
                              "guna",
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            All Guna
                          </option>

                          {filterOptions.guna.map(
                            (value) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </label>


                      <label>
                        Dosha

                        <select
                          value={
                            filters.dosha
                          }
                          onChange={(event) =>
                            updateFilter(
                              "dosha",
                              event.target.value
                            )
                          }
                        >
                          <option value="">
                            All Dosha
                          </option>

                          {filterOptions.dosha.map(
                            (value) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </label>

                    </div>
                  )}

                </div>


                {/* SORT BUTTON */}

                <div className="results-control-wrapper">

                  <button
                    className={`results-sort-button ${
                      showSort
                        ? "control-active"
                        : ""
                    }`}
                    type="button"
                    onClick={() => {
                      setShowSort(
                        !showSort
                      )
                      setShowFilters(false)
                    }}
                  >
                    {sortOption === "best"
                      ? "Best match"
                      : sortOption ===
                        "nameAsc"
                      ? "Name A–Z"
                      : "Name Z–A"}

                    <span>⌄</span>
                  </button>


                  {showSort && (
                    <div className="results-sort-menu">

                      <button
                        type="button"
                        className={
                          sortOption ===
                          "best"
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          handleSort(
                            "best"
                          )
                        }
                      >
                        Best match
                      </button>

                      <button
                        type="button"
                        className={
                          sortOption ===
                          "nameAsc"
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          handleSort(
                            "nameAsc"
                          )
                        }
                      >
                        Name A–Z
                      </button>

                      <button
                        type="button"
                        className={
                          sortOption ===
                          "nameDesc"
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          handleSort(
                            "nameDesc"
                          )
                        }
                      >
                        Name Z–A
                      </button>

                    </div>
                  )}

                </div>

              </div>

            </section>


            {/* =========================================
                SEARCH INFORMATION
                ========================================= */}

            <div className="results-context">

              {mode === "simple" &&
                query && (

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
                ACTIVE FILTERS
                ========================================= */}

            {activeFilterCount > 0 && (

              <div className="active-filter-bar">

                <span>
                  Active filters:
                </span>

                {Object.entries(filters)
                  .filter(
                    ([, value]) => value
                  )
                  .map(
                    ([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          updateFilter(
                            key,
                            ""
                          )
                        }
                      >
                        {key}: {value} ×
                      </button>
                    )
                  )}

              </div>

            )}


            {/* =========================================
                NO SEARCH RESULTS
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
                  Try using a broader symptom
                  description, Ayurvedic quality,
                  indication, or another clinical
                  parameter.
                </p>

                <div className="no-results-suggestions">

                  <span>
                    Try:
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestion(
                        "digestive discomfort"
                      )
                    }
                  >
                    digestive discomfort
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestion(
                        "seasonal congestion"
                      )
                    }
                  >
                    seasonal congestion
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestion(
                        "low energy"
                      )
                    }
                  >
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

                {herbResults.map(
                  (herb) => (
                    <HerbResultCard
                      key={herb.id}
                      herb={herb}
                    />
                  )
                )}

              </section>

            )}

          </div>

        </main>

      </div>

    </div>
  )
}


export default SearchResults