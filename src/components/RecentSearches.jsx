function RecentSearches() {
    const recentSearches = [
      {
        query: "Herbs for digestive discomfort",
        type: "Simple Search",
        time: "Today, 10:42 AM",
      },
      {
        query: "Vata balancing herbs",
        type: "Simple Search",
        time: "Yesterday, 4:18 PM",
      },
      {
        query: "Rasa: Madhura · Virya: Sheeta",
        type: "Detailed Search",
        time: "Yesterday, 11:05 AM",
      },
    ]
  
    return (
      <section className="recent-searches">
  
        <div className="recent-searches-header">
  
          <div>
            <p className="recent-label">YOUR ACTIVITY</p>
  
            <h2>Recent searches</h2>
  
            <span>
              Quickly return to your recent Ayurvedic research.
            </span>
          </div>
  
          <button className="view-all-button" type="button">
            View all →
          </button>
  
        </div>
  
  
        <div className="recent-search-list">
  
          {recentSearches.map((search) => (
  
            <div className="recent-search-item" key={search.query}>
  
              <div className="recent-search-icon">
                ⌕
              </div>
  
              <div className="recent-search-info">
  
                <h3>{search.query}</h3>
  
                <div className="recent-search-meta">
                  <span>{search.type}</span>
                  <span>•</span>
                  <span>{search.time}</span>
                </div>
  
              </div>
  
              <button
                className="recent-search-arrow"
                type="button"
              >
                ›
              </button>
  
            </div>
  
          ))}
  
        </div>
  
      </section>
    )
  }
  
  export default RecentSearches