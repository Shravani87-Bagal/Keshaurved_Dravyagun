import { useEffect, useState } from "react"
import "../styles/ScoringConfiguration.css"

function ScoringConfiguration() {

  // =====================================================
  // DEFAULT WEIGHTS
  // =====================================================

  /*
    These parameters are based on the actual fields
    available in AddHerb.jsx.

    NOTE:
    Avayava has been removed because AddHerb.jsx
    currently does not store an avayava field.
  */

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
    karma: 10,
    indication: 15,
  }

  const [weights, setWeights] = useState(
    defaultWeights
  )

  const [herbs, setHerbs] = useState([])

  // =====================================================
  // PARAMETERS
  // =====================================================

  const parameters = [
    {
      key: "rasa",
      name: "Rasa",
      description: "Taste parameters",
    },
    {
      key: "guna",
      name: "Guna",
      description: "Quality attributes",
    },
    {
      key: "virya",
      name: "Virya",
      description: "Potency",
    },
    {
      key: "vipaka",
      name: "Vipaka",
      description: "Post-digestive taste",
    },
    {
      key: "prabhava",
      name: "Prabhava",
      description: "Specific action",
    },
    {
      key: "dosha",
      name: "Dosha",
      description: "Dosha affinity",
    },
    {
      key: "dhatu",
      name: "Dhatu",
      description: "Tissue affinity",
    },
    {
      key: "mala",
      name: "Mala",
      description: "Waste-channel affinity",
    },
    {
      key: "srotas",
      name: "Srotas",
      description: "Channel affinity",
    },
    {
      key: "karma",
      name: "Karma",
      description: "Therapeutic actions",
    },
    {
      key: "indication",
      name: "Clinical Indication",
      description: "Indicated conditions",
    },
  ]

  // =====================================================
  // LOAD REAL HERB DATA
  // =====================================================

  useEffect(() => {

    const savedHerbs = JSON.parse(
      localStorage.getItem("herbs") || "[]"
    )

    setHerbs(
      Array.isArray(savedHerbs)
        ? savedHerbs
        : []
    )

    const savedWeights = JSON.parse(
      localStorage.getItem(
        "scoringWeights"
      ) || "null"
    )

    if (savedWeights) {
      setWeights({
        ...defaultWeights,
        ...savedWeights,
      })
    }

  }, [])

  // =====================================================
  // TOTAL WEIGHT
  // =====================================================

  const totalPoints =
    Object.values(weights).reduce(
      (total, value) =>
        total + Number(value || 0),
      0
    )

  // =====================================================
  // CHECK WHETHER PARAMETER EXISTS
  // =====================================================

  const hasValue = (value) => {

    if (
      value === null ||
      value === undefined
    ) {
      return false
    }

    if (typeof value === "string") {
      return value.trim() !== ""
    }

    if (Array.isArray(value)) {
      return value.length > 0
    }

    if (
      typeof value === "object"
    ) {
      return Object.values(value).some(
        (item) =>
          item !== null &&
          item !== undefined &&
          String(item).trim() !== ""
      )
    }

    return Boolean(value)
  }

  // =====================================================
  // CHECK PARAMETER COVERAGE IN REAL DATASET
  // =====================================================

  const getParameterCoverage = (
    parameterKey
  ) => {

    if (herbs.length === 0) {
      return 0
    }

    const matchingHerbs =
      herbs.filter((herb) => {

        switch (parameterKey) {

          case "rasa":
            return hasValue(
              herb.rasa
            )

          case "guna":
            return hasValue(
              herb.guna
            )

          case "virya":
            return hasValue(
              herb.virya
            )

          case "vipaka":
            return hasValue(
              herb.vipaka
            )

          case "prabhava":
            return hasValue(
              herb.prabhava
            )

          case "dosha":
            return hasValue(
              herb.dosha
            )

          case "dhatu":
            return hasValue(
              herb.dhatu
            )

          case "mala":
            return hasValue(
              herb.mala
            )

          case "srotas":
            return hasValue(
              herb.srotas
            )

          case "karma":
            return (
              hasValue(
                herb.importantKarma
              ) ||
              hasValue(
                herb.otherKarma
              ) ||
              hasValue(
                herb.therapeuticActions
              )
            )

          case "indication":
            return (
              hasValue(
                herb.clinicalIndications
              ) ||
              hasValue(
                herb.majorDiseases
              )
            )

          default:
            return false
        }
      })

    return matchingHerbs.length
  }

  // =====================================================
  // WEIGHT CHANGE
  // =====================================================

  const handleWeightChange = (
    key,
    value
  ) => {

    setWeights(
      (previous) => ({
        ...previous,
        [key]: Number(value),
      })
    )
  }

  // =====================================================
  // RESET
  // =====================================================

  const handleReset = () => {

    setWeights(
      defaultWeights
    )

    localStorage.removeItem(
      "scoringWeights"
    )
  }

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = () => {

    localStorage.setItem(
      "scoringWeights",
      JSON.stringify(weights)
    )

    alert(
      "Scoring configuration saved successfully."
    )
  }

  // =====================================================
  // RENDER
  // =====================================================

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
            Configure how Ayurvedic parameters contribute
            to herb relevance ranking.
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
          The search engine calculates a relevance
          score based on selected Ayurvedic parameters.
          Adjust the weights below to control each
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
          Changes to scoring weights affect future
          search results and ranking across all
          clinical queries.
        </p>

      </div>


      {/* =========================================
          DATASET SUMMARY
      ========================================= */}

      <div className="scoring-info-box">

        <span className="scoring-info-icon">
          ✓
        </span>

        <p>
          Dataset connected:{" "}
          <strong>
            {herbs.length}
          </strong>{" "}
          herb records currently available
          in the knowledge base.
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

          {parameters.map(
            (parameter) => {

              const weight =
                weights[
                  parameter.key
                ] || 0

              const percentage =
                totalPoints > 0
                  ? Math.round(
                      (weight /
                        totalPoints) *
                        100
                    )
                  : 0

              const coverage =
                getParameterCoverage(
                  parameter.key
                )

              const coveragePercentage =
                herbs.length > 0
                  ? Math.round(
                      (coverage /
                        herbs.length) *
                        100
                    )
                  : 0

              return (

                <div
                  className="scoring-parameter-row"
                  key={
                    parameter.key
                  }
                >

                  {/* PARAMETER NAME */}

                  <div className="scoring-parameter-info">

                    <h3>
                      {parameter.name}
                    </h3>

                    <p>
                      {parameter.description}
                    </p>

                    <small>
                      Dataset coverage:{" "}
                      <strong>
                        {coverage}
                      </strong>
                      /
                      {herbs.length} herbs
                      {" "}
                      ({coveragePercentage}%)
                    </small>

                  </div>


                  {/* SLIDER */}

                  <div className="scoring-slider-container">

                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={weight}
                      onChange={(
                        event
                      ) =>
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
            }
          )}

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