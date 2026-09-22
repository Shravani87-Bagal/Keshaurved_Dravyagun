import "../styles/RecentSearches.css"

function RecentSearches() {
  const recentSearches = [
    {
      query: "Ashwagandha — adaptogenic properties",
      type: "Detailed",
      results: "1 result",
      time: "2h ago",
    },
    {
      query: "Vata-pacifying herbs",
      type: "Simple",
      results: "14 results",
      time: "5h ago",
    },
    {
      query: "Triphala — Rasa: Tikta, Kashaya",
      type: "Detailed",
      results: "3 results",
      time: "Yesterday",
    },
    {
      query: "Brahmi neurological applications",
      type: "Simple",
      results: "2 results",
      time: "Yesterday",
    },
    {
      query: "Kapha Dosha — Srotas: Pranavaha",
      type: "Detailed",
      results: "7 results",
      time: "3d ago",
    },
    {
      query: "Guduchi immunomodulatory action",
      type: "Simple",
      results: "1 result",
      time: "4d ago",
    },
  ]

  return (
    <section className="recent-searches">

      <div className="recent-searches-header">

        <h2>Recent Search Activity</h2>

        <button
          className="recent-searches-go-button"
          type="button"
        >
          Go to Search →
        </button>

      </div>

      <div className="recent-search-list">

        {recentSearches.map((search) => (

          <div
            className="recent-search-item"
            key={search.query}
          >

            <div className="recent-search-icon">
              ⌕
            </div>

            <div className="recent-search-info">

              <h3>{search.query}</h3>

              <div className="recent-search-meta">

                <span
                  className={`recent-search-mode ${search.type.toLowerCase()}`}
                >
                  {search.type}
                </span>

                <span className="recent-search-results">
                  {search.results}
                </span>

              </div>

            </div>

            <span className="recent-search-time">
              {search.time}
            </span>

          </div>

        ))}

      </div>

    </section>
  )
}

export default RecentSearches