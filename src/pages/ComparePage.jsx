import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import "../styles/ComparePage.css"

function ComparePage() {
  const navigate = useNavigate()

  const [selectedHerbs, setSelectedHerbs] = useState([])

  useEffect(() => {
    const savedHerbs = localStorage.getItem("selectedCompareHerbs")

    if (savedHerbs) {
      setSelectedHerbs(JSON.parse(savedHerbs))
    }
  }, [])

  const handleAddHerb = () => {
    navigate("/herb-library")
  }

  const removeHerb = (herbId) => {
    const updatedHerbs = selectedHerbs.filter(
      (herb) => herb.id !== herbId
    )

    setSelectedHerbs(updatedHerbs)

    localStorage.setItem(
      "selectedCompareHerbs",
      JSON.stringify(updatedHerbs)
    )
  }

  const clearComparison = () => {
    setSelectedHerbs([])

    localStorage.removeItem("selectedCompareHerbs")
  }

  return (
    <div className="compare-page-layout">
      <DashboardNavbar />

      <div className="compare-page-body">
        <Sidebar />

        <main className="compare-page-content">
          <div className="compare-content-inner">

            {/* HEADER */}
            <section className="compare-header">

              <div>
                <p className="compare-breadcrumb">
                  WORKSPACE / COMPARE
                </p>

                <h1>Compare herbs</h1>
              </div>

              <button
                className="add-herb-button"
                type="button"
                onClick={handleAddHerb}
              >
                + Add herb
              </button>

            </section>

            {/* INFORMATION BANNER */}
            <div className="compare-info-banner">

              <span className="compare-info-icon">
                ♧
              </span>

              <span>
                Compare two or more Ayurvedic herb profiles side by side.
              </span>

            </div>

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
                  Select two or more herbs to compare their classical
                  properties side by side.
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
                INCOMPLETE SELECTION
                ========================================= */}

            {selectedHerbs.length === 1 && (
              <section className="compare-incomplete-state">

                <div className="compare-selected-preview">

                  <div className="comparison-herb-icon">
                    🍃
                  </div>

                  <div>
                    <h2>
                      {selectedHerbs[0].name}
                    </h2>

                    <em>
                      {selectedHerbs[0].scientificName}
                    </em>
                  </div>

                </div>

                <div className="compare-incomplete-message">
                  <strong>
                    Select at least one more herb
                  </strong>

                  <p>
                    Choose another herb to start the comparison.
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
                      minWidth: `${145 + selectedHerbs.length * 280}px`,
                    }}
                  >

                    {/* HERB HEADER ROW */}
                    <div
                      className="comparison-row comparison-header-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>ATTRIBUTE</strong>
                        <span>Ayurvedic profile</span>
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
                              onClick={() => removeHerb(herb.id)}
                            >
                              × Remove
                            </button>

                          </div>

                          <h2>
                            {herb.name}
                          </h2>

                          <em>
                            {herb.scientificName}
                          </em>

                        </div>
                      ))}

                    </div>

                    {/* DOSHA */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>DOSHA</strong>
                        <span>Dosha affinity</span>
                      </div>

                      {selectedHerbs.map((herb) => (
                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.dosha || "—"}
                        </div>
                      ))}

                    </div>

                    {/* DHATU */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>DHATU</strong>
                        <span>Tissue affinity</span>
                      </div>

                      {selectedHerbs.map((herb) => (
                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.dhatu || "—"}
                        </div>
                      ))}

                    </div>

                    {/* RASA */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>RASA</strong>
                        <span>Taste</span>
                      </div>

                      {selectedHerbs.map((herb) => (
                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.rasa || "—"}
                        </div>
                      ))}

                    </div>

                    {/* GUNA */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>GUNA</strong>
                        <span>Qualities</span>
                      </div>

                      {selectedHerbs.map((herb) => (
                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.guna || "—"}
                        </div>
                      ))}

                    </div>

                    {/* VIRYA */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>VIRYA</strong>
                        <span>Potency</span>
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

                    {/* VIPAKA */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>VIPAKA</strong>
                        <span>Post-digestive effect</span>
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

                    {/* KARMA */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>KARMA</strong>
                        <span>Actions</span>
                      </div>

                      {selectedHerbs.map((herb) => (
                        <div
                          className="comparison-value"
                          key={herb.id}
                        >
                          {herb.karma || "—"}
                        </div>
                      ))}

                    </div>

                    {/* STATUS */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
                      }}
                    >

                      <div className="comparison-attribute">
                        <strong>STATUS</strong>
                        <span>Verification</span>
                      </div>

                      {selectedHerbs.map((herb) => (
                        <div
                          className="comparison-value"
                          key={herb.id}
                        >

                          <span className="comparison-status">
                            {herb.status || "Draft"}
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