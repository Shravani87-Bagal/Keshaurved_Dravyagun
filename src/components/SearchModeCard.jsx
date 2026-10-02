import { useNavigate } from "react-router-dom"

function SearchModeCard({
  title,
  description,
  icon,
  mode,
  hoverDescription,
}) {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/search?mode=${mode}`)
  }

  return (
    <div
      className="search-mode-card"
      onClick={handleClick}
    >

      {/* NORMAL CARD */}
      <div className="search-mode-default">

        <div className="search-mode-top">
          <div className="search-mode-icon">
            {icon}
          </div>
        </div>

        <div className="search-mode-content">

          <h2>{title}</h2>

          <p>{description}</p>

        </div>

        <button
          className="search-mode-arrow"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          ›
        </button>

      </div>


      {/* HOVER INFORMATION */}
      <div className="search-mode-hover-info">

        <div className="search-mode-hover-top">

          <div className="search-mode-hover-icon">
            {icon}
          </div>

          <div>
            <span className="search-mode-hover-label">
              {title.toUpperCase()}
            </span>

            <h3>How it works</h3>
          </div>

        </div>


        <p className="search-mode-hover-description">
          {hoverDescription}
        </p>


        <div className="search-mode-hover-footer">
          <span>Click to explore</span>
          <span>›</span>
        </div>

      </div>

    </div>
  )
}

export default SearchModeCard