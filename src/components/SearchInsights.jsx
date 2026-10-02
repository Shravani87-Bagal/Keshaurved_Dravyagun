import { useEffect, useMemo, useState } from "react"

import "../styles/SearchInsights.css"

function SearchInsights() {
  const [searchHistory, setSearchHistory] = useState([])

  // =========================================================
  // LOAD SEARCH HISTORY
  // =========================================================

  useEffect(() => {
    const loadSearchHistory = () => {
      const savedHistory =
        localStorage.getItem("searchHistory")

      if (!savedHistory) {
        setSearchHistory([])
        return
      }

      try {
        const parsedHistory = JSON.parse(savedHistory)

        if (Array.isArray(parsedHistory)) {
          setSearchHistory(parsedHistory)
        } else {
          setSearchHistory([])
        }
      } catch (error) {
        console.error(
          "Unable to load search history:",
          error
        )

        setSearchHistory([])
      }
    }

    loadSearchHistory()

    // Keep insights synchronized if another tab changes history
    const handleStorageChange = (event) => {
      if (event.key === "searchHistory") {
        loadSearchHistory()
      }
    }

    window.addEventListener(
      "storage",
      handleStorageChange
    )

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      )
    }
  }, [])

  // =========================================================
  // FORMAT VALUES
  // =========================================================

  const formatValue = (value) => {
    if (!value) {
      return null
    }

    if (typeof value === "string") {
      return value.trim()
    }

    if (Array.isArray(value)) {
      return value
        .filter(Boolean)
        .map((item) => String(item).trim())
        .filter(Boolean)
        .join(" + ")
    }

    if (typeof value === "object") {
      return Object.entries(value)
        .filter(
          ([, itemValue]) =>
            itemValue !== undefined &&
            itemValue !== null &&
            itemValue !== "" &&
            itemValue !== "—"
        )
        .map(
          ([key, itemValue]) =>
            `${key}: ${itemValue}`
        )
        .join(" · ")
    }

    return String(value)
  }

  // =========================================================
  // GET SEARCH VALUE
  // =========================================================

  const getSearchValue = (search) => {
    return (
      search.query ||
      search.searchQuery ||
      search.term ||
      search.value ||
      ""
    )
  }

  // =========================================================
  // GET DOSHA
  // =========================================================

  const getDosha = (search) => {
    return formatValue(
      search.dosha ||
      search.selectedDosha ||
      search.filters?.dosha
    )
  }

  // =========================================================
  // GET RASA
  // =========================================================

  const getRasa = (search) => {
    return formatValue(
      search.rasa ||
      search.selectedRasa ||
      search.filters?.rasa
    )
  }

  // =========================================================
  // GET SROTAS
  // =========================================================

  const getSrotas = (search) => {
    return formatValue(
      search.srotas ||
      search.selectedSrotas ||
      search.filters?.srotas
    )
  }

  // =========================================================
  // COUNT MOST FREQUENT VALUE
  // =========================================================

  const getMostFrequent = (values) => {
    const counts = {}

    values
      .filter(Boolean)
      .forEach((value) => {
        counts[value] =
          (counts[value] || 0) + 1
      })

    const entries = Object.entries(counts)

    if (entries.length === 0) {
      return null
    }

    entries.sort((a, b) => b[1] - a[1])

    return {
      value: entries[0][0],
      count: entries[0][1],
    }
  }

  // =========================================================
  // DOSHA INSIGHT
  // =========================================================

  const doshaInsight = useMemo(() => {
    const values = searchHistory
      .map(getDosha)
      .filter(Boolean)

    return getMostFrequent(values)
  }, [searchHistory])

  // =========================================================
  // RASA INSIGHT
  // =========================================================

  const rasaInsight = useMemo(() => {
    const values = searchHistory
      .map(getRasa)
      .filter(Boolean)

    return getMostFrequent(values)
  }, [searchHistory])

  // =========================================================
  // SROTAS INSIGHT
  // =========================================================

  const srotasInsight = useMemo(() => {
    const values = searchHistory
      .map(getSrotas)
      .filter(Boolean)

    return getMostFrequent(values)
  }, [searchHistory])

  // =========================================================
  // ZERO MATCH SEARCHES
  // =========================================================

  const zeroMatchCount = useMemo(() => {
    return searchHistory.filter((search) => {
      const match =
        search.match ??
        search.matchPercentage ??
        search.resultCount

      if (typeof match === "number") {
        return match === 0
      }

      if (
        search.zeroMatch === true ||
        search.noResults === true
      ) {
        return true
      }

      return false
    }).length
  }, [searchHistory])

  // =========================================================
  // INSIGHTS
  // =========================================================

  const insights = [
    {
      label: "MOST SEARCHED ATTRIBUTE",
      value:
        doshaInsight?.value ||
        "No data yet",
      count: doshaInsight
        ? `${doshaInsight.count} ${
            doshaInsight.count === 1
              ? "query"
              : "queries"
          }`
        : "No searches",
    },

    {
      label: "TOP RASA COMBINATION",
      value:
        rasaInsight?.value ||
        "No data yet",
      count: rasaInsight
        ? `${rasaInsight.count} ${
            rasaInsight.count === 1
              ? "search"
              : "searches"
          }`
        : "No searches",
    },

    {
      label: "ACTIVE SROTAS",
      value:
        srotasInsight?.value ||
        "No data yet",
      count: srotasInsight
        ? `${srotasInsight.count} ${
            srotasInsight.count === 1
              ? "query"
              : "queries"
          }`
        : "No searches",
    },

    {
      label: "ZERO-MATCH SEARCHES",
      value:
        zeroMatchCount > 0
          ? `${zeroMatchCount} recent`
          : "None recorded",
      count:
        zeroMatchCount > 0
          ? "Needs review"
          : "No zero-match searches",
    },
  ]

  // =========================================================
  // RECENT DOSHA COMBINATIONS
  // =========================================================

  const doshaCombinations = useMemo(() => {
    const combinations = searchHistory
      .map(getDosha)
      .filter(Boolean)

    // Remove duplicates while keeping search order
    return [...new Set(combinations)].slice(0, 5)
  }, [searchHistory])

  // =========================================================
  // EMPTY STATE
  // =========================================================

  const hasSearchData =
    searchHistory.length > 0

  return (
    <section className="search-insights">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="search-insights-header">

        <div>

          <h2>
            Search Insights
          </h2>

          <p>
            Patterns from your recent queries
          </p>

        </div>

      </div>

      <div className="search-insights-content">

        {/* ===================================================
            INSIGHTS
            =================================================== */}

        <div className="search-insights-list">

          {insights.map((insight) => (

            <div
              className="search-insight-item"
              key={insight.label}
            >

              <div className="search-insight-info">

                <span className="search-insight-label">
                  {insight.label}
                </span>

                <span className="search-insight-value">
                  {insight.value}
                </span>

              </div>

              <span className="search-insight-count">
                {insight.count}
              </span>

            </div>

          ))}

        </div>

        {/* ===================================================
            RECENT DOSHA COMBINATIONS
            =================================================== */}

        <div className="recent-dosha-combinations">

          <p>
            RECENT DOSHA COMBINATIONS
          </p>

          <div className="dosha-combination-list">

            {!hasSearchData && (

              <span className="dosha-combination">
                No search data yet
              </span>

            )}

            {doshaCombinations.map(
              (combination) => (

                <button
                  key={combination}
                  type="button"
                  className="dosha-combination"
                >
                  {combination}
                </button>

              )
            )}

          </div>

        </div>

      </div>

    </section>
  )
}

export default SearchInsights