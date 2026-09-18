import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/DetailedSearch.css"

function DetailedSearch() {
  const parameters = [
    {
      title: "Rasa",
      subtitle: "taste profile",
      options: ["Sweet", "Sour", "Salty", "Pungent", "Bitter", "Astringent"],
    },
    {
      title: "Guna",
      subtitle: "qualities",
      options: ["Light", "Heavy", "Dry", "Unctuous", "Sharp", "Stable"],
    },
    {
      title: "Virya",
      subtitle: "potency / action",
      options: ["Heating", "Cooling"],
    },
    {
      title: "Vipaka",
      subtitle: "post-digestive effect",
      options: ["Sweet", "Sour", "Pungent"],
    },
    {
      title: "Prabhava",
      subtitle: "specific action",
      options: ["Rasayana", "Medhya", "Garbhastapana"],
    },
    {
      title: "Dosha",
      subtitle: "constitution type",
      options: ["Vata", "Pitta", "Kapha", "Tridoshic"],
    },
    {
      title: "Dhatu",
      subtitle: "tissue system",
      options: ["Rasa", "Rakta", "Mamsa", "Meda", "Asthi", "Majja"],
    },
    {
      title: "Mala",
      subtitle: "waste pathways",
      options: ["Mutra", "Purisha", "Sweda"],
    },
    {
      title: "Srotas",
      subtitle: "body channels",
      options: ["Pranavaha", "Annavaha", "Rasavaha", "Asthivaha"],
    },
    {
      title: "Karma",
      subtitle: "therapeutic action",
      options: ["Deepana", "Pachana", "Balya", "Rasayana", "Medhya"],
    },
    {
      title: "Disease / Indication",
      subtitle: "clinical concern",
      options: [
        "Joint discomfort",
        "Digestive weakness",
        "Fatigue",
        "Congestion",
      ],
    },
    {
      title: "Organ / Avayava",
      subtitle: "primary system",
      options: ["Joints", "Stomach", "Liver", "Lungs", "Nervous system"],
    },
  ]

  const navigate = useNavigate()

  // Store selected options
  const [selectedParameters, setSelectedParameters] = useState({})

  // Handle parameter selection
  const handleParameterSelect = (parameterTitle, option) => {
    setSelectedParameters((previous) => {
      const currentSelection = previous[parameterTitle] || []

      const alreadySelected = currentSelection.includes(option)

      if (alreadySelected) {
        return {
          ...previous,
          [parameterTitle]: currentSelection.filter(
            (item) => item !== option
          ),
        }
      }

      return {
        ...previous,
        [parameterTitle]: [...currentSelection, option],
      }
    })
  }

  // Remove empty parameter groups
  const cleanedSelections = Object.fromEntries(
    Object.entries(selectedParameters).filter(
      ([, options]) => options.length > 0
    )
  )

  // Total number of selected options
  const selectedCount = Object.values(cleanedSelections).reduce(
    (total, options) => total + options.length,
    0
  )

  // Clear all selections
  const handleClearAll = () => {
    setSelectedParameters({})
  }

  return (
    <section className="detailed-search-section">
      <div className="detailed-search-top">
        <div>
          <p className="detailed-search-label">
            STRUCTURED CLINICAL SEARCH
          </p>

          <div className="selection-search-row">
            <div className="selection-status-top">
              <h3>
                {selectedCount === 0
                  ? "No parameters selected"
                  : `${selectedCount} parameter${
                      selectedCount > 1 ? "s" : ""
                    } selected`}
              </h3>

              <p>
                {selectedCount === 0
                  ? "Select one or more attributes to begin a precise search."
                  : "Your selected Ayurvedic parameters will be used to rank matching herbs."}
              </p>
            </div>

            <button
              className="detailed-search-button"
              type="button"
              disabled={selectedCount === 0}
              onClick={() => {
                navigate("/search-results?mode=detailed")
              }}
            >
              Search herbs
            </button>
          </div>

          <h2>Refine the herb profile</h2>

          <p className="detailed-search-description">
            Choose as many parameters as needed. Results will be ranked
            by the strength of the match.
          </p>
        </div>

        <button
          className="clear-all-button"
          type="button"
          onClick={handleClearAll}
        >
          Clear all
        </button>
      </div>

      <div className="parameter-grid">
        {parameters.map((parameter) => (
          <fieldset className="parameter-card" key={parameter.title}>
            <legend>{parameter.title}</legend>

            <p className="parameter-subtitle">
              {parameter.subtitle}
            </p>

            <div className="parameter-options">
              {parameter.options.map((option) => {
                const isSelected =
                  selectedParameters[parameter.title]?.includes(option)

                return (
                  <button
                    key={option}
                    type="button"
                    className={`parameter-chip ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleParameterSelect(
                        parameter.title,
                        option
                      )
                    }
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  )
}

export default DetailedSearch