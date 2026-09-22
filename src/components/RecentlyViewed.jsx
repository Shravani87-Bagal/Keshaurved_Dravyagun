import "../styles/RecentlyViewed.css"
function RecentlyViewed() {
    const recentlyViewed = [
      {
        name: "Ashwagandha",
        scientificName: "Withania somnifera",
        viewed: "Viewed today",
      },
      {
        name: "Brahmi",
        scientificName: "Bacopa monnieri",
        viewed: "Viewed yesterday",
      },
      {
        name: "Triphala",
        scientificName: "Classical formulation",
        viewed: "Viewed 2 days ago",
      },
      {
        name: "Guduchi",
        scientificName: "Tinospora cordifolia",
        viewed: "Viewed 3 days ago",
      },
      {
        name: "Shatavari",
        scientificName: "Asparagus racemosus",
        viewed: "Viewed 4 days ago",
      },
    ]
  
    return (
      <section className="recently-viewed">
  
        <div className="recently-viewed-header">
  
          <div>
            
            <h2>
              Recently Viewed
            </h2>
  
            <span>
              Herbs you explored recently
            </span>
          </div>
  
          <button
            className="recently-viewed-button"
            type="button"
          >
            View all
          </button>
  
        </div>
  
        <div className="recently-viewed-list">
  
          {recentlyViewed.map((herb) => (
  
            <button
              className="recently-viewed-item"
              key={herb.name}
              type="button"
            >
  
              <div className="recently-viewed-icon">
                ♧
              </div>
  
              <div className="recently-viewed-info">
  
                <h3>
                  {herb.name}
                </h3>
  
                <em>
                  {herb.scientificName}
                </em>
  
                <span>
                  {herb.viewed}
                </span>
  
              </div>
  
              <span className="recently-viewed-arrow">
                ›
              </span>
  
            </button>
  
          ))}
  
        </div>
  
      </section>
    )
  }
  export default RecentlyViewed