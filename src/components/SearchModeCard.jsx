import { useNavigate } from "react-router-dom"

function SearchModeCard({ title, description, icon, mode }) {

  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/search?mode=${mode}`)
  }

  return (
    <div
      className="search-mode-card"
      onClick={handleClick}
    >

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
  )
}

export default SearchModeCard