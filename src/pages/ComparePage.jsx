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

    const updatedHerbs = [...selectedHerbs, herb]

    setSelectedHerbs(updatedHerbs)

    localStorage.setItem(
      "selectedCompareHerbs",
      JSON.stringify(updatedHerbs)
    )
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

            {/* HERB SELECTOR */}

<section className="compare-herb-selector">

<div className="compare-selector-header">

  <div>
    <p className="compare-selector-label">
      SELECTED HERBS ({selectedHerbs.length}/{MAX_COMPARE_HERBS})
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
          onClick={() => toggleCompareHerb(herb)}
        >
          {herb.name}
          <span>×</span>
        </button>
      ))}

    </div>
  </div>

</div>


<div className="compare-available-herbs">

  {availableHerbs.map((herb) => {
    const isSelected = selectedHerbs.some(
      (selectedHerb) => selectedHerb.id === herb.id
    )

    const maxReached =
      selectedHerbs.length >= MAX_COMPARE_HERBS &&
      !isSelected

    return (
      <button
        key={herb.id}
        type="button"
        className={`compare-herb-option ${
          isSelected ? "selected" : ""
        } ${maxReached ? "disabled" : ""}`}
        onClick={() => toggleCompareHerb(herb)}
        disabled={maxReached}
      >
        {herb.name}
      </button>
    )
  })}

</div>


<p className="compare-selector-hint">
  Select up to 4 herbs. Choose at least 2 herbs to compare.
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

const MAX_COMPARE_HERBS = 4

const availableHerbs = [
  {
    id: 1,
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    dosha: "Vata ↓ · Kapha ↓",
    dhatu: "Mamsa · Majja",
    rasa: "Bitter · Sweet",
    guna: "Light · Unctuous",
    virya: "Heating",
    vipaka: "Sweet",
    karma: "Balya · Rasayana",
    status: "Verified",
  },
  {
    id: 2,
    name: "Guduchi",
    scientificName: "Tinospora cordifolia",
    dosha: "Tridoshic",
    dhatu: "Rasa · Rakta",
    rasa: "Bitter",
    guna: "Light · Unctuous",
    virya: "Heating",
    vipaka: "Sweet",
    karma: "Rasayana",
    status: "Verified",
  },
  {
    id: 3,
    name: "Shatavari",
    scientificName: "Asparagus racemosus",
    dosha: "Vata ↓ · Pitta ↓",
    dhatu: "Rasa · Shukra",
    rasa: "Sweet · Bitter",
    guna: "Heavy · Unctuous",
    virya: "Cooling",
    vipaka: "Sweet",
    karma: "Rasayana",
    status: "Reviewed",
  },
  {
    id: 4,
    name: "Tulsi",
    scientificName: "Ocimum tenuiflorum",
    dosha: "Kapha ↓ · Vata ↓",
    dhatu: "Rasa · Rakta",
    rasa: "Pungent",
    guna: "Light · Dry",
    virya: "Heating",
    vipaka: "Pungent",
    karma: "Deepana · Pachana",
    status: "Verified",
  },
  {
    id: 5,
    name: "Yashtimadhu",
    scientificName: "Glycyrrhiza glabra",
    dosha: "Vata ↓ · Pitta ↓",
    dhatu: "Rasa · Rakta",
    rasa: "Sweet",
    guna: "Heavy · Unctuous",
    virya: "Cooling",
    vipaka: "Sweet",
    karma: "Brimhana · Rasayana",
    status: "Reviewed",
  },
  {
    id: 6,
    name: "Neem",
    scientificName: "Azadirachta indica",
    dosha: "Pitta ↓ · Kapha ↓",
    dhatu: "Rakta · Mamsa",
    rasa: "Bitter · Astringent",
    guna: "Light · Dry",
    virya: "Cooling",
    vipaka: "Pungent",
    karma: "Krimighna · Kandughna",
    status: "Verified",
  },
  {
    id: 7,
    name: "Haritaki",
    scientificName: "Terminalia chebula",
    dosha: "Tridoshic · Vata ↓",
    dhatu: "Rasa · Mamsa",
    rasa: "Astringent · Sweet",
    guna: "Light · Dry",
    virya: "Heating",
    vipaka: "Sweet",
    karma: "Rasayana · Anulomana",
    status: "Verified",
  },
  {
    id: 8,
    name: "Amalaki",
    scientificName: "Phyllanthus emblica",
    dosha: "Tridoshic · Pitta ↓",
    dhatu: "Rasa · Rakta",
    rasa: "Sour · Sweet",
    guna: "Light · Dry",
    virya: "Cooling",
    vipaka: "Sweet",
    karma: "Rasayana · Chakshushya",
    status: "Verified",
  },
  {
    id: 9,
    name: "Turmeric",
    scientificName: "Curcuma longa",
    dosha: "Kapha ↓ · Vata ↓",
    dhatu: "Rakta · Mamsa",
    rasa: "Bitter · Pungent",
    guna: "Light · Dry",
    virya: "Heating",
    vipaka: "Pungent",
    karma: "Kaphaghna · Varnya",
    status: "Verified",
  },
]

export default ComparePage