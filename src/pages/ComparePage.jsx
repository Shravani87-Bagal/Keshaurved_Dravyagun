import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/ComparePage.css"

const MAX_COMPARE_HERBS = 4

function ComparePage() {
  const navigate = useNavigate()

  const [selectedHerbs, setSelectedHerbs] = useState([])

  /*
    =========================================
    LOAD SELECTED HERBS
    =========================================
    
    Herbs are added to comparison from:
    - Herb Library
    - Search Result Card

    Both pages store the complete herb object
    inside localStorage.
  */

  useEffect(() => {
    const savedHerbs = localStorage.getItem("selectedCompareHerbs")

    if (!savedHerbs) {
      setSelectedHerbs([])
      return
    }

    try {
      const parsedHerbs = JSON.parse(savedHerbs)

      if (Array.isArray(parsedHerbs)) {
        setSelectedHerbs(parsedHerbs)
      } else {
        setSelectedHerbs([])
      }
    } catch (error) {
      console.error(
        "Unable to load comparison herbs:",
        error
      )

      setSelectedHerbs([])
    }
  }, [])

  /*
    =========================================
    OPEN HERB LIBRARY
    =========================================
  */

  const handleAddHerb = () => {
    navigate("/herb-library")
  }

  /*
    =========================================
    REMOVE ONE HERB
    =========================================
  */

  const removeHerb = (herbId) => {
    const updatedHerbs = selectedHerbs.filter(
      (herb) => herb.id !== herbId
    )

    setSelectedHerbs(updatedHerbs)

    if (updatedHerbs.length === 0) {
      localStorage.removeItem("selectedCompareHerbs")
    } else {
      localStorage.setItem(
        "selectedCompareHerbs",
        JSON.stringify(updatedHerbs)
      )
    }
  }

  /*
    =========================================
    TOGGLE HERB
    =========================================

    This is kept so your selected-herb chips
    continue to work.
  */

  const toggleCompareHerb = (herb) => {
    const alreadySelected = selectedHerbs.some(
      (selectedHerb) => selectedHerb.id === herb.id
    )

    if (alreadySelected) {
      removeHerb(herb.id)
      return
    }

    if (selectedHerbs.length >= MAX_COMPARE_HERBS) {
      return
    }

    const updatedHerbs = [
      ...selectedHerbs,
      herb,
    ]

    setSelectedHerbs(updatedHerbs)

    localStorage.setItem(
      "selectedCompareHerbs",
      JSON.stringify(updatedHerbs)
    )
  }

  /*
    =========================================
    CLEAR COMPLETE COMPARISON
    =========================================
  */

  const clearComparison = () => {
    setSelectedHerbs([])

    localStorage.removeItem(
      "selectedCompareHerbs"
    )
  }

  /*
    =========================================
    FORMAT ARRAY
    =========================================

    Real dataset contains arrays such as:

    rasa: ["Tikta", "Kashay"]

    karma:
    ["Rasayana", "Balya", "Deepana"]

    This converts them into readable text.
  */

  const formatArray = (value) => {
    if (!value) {
      return "—"
    }

    if (Array.isArray(value)) {
      const filteredValues = value.filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          String(item).trim() !== ""
      )

      if (filteredValues.length === 0) {
        return "—"
      }

      return filteredValues.join(" · ")
    }

    return String(value)
  }

  /*
    =========================================
    DOSHA
    =========================================
  */

  const formatDosha = (dosha) => {
    if (!dosha) {
      return "—"
    }

    const values = [
      dosha.vata &&
        `Vata: ${dosha.vata}`,

      dosha.pitta &&
        `Pitta: ${dosha.pitta}`,

      dosha.kapha &&
        `Kapha: ${dosha.kapha}`,
    ].filter(Boolean)

    return values.length > 0
      ? values.join(" · ")
      : "—"
  }

  /*
    =========================================
    DHATU
    =========================================

    Real dataset:

    [
      "Rasa (5)",
      "Rakta (5)",
      "Mamsa (4)"
    ]
  */

  const formatDhatu = (dhatu) => {
    if (!dhatu) {
      return "—"
    }

    if (Array.isArray(dhatu)) {
      return dhatu.length > 0
        ? dhatu.join(" · ")
        : "—"
    }

    if (typeof dhatu === "object") {
      return Object.entries(dhatu)
        .filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== "" &&
            value !== "—"
        )
        .map(
          ([key, value]) =>
            `${key}: ${value}`
        )
        .join(" · ") || "—"
    }

    return String(dhatu)
  }

  /*
    =========================================
    MALA
    =========================================

    Real dataset:

    [
      "Purisha: Decreases",
      "Mutra: Increases"
    ]
  */

  const formatMala = (mala) => {
    return formatArray(mala)
  }

  /*
    =========================================
    SROTAS
    =========================================

    Real dataset:

    [
      "Rasavaha",
      "Raktavaha",
      "Mamsavaha"
    ]
  */

  const formatSrotas = (srotas) => {
    return formatArray(srotas)
  }

  /*
    =========================================
    INDICATIONS
    =========================================
  */

  const formatIndications = (indications) => {
    return formatArray(indications)
  }

  /*
    =========================================
    KARMA
    =========================================
  */

  const formatKarma = (karma) => {
    return formatArray(karma)
  }

  /*
    =========================================
    REGIONAL NAMES
    =========================================
  */

  const formatRegionalNames = (names) => {
    return formatArray(names)
  }

  return (
    <div className="compare-page-layout">

      <DashboardNavbar />

      <div className="compare-page-body">

        <Sidebar />

        <main className="compare-page-content">

          <div className="compare-content-inner">

            {/* =========================================
                HEADER
                ========================================= */}

            <section className="compare-header">

              <div>

                <p className="compare-breadcrumb">
                  WORKSPACE / COMPARE
                </p>

                <h1>
                  Compare herbs
                </h1>

              </div>

              <button
                className="add-herb-button"
                type="button"
                onClick={handleAddHerb}
              >
                + Add herb
              </button>

            </section>


            {/* =========================================
                HERB SELECTOR
                ========================================= */}

            <section className="compare-herb-selector">

              <div className="compare-selector-header">

                <div>

                  <p className="compare-selector-label">
                    SELECTED HERBS (
                    {selectedHerbs.length}/
                    {MAX_COMPARE_HERBS}
                    )
                  </p>

                  <div className="selected-herb-chips">

                    {selectedHerbs.length === 0 && (
                      <span className="no-selected-herbs">
                        No herbs selected
                      </span>
                    )}

                    {selectedHerbs.map((herb) => (
                      <button
                        key={herb.id}
                        type="button"
                        className="selected-herb-chip"
                        onClick={() =>
                          toggleCompareHerb(herb)
                        }
                      >
                        {herb.englishName ||
                          "Unnamed herb"}

                        <span>
                          ×
                        </span>
                      </button>
                    ))}

                  </div>

                </div>

              </div>


              {/* 
                The real dataset can contain hundreds
                of herbs.

                We do NOT hardcode all herbs here.

                User adds herbs through Herb Library.
              */}

              <div className="compare-available-herbs">

                {selectedHerbs.map((herb) => (
                  <button
                    key={herb.id}
                    type="button"
                    className="compare-herb-option selected"
                    onClick={() =>
                      toggleCompareHerb(herb)
                    }
                  >
                    {herb.englishName ||
                      "Unnamed herb"}
                  </button>
                ))}

              </div>


              <p className="compare-selector-hint">
                Select up to 4 herbs. Choose at least 2 herbs
                to compare.
              </p>

            </section>


            {/* =========================================
                EMPTY STATE
                ========================================= */}

            {selectedHerbs.length === 0 && (

              <section className="compare-empty-state">

                <div className="compare-empty-icon">
                  ♧
                </div>

                <h2>
                  Compare Ayurvedic herbs
                </h2>

                <p>
                  Select two or more herbs to compare
                  their classical properties side by side.
                </p>

                <button
                  className="empty-add-herb-button"
                  type="button"
                  onClick={handleAddHerb}
                >
                  + Add herb
                </button>

              </section>

            )}


            {/* =========================================
                ONE HERB SELECTED
                ========================================= */}

            {selectedHerbs.length === 1 && (

              <section className="compare-incomplete-state">

                <div className="compare-selected-preview">

                  <div className="comparison-herb-icon">
                    🍃
                  </div>

                  <div>

                    <h2>
                      {selectedHerbs[0].englishName ||
                        "Unnamed herb"}
                    </h2>

                    <em>
                      {selectedHerbs[0].botanicalName ||
                        "Botanical name unavailable"}
                    </em>

                  </div>

                </div>


                <div className="compare-incomplete-message">

                  <strong>
                    Select at least one more herb
                  </strong>

                  <p>
                    Choose another herb to start the
                    comparison.
                  </p>

                  <button
                    className="add-herb-button"
                    type="button"
                    onClick={handleAddHerb}
                  >
                    + Add herb
                  </button>

                </div>

              </section>

            )}


            {/* =========================================
                COMPARISON
                ========================================= */}

            {selectedHerbs.length >= 2 && (

              <section className="comparison-section">

                <div className="comparison-section-header">

                  <div>

                    <p className="comparison-section-label">
                      SELECTED HERBS
                    </p>

                    <h2>
                      {selectedHerbs.length} herbs selected
                    </h2>

                  </div>

                  <button
                    className="clear-comparison-button"
                    type="button"
                    onClick={clearComparison}
                  >
                    Clear comparison
                  </button>

                </div>


                <div className="comparison-table-wrapper">

                  <div
                    className="comparison-table"
                    style={{
                      minWidth: `${
                        145 +
                        selectedHerbs.length * 280
                      }px`,
                    }}
                  >


                    {/* =========================================
                        HERB HEADER
                        ========================================= */}

                    <div
                      className="comparison-row comparison-header-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          ATTRIBUTE
                        </strong>

                        <span>
                          Ayurvedic profile
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-herb-header"
                          key={herb.id}
                        >

                          <div className="comparison-herb-top">

                            <div className="comparison-herb-icon">
                              🍃
                            </div>

                            <button
                              className="remove-herb-button"
                              type="button"
                              onClick={() =>
                                removeHerb(herb.id)
                              }
                            >
                              × Remove
                            </button>

                          </div>


                          <h2>
                            {herb.englishName ||
                              "Unnamed herb"}
                          </h2>

                          <em>
                            {herb.botanicalName ||
                              "Botanical name unavailable"}
                          </em>

                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        PART USED
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          PART USED
                        </strong>

                        <span>
                          Plant part
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.partUsed || "—"}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        RASA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          RASA
                        </strong>

                        <span>
                          Taste
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatArray(herb.rasa)}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        GUNA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          GUNA
                        </strong>

                        <span>
                          Qualities
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatArray(herb.guna)}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        VIRYA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          VIRYA
                        </strong>

                        <span>
                          Potency
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.virya || "—"}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        VIPAKA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          VIPAKA
                        </strong>

                        <span>
                          Post-digestive effect
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.vipaka || "—"}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        PRABHAVA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          PRABHAVA
                        </strong>

                        <span>
                          Specific effect
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.prabhava || "—"}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        DOSHA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          DOSHA
                        </strong>

                        <span>
                          Dosha affinity
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatDosha(herb.dosha)}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        DHATU
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          DHATU
                        </strong>

                        <span>
                          Tissue affinity
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatDhatu(herb.dhatu)}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        MALA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          MALA
                        </strong>

                        <span>
                          Waste products
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatMala(herb.mala)}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        SROTAS
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          SROTAS
                        </strong>

                        <span>
                          Channel affinity
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatSrotas(herb.srotas)}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        AVAYAVA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          AVAYAVA
                        </strong>

                        <span>
                          Organ / structure
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatArray(herb.avayava)}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        KARMA
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          KARMA
                        </strong>

                        <span>
                          Therapeutic actions
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatKarma(herb.karma)}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        INDICATIONS
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          INDICATIONS
                        </strong>

                        <span>
                          Major diseases
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatIndications(
                            herb.indications
                          )}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        REGIONAL NAMES
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          REGIONAL NAMES
                        </strong>

                        <span>
                          Known names
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {formatRegionalNames(
                            herb.regionalNames
                          )}
                        </div>

                      ))}

                    </div>


                    {/* =========================================
                        STATUS
                        ========================================= */}

                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">

                        <strong>
                          STATUS
                        </strong>

                        <span>
                          Verification
                        </span>

                      </div>


                      {selectedHerbs.map((herb) => (

                        <div
                          className="comparison-value"
                          key={herb.id}
                        >

                          <span className="comparison-status">
                            {herb.verificationStatus ||
                              herb.status ||
                              "Draft"}
                          </span>

                        </div>

                      ))}

                    </div>


                  </div>

                </div>

              </section>

            )}

          </div>

        </main>

      </div>

    </div>
  )
}

export default ComparePage