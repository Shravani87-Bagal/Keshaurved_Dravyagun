import { useState } from "react"
import "../styles/ScoringConfiguration.css"

function ScoringConfiguration() {

  const defaultWeights = {
    rasa: 20,
    guna: 18,
    virya: 12,
    vipaka: 10,
    prabhava: 8,
    dosha: 15,
    dhatu: 6,
    mala: 3,
    srotas: 8,
    avayava: 5,
    karma: 10,
    indication: 15
  }

  const [weights, setWeights] = useState(defaultWeights)

  const parameters = [
    {
      key: "rasa",
      name: "Rasa",
      description: "Taste parameters"
    },
    {
      key: "guna",
      name: "Guna",
      description: "Quality attributes"
    },
    {
      key: "virya",
      name: "Virya",
      description: "Potency"
    },
    {
      key: "vipaka",
      name: "Vipaka",
      description: "Post-digestive taste"
    },
    {
      key: "prabhava",
      name: "Prabhava",
      description: "Specific action"
    },
    {
      key: "dosha",
      name: "Dosha",
      description: "Dosha affinity"
    },
    {
      key: "dhatu",
      name: "Dhatu",
      description: "Tissue affinity"
    },
    {
      key: "mala",
      name: "Mala",
      description: "Waste-channel affinity"
    },
    {
      key: "srotas",
      name: "Srotas",
      description: "Channel affinity"
    },
    {
      key: "avayava",
      name: "Avayava",
      description: "Organ/system"
    },
    {
      key: "karma",
      name: "Karma",
      description: "Therapeutic actions"
    },
    {
      key: "indication",
      name: "Clinical Indication",
      description: "Indicated conditions"
    }
  ]

  const totalPoints = Object.values(weights).reduce(
    (total, value) => total + value,
    0
  )

  const handleWeightChange = (key, value) => {
    setWeights({
      ...weights,
      [key]: Number(value)
    })
  }

  const handleReset = () => {
    setWeights(defaultWeights)
  }

  const handleSave = () => {
    localStorage.setItem(
      "scoringWeights",
      JSON.stringify(weights)
    )

    alert("Scoring configuration saved successfully.")
  }

  return (
    <div className="scoring-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="scoring-page-header">

        <div>

          <p className="scoring-label">
            SEARCH ENGINE CONFIGURATION
          </p>

          <h1>
            Scoring Configuration
          </h1>

          <p className="scoring-description">
            Configure how Ayurvedic parameters contribute to herb relevance ranking.
          </p>

        </div>

      </div>


      {/* =========================================
          INFORMATION BOX
      ========================================= */}

      <div className="scoring-info-box">

        <span className="scoring-info-icon">
          ⓘ
        </span>

        <p>
          The search engine calculates a relevance score based on selected
          Ayurvedic parameters. Adjust the weights below to control each
          parameter's importance in the final ranking score.
        </p>

      </div>


      {/* =========================================
          WARNING BOX
      ========================================= */}

      <div className="scoring-warning-box">

        <span className="scoring-warning-icon">
          ⚠
        </span>

        <p>
          Changes to scoring weights affect future search results and ranking
          across all clinical queries.
        </p>

      </div>


      {/* =========================================
          PARAMETER WEIGHTS CARD
      ========================================= */}

      <section className="scoring-card">

        {/* CARD HEADER */}

        <div className="scoring-card-header">

          <h2>
            Parameter Weights
          </h2>

          <div className="scoring-header-actions">

            <strong>
              Total: {totalPoints} pts
            </strong>

            <button
              type="button"
              className="scoring-reset-top"
              onClick={handleReset}
            >
              ↻ Reset to Default
            </button>

          </div>

        </div>


        {/* =========================================
            PARAMETER ROWS
        ========================================= */}

        <div className="scoring-parameters">

          {parameters.map((parameter) => {

            const weight = weights[parameter.key]

            const percentage =
              totalPoints > 0
                ? Math.round((weight / totalPoints) * 100)
                : 0

            return (

              <div
                className="scoring-parameter-row"
                key={parameter.key}
              >

                {/* PARAMETER NAME */}

                <div className="scoring-parameter-info">

                  <h3>
                    {parameter.name}
                  </h3>

                  <p>
                    {parameter.description}
                  </p>

                </div>


                {/* SLIDER */}

                <div className="scoring-slider-container">

                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={weight}
                    onChange={(event) =>
                      handleWeightChange(
                        parameter.key,
                        event.target.value
                      )
                    }
                    className="scoring-slider"
                  />

                </div>


                {/* VALUE */}

                <div className="scoring-value-box">
                  {weight}
                </div>


                {/* PERCENTAGE */}

                <div className="scoring-percentage">
                  {percentage}%
                </div>

              </div>

            )

          })}

        </div>


        {/* =========================================
            BOTTOM ACTIONS
        ========================================= */}

        <div className="scoring-card-footer">

          <button
            type="button"
            className="scoring-save-button"
            onClick={handleSave}
          >
            Save Configuration
          </button>

          <button
            type="button"
            className="scoring-reset-button"
            onClick={handleReset}
          >
            ↻ Reset to Default
          </button>

        </div>

      </section>

    </div>
  )
}

export default ScoringConfiguration