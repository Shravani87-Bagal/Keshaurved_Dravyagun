import { useState } from "react"
import "../styles/SearchAnalytics.css"

function SearchAnalytics() {

  const [selectedRange, setSelectedRange] = useState("30 days")

  const searchRanges = [
    "7 days",
    "30 days",
    "3 months",
    "Custom"
  ]

  const frequentSearches = [
    {
      query: "Digestive disorders with Vata...",
      parameters: "Rasa, Dosha, Karma",
      count: 124,
      match: 72
    },
    {
      query: "Skin inflammation — Pitta do...",
      parameters: "Dosha, Guna, Virya",
      count: 98,
      match: 68
    },
    {
      query: "Respiratory Kapha conditions",
      parameters: "Dosha, Srotas, Karma",
      count: 76,
      match: 74
    },
    {
      query: "Rasayana herbs for vitality",
      parameters: "Karma, Dhatu, Guna",
      count: 63,
      match: 81
    },
    {
      query: "Fever management Tikta Kar...",
      parameters: "Rasa, Virya, Karma",
      count: 41,
      match: 54
    },
    {
      query: "Medhya — cognitive support",
      parameters: "Karma, Dhatu, Srotas",
      count: 38,
      match: 77
    }
  ]

  const weakSearches = [
    {
      query: "Autoimmune inflammat...",
      parameters: "Dosha, Karma",
      count: 29,
      match: 31
    },
    {
      query: "Neuroprotective Vata di...",
      parameters: "Dhatu, Karma",
      count: 22,
      match: 28
    },
    {
      query: "Hormonal Kapha-Pitta i...",
      parameters: "Dosha, Dhatu",
      count: 19,
      match: 33
    },
    {
      query: "Post-viral fatigue Ojas d...",
      parameters: "Karma, Dhatu",
      count: 17,
      match: 24
    }
  ]

  const rarelyTopResults = [
    {
      herb: "Manjistha",
      appearances: 3,
      topTen: 1,
      lastSeen: "2 weeks ago",
      status: "Verified"
    },
    {
      herb: "Vidari Kanda",
      appearances: 5,
      topTen: 2,
      lastSeen: "3 weeks ago",
      status: "Reviewed"
    },
    {
      herb: "Prishniparni",
      appearances: 2,
      topTen: 0,
      lastSeen: "1 month ago",
      status: "Draft"
    },
    {
      herb: "Kantakari",
      appearances: 4,
      topTen: 1,
      lastSeen: "3 weeks ago",
      status: "Verified"
    }
  ]

  const insights = [
    {
      icon: "⌕",
      text: "12 recurring searches return weak matches (below 40%).",
      action: "Review parameters →"
    },
    {
      icon: "⚖",
      text: "8 Ayurvedic parameters are frequently used but have limited herb coverage.",
      action: "Expand coverage →"
    },
    {
      icon: "🌿",
      text: "24 herbs have not appeared in top results in the past 30 days.",
      action: "Check scoring →"
    },
    {
      icon: "▥",
      text: "Srotas affinity missing in 34 verified herbs, reducing recall.",
      action: "Complete data →"
    }
  ]

  return (
    <div className="search-analytics-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="search-analytics-header">

        <div>

          <p className="search-analytics-label">
            USAGE & KNOWLEDGE ANALYTICS
          </p>

          <h1>
            Search Analytics
          </h1>

          <p className="search-analytics-description">
            Understand how clinicians use the system and identify gaps in the
            Ayurvedic knowledge base.
          </p>

        </div>

      </div>


      {/* =========================================
          OVERVIEW STATISTICS
      ========================================= */}

      <section className="analytics-stats-grid">

        <div className="analytics-stat-card">
          <strong>4,821</strong>
          <span>Total Searches</span>
          <small>All time</small>
        </div>

        <div className="analytics-stat-card">
          <strong>643</strong>
          <span>Searches This Month</span>
          <small className="positive-change">+12%</small>
        </div>

        <div className="analytics-stat-card">
          <strong>67%</strong>
          <span>Avg Match Score</span>
          <small>Across all queries</small>
        </div>

        <div className="analytics-stat-card">
          <strong>38</strong>
          <span>Zero-Match Searches</span>
          <small className="warning-text">No results returned</small>
        </div>

        <div className="analytics-stat-card">
          <strong>112</strong>
          <span>Weak-Match Searches</span>
          <small className="warning-text">Score below 40%</small>
        </div>

      </section>


      {/* =========================================
          SEARCH TRENDS
      ========================================= */}

      <section className="analytics-trend-card">

        <div className="analytics-section-header">

          <h2>
            Search Trends
          </h2>

          <div className="analytics-range-buttons">

            {searchRanges.map((range) => (

              <button
                key={range}
                type="button"
                className={
                  selectedRange === range
                    ? "active"
                    : ""
                }
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </button>

            ))}

          </div>

        </div>


        <div className="analytics-chart">

          <div className="analytics-chart-line">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="analytics-chart-labels">
            <span>01 Sep</span>
            <span>08 Sep</span>
            <span>15 Sep</span>
            <span>22 Sep</span>
            <span>30 Sep</span>
          </div>

        </div>

      </section>


      {/* =========================================
          FREQUENT + WEAK SEARCHES
      ========================================= */}

      <section className="analytics-two-column">

        {/* MOST FREQUENT SEARCHES */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">
            <h2>
              Most Frequent Searches
            </h2>
          </div>

          <div className="analytics-table-wrapper">

            <table className="analytics-table">

              <thead>
                <tr>
                  <th>QUERY</th>
                  <th>COUNT</th>
                  <th>AVG %</th>
                </tr>
              </thead>

              <tbody>

                {frequentSearches.map((search) => (

                  <tr key={search.query}>

                    <td>

                      <strong>
                        {search.query}
                      </strong>

                      <small>
                        {search.parameters}
                      </small>

                    </td>

                    <td className="analytics-count">
                      {search.count}
                    </td>

                    <td>

                      <div className="match-score">

                        <div className="match-bar">
                          <span
                            style={{
                              width: `${search.match}%`
                            }}
                          ></span>
                        </div>

                        <span>
                          {search.match}%
                        </span>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* WEAK / ZERO MATCH */}

        <div className="analytics-panel">

          <div className="analytics-panel-header analytics-weak-header">

            <div>

              <h2>
                Weak / Zero Match Searches
              </h2>

              <span className="data-gap-badge">
                Data gap indicator
              </span>

            </div>

          </div>

          <div className="analytics-table-wrapper">

            <table className="analytics-table weak-search-table">

              <thead>
                <tr>
                  <th>QUERY</th>
                  <th>COUNT</th>
                  <th>AVG %</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {weakSearches.map((search) => (

                  <tr key={search.query}>

                    <td>

                      <strong>
                        {search.query}
                      </strong>

                      <small>
                        {search.parameters}
                      </small>

                    </td>

                    <td className="analytics-count weak-count">
                      {search.count}
                    </td>

                    <td>
                      <span className="weak-match-badge">
                        {search.match}%
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="analytics-action-link"
                      >
                        Add herbs
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* =========================================
          RARELY TOP RESULTS + DATA GAP INSIGHTS
      ========================================= */}

      <section className="analytics-two-column analytics-bottom-grid">

        {/* RARELY IN TOP RESULTS */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">
            <h2>
              Herbs Rarely in Top Results
            </h2>
          </div>

          <div className="analytics-table-wrapper">

            <table className="analytics-table rare-herbs-table">

              <thead>
                <tr>
                  <th>HERB</th>
                  <th>APPEARANCES</th>
                  <th>TOP-10</th>
                  <th>LAST SEEN</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {rarelyTopResults.map((herb) => (

                  <tr key={herb.herb}>

                    <td>
                      <strong>
                        {herb.herb}
                      </strong>
                    </td>

                    <td className="rare-number">
                      {herb.appearances}
                    </td>

                    <td>
                      {herb.topTen}
                    </td>

                    <td>
                      <span className="last-seen">
                        {herb.lastSeen}
                      </span>
                    </td>

                    <td>

                      <span
                        className={`herb-analytics-status ${
                          herb.status.toLowerCase()
                        }`}
                      >
                        {herb.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* DATA GAP INSIGHTS */}

        <div className="analytics-panel insights-panel">

          <div className="analytics-panel-header">

            <h2>
              Data Gap Insights
            </h2>

          </div>

          <div className="analytics-insights">

            {insights.map((insight, index) => (

              <div
                className="analytics-insight"
                key={index}
              >

                <span className="analytics-insight-icon">
                  {insight.icon}
                </span>

                <div>

                  <p>
                    {insight.text}
                  </p>

                  <button type="button">
                    {insight.action}
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  )
}

export default SearchAnalytics