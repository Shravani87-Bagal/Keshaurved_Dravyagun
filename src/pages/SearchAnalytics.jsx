import { useMemo, useState } from "react"

import { getSearchHistory } from "../utils/searchHistory"

import "../styles/SearchAnalytics.css"


/* =========================================
   HELPERS
   ========================================= */

function formatSearchLabel(search) {
  if (search.mode === "detailed") {
    const parameterGroups =
      Object.entries(search.parameters || {})

    const selectedOptions =
      parameterGroups.flatMap(
        ([parameter, options]) =>
          options.map(
            (option) =>
              `${parameter}: ${option}`
          )
      )

    if (selectedOptions.length === 0) {
      return "Structured parameter search"
    }

    return selectedOptions.join(" · ")
  }

  return search.query || "Empty search"
}


function getSearchDisplayName(search) {
  if (search.mode === "detailed") {
    return "Structured parameter search"
  }

  return search.query || "Empty search"
}


function getSearchType(search) {
  return search.mode === "detailed"
    ? "Detailed"
    : "Simple"
}


function getMonthKey(date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`
}


/* =========================================
   SEARCH ANALYTICS
   ========================================= */

function SearchAnalytics() {

  const [selectedRange, setSelectedRange] =
    useState("30 days")


  /* =========================================
     READ SEARCH HISTORY
     ========================================= */

  const searchHistory = getSearchHistory()


  /* =========================================
     DATE RANGE
     ========================================= */

  const filteredHistory = useMemo(() => {

    const now = new Date()

    let days = 30

    if (selectedRange === "7 days") {
      days = 7
    }

    if (selectedRange === "30 days") {
      days = 30
    }

    if (selectedRange === "90 days") {
      days = 90
    }

    const startDate =
      new Date(now)

    startDate.setDate(
      startDate.getDate() - days
    )

    return searchHistory.filter(
      (search) => {

        if (!search.timestamp) {
          return false
        }

        const searchDate =
          new Date(search.timestamp)

        return searchDate >= startDate
      }
    )

  }, [
    searchHistory,
    selectedRange,
  ])


  /* =========================================
     OVERVIEW STATISTICS
     ========================================= */

  const totalSearches =
    filteredHistory.length


  const searchesThisMonth =
    searchHistory.filter(
      (search) => {

        if (!search.timestamp) {
          return false
        }

        const searchDate =
          new Date(search.timestamp)

        const now = new Date()

        return (
          searchDate.getMonth() ===
            now.getMonth() &&
          searchDate.getFullYear() ===
            now.getFullYear()
        )
      }
    ).length


  const averageMatch =
    filteredHistory.length > 0
      ? Math.round(
          filteredHistory.reduce(
            (total, search) =>
              total +
              Number(
                search.averageMatch || 0
              ),
            0
          ) /
            filteredHistory.length
        )
      : 0


  const zeroMatchSearches =
    filteredHistory.filter(
      (search) =>
        search.zeroMatch
    ).length


  const weakMatchSearches =
    filteredHistory.filter(
      (search) =>
        search.weakMatch
    ).length


  /* =========================================
     FREQUENT SEARCHES
     ========================================= */

  const frequentSearches =
    useMemo(() => {

      const searchMap = new Map()

      filteredHistory.forEach(
        (search) => {

          const key =
            search.mode === "detailed"
              ? JSON.stringify(
                  search.parameters || {}
                )
              : search.query
                  ?.trim()
                  .toLowerCase()

          if (!key) {
            return
          }

          if (!searchMap.has(key)) {
            searchMap.set(
              key,
              {
                label:
                  getSearchDisplayName(
                    search
                  ),

                display:
                  formatSearchLabel(
                    search
                  ),

                type:
                  getSearchType(
                    search
                  ),

                count: 0,

                totalMatch: 0,

                resultCount: 0,
              }
            )
          }

          const current =
            searchMap.get(key)

          current.count += 1

          current.totalMatch +=
            Number(
              search.averageMatch ||
                0
            )

          current.resultCount +=
            Number(
              search.resultCount ||
                0
            )
        }
      )

      return [...searchMap.values()]
        .map((item) => ({
          ...item,

          averageMatch:
            item.count > 0
              ? Math.round(
                  item.totalMatch /
                    item.count
                )
              : 0,

          averageResults:
            item.count > 0
              ? Math.round(
                  item.resultCount /
                    item.count
                )
              : 0,
        }))
        .sort(
          (a, b) =>
            b.count - a.count
        )
        .slice(0, 5)

    }, [
      filteredHistory,
    ])


  /* =========================================
     WEAK SEARCHES
     ========================================= */

  const weakSearches =
    useMemo(() => {

      return filteredHistory
        .filter(
          (search) =>
            search.weakMatch ||
            search.zeroMatch
        )
        .sort(
          (a, b) =>
            Number(
              a.averageMatch || 0
            ) -
            Number(
              b.averageMatch || 0
            )
        )
        .slice(0, 5)

    }, [
      filteredHistory,
    ])


  /* =========================================
     TOP RESULTS
     ========================================= */

  const topResults =
    useMemo(() => {

      const resultMap =
        new Map()

      filteredHistory.forEach(
        (search) => {

          if (
            !Array.isArray(
              search.topResults
            )
          ) {
            return
          }

          search.topResults.forEach(
            (herbName) => {

              if (!herbName) {
                return
              }

              const current =
                resultMap.get(
                  herbName
                ) || 0

              resultMap.set(
                herbName,
                current + 1
              )
            }
          )
        }
      )

      return [...resultMap.entries()]
        .map(
          ([name, count]) => ({
            name,
            count,
          })
        )
        .sort(
          (a, b) =>
            b.count - a.count
        )
        .slice(0, 5)

    }, [
      filteredHistory,
    ])


  /* =========================================
     SEARCH MODE BREAKDOWN
     ========================================= */

  const simpleSearches =
    filteredHistory.filter(
      (search) =>
        search.mode === "simple"
    ).length


  const detailedSearches =
    filteredHistory.filter(
      (search) =>
        search.mode === "detailed"
    ).length


  /* =========================================
     MONTHLY TREND
     ========================================= */

  const searchTrend =
    useMemo(() => {

      const monthMap =
        new Map()

      filteredHistory.forEach(
        (search) => {

          if (!search.timestamp) {
            return
          }

          const date =
            new Date(
              search.timestamp
            )

          const key =
            getMonthKey(date)

          const label =
            date.toLocaleDateString(
              "en-US",
              {
                month: "short",
              }
            )

          if (!monthMap.has(key)) {
            monthMap.set(
              key,
              {
                key,
                label,
                count: 0,
              }
            )
          }

          monthMap.get(
            key
          ).count += 1
        }
      )

      return [...monthMap.values()]
        .sort(
          (a, b) =>
            a.key.localeCompare(
              b.key
            )
        )

    }, [
      filteredHistory,
    ])


  /* =========================================
     RENDER
     ========================================= */

  return (
    <div className="analytics-page">

      <div className="analytics-content">


        {/* =========================================
            HEADER
           ========================================= */}

        <section className="analytics-header">

          <div>

            <p className="analytics-label">
              SEARCH ANALYTICS
            </p>

            <h1>
              Understand how the herb
              intelligence engine is being used
            </h1>

            <p className="analytics-description">
              Review search behaviour,
              matching quality, and areas
              where the knowledge base may
              need improvement.
            </p>

          </div>


          <div className="analytics-range">

            <button
              type="button"
              className={
                selectedRange === "7 days"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedRange(
                  "7 days"
                )
              }
            >
              7 days
            </button>

            <button
              type="button"
              className={
                selectedRange === "30 days"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedRange(
                  "30 days"
                )
              }
            >
              30 days
            </button>

            <button
              type="button"
              className={
                selectedRange === "90 days"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedRange(
                  "90 days"
                )
              }
            >
              90 days
            </button>

          </div>

        </section>


        {/* =========================================
            OVERVIEW CARDS
           ========================================= */}

        <section className="analytics-overview-grid">

          <article className="analytics-stat-card">

            <strong>
              {totalSearches}
            </strong>

            <span>
              Total Searches
            </span>

            <p>
              Searches in selected period
            </p>

          </article>


          <article className="analytics-stat-card">

            <strong>
              {searchesThisMonth}
            </strong>

            <span>
              Searches This Month
            </span>

            <p>
              Current calendar month
            </p>

          </article>


          <article className="analytics-stat-card">

            <strong>
              {averageMatch}%
            </strong>

            <span>
              Average Match Score
            </span>

            <p>
              Across recorded searches
            </p>

          </article>


          <article className="analytics-stat-card">

            <strong>
              {zeroMatchSearches}
            </strong>

            <span>
              Zero-Match Searches
            </span>

            <p>
              Searches with no results
            </p>

          </article>


          <article className="analytics-stat-card">

            <strong>
              {weakMatchSearches}
            </strong>

            <span>
              Weak-Match Searches
            </span>

            <p>
              Average match below 40%
            </p>

          </article>

        </section>


        {/* =========================================
            SEARCH SUMMARY
           ========================================= */}

        <section className="analytics-summary-grid">

          <article className="analytics-panel">

            <div className="analytics-panel-header">

              <div>

                <p className="analytics-panel-label">
                  SEARCH MODES
                </p>

                <h2>
                  How searches are performed
                </h2>

              </div>

            </div>


            <div className="analytics-mode-row">

              <span>
                Simple Search
              </span>

              <strong>
                {simpleSearches}
              </strong>

            </div>


            <div className="analytics-mode-row">

              <span>
                Detailed Search
              </span>

              <strong>
                {detailedSearches}
              </strong>

            </div>


            <div className="analytics-mode-total">

              <span>
                Total
              </span>

              <strong>
                {totalSearches}
              </strong>

            </div>

          </article>


          <article className="analytics-panel">

            <div className="analytics-panel-header">

              <div>

                <p className="analytics-panel-label">
                  SEARCH QUALITY
                </p>

                <h2>
                  Matching quality overview
                </h2>

              </div>

            </div>


            <div className="analytics-quality-row">

              <span>
                Strong matches
              </span>

              <strong>
                {Math.max(
                  totalSearches -
                    zeroMatchSearches -
                    weakMatchSearches,
                  0
                )}
              </strong>

            </div>


            <div className="analytics-quality-row">

              <span>
                Weak matches
              </span>

              <strong>
                {weakMatchSearches}
              </strong>

            </div>


            <div className="analytics-quality-row">

              <span>
                No matches
              </span>

              <strong>
                {zeroMatchSearches}
              </strong>

            </div>

          </article>

        </section>


        {/* =========================================
            MOST FREQUENT SEARCHES
           ========================================= */}

        <section className="analytics-section">

          <div className="analytics-section-header">

            <div>

              <p className="analytics-panel-label">
                SEARCH DEMAND
              </p>

              <h2>
                Most frequent searches
              </h2>

              <p>
                Queries and parameter combinations
                users search most often.
              </p>

            </div>

          </div>


          {frequentSearches.length === 0 ? (

            <div className="analytics-empty-state">

              No search history available yet.

            </div>

          ) : (

            <div className="analytics-table-wrapper">

              <table className="analytics-table">

                <thead>

                  <tr>

                    <th>
                      Search
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Searches
                    </th>

                    <th>
                      Avg. Match
                    </th>

                    <th>
                      Avg. Results
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {frequentSearches.map(
                    (search, index) => (

                      <tr
                        key={`${search.label}-${index}`}
                      >

                        <td>

                          <strong>
                            {search.label}
                          </strong>

                          {search.type ===
                            "Detailed" && (

                            <small>
                              {search.display}
                            </small>

                          )}

                        </td>

                        <td>
                          {search.type}
                        </td>

                        <td>
                          {search.count}
                        </td>

                        <td>
                          {search.averageMatch}%
                        </td>

                        <td>
                          {search.averageResults}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* =========================================
            WEAK SEARCHES
           ========================================= */}

        <section className="analytics-section">

          <div className="analytics-section-header">

            <div>

              <p className="analytics-panel-label">
                KNOWLEDGE GAPS
              </p>

              <h2>
                Weak and zero-match searches
              </h2>

              <p>
                Searches that may indicate
                missing or insufficient herb
                knowledge.
              </p>

            </div>

          </div>


          {weakSearches.length === 0 ? (

            <div className="analytics-empty-state">

              No weak or zero-match searches
              recorded in this period.

            </div>

          ) : (

            <div className="analytics-table-wrapper">

              <table className="analytics-table">

                <thead>

                  <tr>

                    <th>
                      Search
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Results
                    </th>

                    <th>
                      Match
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {weakSearches.map(
                    (search, index) => (

                      <tr
                        key={`${search.id}-${index}`}
                      >

                        <td>

                          <strong>
                            {getSearchDisplayName(
                              search
                            )}
                          </strong>

                          {search.mode ===
                            "detailed" && (

                            <small>
                              {formatSearchLabel(
                                search
                              )}
                            </small>

                          )}

                        </td>

                        <td>
                          {getSearchType(
                            search
                          )}
                        </td>

                        <td>
                          {search.resultCount}
                        </td>

                        <td>
                          {search.averageMatch}%
                        </td>

                        <td>

                          {search.zeroMatch ? (
                            <span className="analytics-status zero">
                              No match
                            </span>
                          ) : (
                            <span className="analytics-status weak">
                              Weak match
                            </span>
                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* =========================================
            TOP RESULT PROFILES
           ========================================= */}

        <section className="analytics-section">

          <div className="analytics-section-header">

            <div>

              <p className="analytics-panel-label">
                RESULT DEMAND
              </p>

              <h2>
                Frequently surfaced herbs
              </h2>

              <p>
                Herb profiles appearing most often
                among recorded search results.
              </p>

            </div>

          </div>


          {topResults.length === 0 ? (

            <div className="analytics-empty-state">

              No result profiles available yet.

            </div>

          ) : (

            <div className="analytics-result-list">

              {topResults.map(
                (result, index) => (

                  <div
                    className="analytics-result-row"
                    key={result.name}
                  >

                    <span className="analytics-rank">
                      {index + 1}
                    </span>

                    <strong>
                      {result.name}
                    </strong>

                    <span>
                      surfaced{" "}
                      {result.count}{" "}
                      {result.count === 1
                        ? "time"
                        : "times"}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* =========================================
            SEARCH TREND
           ========================================= */}

        <section className="analytics-section">

          <div className="analytics-section-header">

            <div>

              <p className="analytics-panel-label">
                SEARCH ACTIVITY
              </p>

              <h2>
                Search trend
              </h2>

              <p>
                Recorded searches by month.
              </p>

            </div>

          </div>


          {searchTrend.length === 0 ? (

            <div className="analytics-empty-state">

              Search activity will appear here
              after searches are recorded.

            </div>

          ) : (

            <div className="analytics-trend-list">

              {searchTrend.map(
                (month) => (

                  <div
                    className="analytics-trend-row"
                    key={month.key}
                  >

                    <span>
                      {month.label}
                    </span>

                    <div className="analytics-trend-bar">

                      <div
                        className="analytics-trend-fill"
                        style={{
                          width: `${Math.min(
                            month.count * 10,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    <strong>
                      {month.count}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </section>


      </div>

    </div>
  )
}


export default SearchAnalytics