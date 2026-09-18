function HerbResultCard({ herb }) {
    return (
      <article className="herb-result-card">
  
        {/* Herb visual block */}
  
        <div
          className="herb-result-visual"
          style={{ background: herb.visualColor }}
        >
          <span>♧</span>
        </div>
  
  
        {/* Herb information */}
  
        <div className="herb-result-info">
  
          <div className="herb-result-top">
  
            <div>
  
              <h2>
                {herb.name}
              </h2>
  
              <em>
                {herb.scientificName}
              </em>
  
            </div>
  
  
            <button
              className="herb-favorite-button"
              type="button"
              aria-label={`Save ${herb.name}`}
            >
              ♡
            </button>
  
          </div>
  
  
          {/* Match */}
  
          <div className="herb-match-row">
  
            <strong>
              {herb.match}%
            </strong>
  
            <span>
              match
            </span>
  
            <span className={`verification-badge ${herb.status.toLowerCase()}`}>
              ✓ {herb.status}
            </span>
  
          </div>
  
  
          {/* Ayurvedic attributes */}
  
          <div className="herb-result-tags">
  
            {herb.tags.map((tag) => (
              <span key={tag}>
                {tag}
              </span>
            ))}
  
          </div>
  
  
          {/* Description */}
  
          <p className="herb-result-description">
            {herb.description}
          </p>
  
  
          {/* Bottom actions */}
  
          <div className="herb-result-actions">
  
            <button
              className="view-profile-button"
              type="button"
            >
              View profile
              <span>›</span>
            </button>
  
  
            <button
              className="compare-herb-button"
              type="button"
            >
              <span>♧</span>
              Compare
            </button>
  
          </div>
  
        </div>
  
      </article>
    )
  }
  
  export default HerbResultCard