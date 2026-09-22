import "../styles/SearchInsights.css"

function SearchInsights() {
  const insights = [
    {
      label: "MOST SEARCHED ATTRIBUTE",
      value: "Vata Dosha",
      count: "34 queries",
    },
    {
      label: "TOP RASA COMBINATION",
      value: "Tikta + Kashaya",
      count: "18 searches",
    },
    {
      label: "ACTIVE SROTAS",
      value: "Majjavaha Srotas",
      count: "11 queries",
    },
    {
      label: "ZERO-MATCH SEARCHES",
      value: "2 recent",
      count: "Needs review",
    },
  ]

  const doshaCombinations = [
    "Vata + Pitta",
    "Kapha + Vata",
    "Tridosha",
    "Pitta + Kapha",
    "Vata only",
  ]

  return (
    <section className="search-insights">
      <div className="search-insights-header">
        <div>
          <h2>Search Insights</h2>
          <p>Patterns from your recent queries</p>
        </div>
      </div>

      <div className="search-insights-content">
        <div className="search-insights-list">
          {insights.map((insight) => (
            <div className="search-insight-item" key={insight.label}>
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

        <div className="recent-dosha-combinations">
          <p>RECENT DOSHA COMBINATIONS</p>

          <div className="dosha-combination-list">
            {doshaCombinations.map((combination) => (
              <button
                key={combination}
                type="button"
                className="dosha-combination"
              >
                {combination}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchInsights