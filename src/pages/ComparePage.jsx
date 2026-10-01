import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/ComparePage.css"

const MAX_COMPARE_HERBS = 4

const availableHerbs = [
  {
    id: "HERB_REC_0001",
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    description:
      "A grounding Rasayana traditionally used to support strength, restorative sleep, and balanced energy.",
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
    id: "HERB_REC_0002",
    name: "Guduchi",
    scientificName: "Tinospora cordifolia",
    description:
      "A rejuvenating vine traditionally used in Rasayana and digestive-supportive applications.",
    dosha: "Tridoshic",
    dhatu: "Rasa · Rakta",
    rasa: "Bitter",
    guna: "Light · Unctuous",
    virya: "Heating",
    vipaka: "Sweet",
    karma: "Rasayana · Deepana",
    status: "Verified",
  },

  {
    id: "HERB_REC_0003",
    name: "Shatavari",
    scientificName: "Asparagus racemosus",
    description:
      "A nourishing root traditionally associated with hydration, vitality, and reproductive tissues.",
    dosha: "Vata ↓ · Pitta ↓",
    dhatu: "Rasa · Rakta · Shukra",
    rasa: "Sweet · Bitter",
    guna: "Heavy · Unctuous",
    virya: "Cooling",
    vipaka: "Sweet",
    karma: "Rasayana · Stanyajanana",
    status: "Reviewed",
  },

  {
    id: "HERB_REC_0004",
    name: "Tulsi",
    scientificName: "Ocimum tenuiflorum",
    description:
      "An aromatic leaf traditionally used to support clear breathing, digestion, and mental clarity.",
    dosha: "Kapha ↓ · Vata ↓",
    dhatu: "Rasa · Rakta",
    rasa: "Pungent · Bitter",
    guna: "Light · Dry",
    virya: "Heating",
    vipaka: "Pungent",
    karma: "Deepana · Kaphaghna",
    status: "Verified",
  },

  {
    id: "HERB_REC_0005",
    name: "Yashtimadhu",
    scientificName: "Glycyrrhiza glabra",
    description:
      "A soothing root traditionally valued for nourishing the voice, stomach, and respiratory tissues.",
    dosha: "Vata ↓ · Pitta ↓",
    dhatu: "Rasa · Rakta · Shukra",
    rasa: "Sweet",
    guna: "Heavy · Unctuous",
    virya: "Cooling",
    vipaka: "Sweet",
    karma: "Rasayana · Varnya",
    status: "Reviewed",
  },

  {
    id: "HERB_REC_0006",
    name: "Neem",
    scientificName: "Azadirachta indica",
    description:
      "A cooling bitter herb traditionally used in cleansing protocols and support for clear skin.",
    dosha: "Pitta ↓ · Kapha ↓",
    dhatu: "Rakta · Mamsa",
    rasa: "Bitter · Astringent",
    guna: "Light · Dry",
    virya: "Cooling",
    vipaka: "Pungent",
    karma: "Krimighna · Kusthaghna",
    status: "Verified",
  },

  {
    id: "HERB_REC_0007",
    name: "Haritaki",
    scientificName: "Terminalia chebula",
    description:
      "A classical herb traditionally used to support digestion, elimination, and Rasayana purposes.",
    dosha: "Tridoshic · Vata ↓",
    dhatu: "Rasa · Rakta · Mamsa",
    rasa: "Astringent · Five tastes except Salt",
    guna: "Light · Dry",
    virya: "Heating",
    vipaka: "Sweet",
    karma: "Anulomana · Rasayana",
    status: "Verified",
  },

  {
    id: "HERB_REC_0008",
    name: "Amalaki",
    scientificName: "Phyllanthus emblica",
    description:
      "A potent Rasayana traditionally used for nourishment, vitality, and tissue support.",
    dosha: "Tridoshic · Pitta ↓",
    dhatu: "Rasa · Rakta · Shukra",
    rasa: "Sour · Sweet · Bitter · Astringent · Pungent",
    guna: "Light · Dry",
    virya: "Cooling",
    vipaka: "Sweet",
    karma: "Rasayana · Vayasthapana",
    status: "Verified",
  },

  {
    id: "HERB_REC_0009",
    name: "Turmeric",
    scientificName: "Curcuma longa",
    description:
      "A classical herb traditionally used for its cleansing, tissue-supportive, and balancing properties.",
    dosha: "Kapha ↓ · Vata ↓",
    dhatu: "Rakta · Mamsa",
    rasa: "Bitter · Pungent",
    guna: "Light · Dry",
    virya: "Heating",
    vipaka: "Pungent",
    karma: "Kaphaghna · Krimighna",
    status: "Verified",
  },
]

function ComparePage() {
  const navigate = useNavigate()

  const [selectedHerbs, setSelectedHerbs] = useState([])

  // Load previously selected herbs
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
      console.error("Unable to load comparison herbs:", error)
      setSelectedHerbs([])
    }
  }, [])

  // Open Herb Library
  const handleAddHerb = () => {
    navigate("/herb-library")
  }

  // Add/remove herb from comparison
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

  // Remove one herb
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

  // Clear complete comparison
  const clearComparison = () => {
    setSelectedHerbs([])
    localStorage.removeItem("selectedCompareHerbs")
  }

  const formatDosha = (dosha) => {
    if (!dosha) return "—"
  
    return [
      dosha.vata && `Vata: ${dosha.vata}`,
      dosha.pitta && `Pitta: ${dosha.pitta}`,
      dosha.kapha && `Kapha: ${dosha.kapha}`,
    ]
      .filter(Boolean)
      .join(" · ")
  }
  
  const formatDhatu = (dhatu) => {
    if (!dhatu) return "—"
  
    return [
      dhatu.rasa && `Rasa: ${dhatu.rasa}`,
      dhatu.rakta && `Rakta: ${dhatu.rakta}`,
      dhatu.mamsa && `Mamsa: ${dhatu.mamsa}`,
      dhatu.meda && `Meda: ${dhatu.meda}`,
      dhatu.asthi && `Asthi: ${dhatu.asthi}`,
      dhatu.majja && `Majja: ${dhatu.majja}`,
      dhatu.shukra && `Shukra: ${dhatu.shukra}`,
    ]
      .filter(Boolean)
      .join(" · ")
  }
  
  const formatMala = (mala) => {
    if (!mala) return "—"
  
    return [
      mala.purisha && `Purisha: ${mala.purisha}`,
      mala.mutra && `Mutra: ${mala.mutra}`,
      mala.sweda && `Sweda: ${mala.sweda}`,
    ]
      .filter(Boolean)
      .join(" · ")
  }
  
  const formatSrotas = (srotas) => {
    if (!srotas) return "—"
  
    return Object.entries(srotas)
      .filter(([, value]) => value && value !== "—")
      .map(([key, value]) => `${key}: ${value}`)
      .join(" · ") || "—"
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
                    SELECTED HERBS ({selectedHerbs.length}/
                    {MAX_COMPARE_HERBS})
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
                    (selectedHerb) =>
                      selectedHerb.id === herb.id
                  )

                  const maxReached =
                    selectedHerbs.length >=
                      MAX_COMPARE_HERBS &&
                    !isSelected

                  return (
                    <button
                      key={herb.id}
                      type="button"
                      className={`compare-herb-option ${
                        isSelected ? "selected" : ""
                      } ${
                        maxReached ? "disabled" : ""
                      }`}
                      onClick={() =>
                        toggleCompareHerb(herb)
                      }
                      disabled={maxReached}
                    >
                      {herb.name}
                    </button>
                  )
                })}

              </div>

              <p className="compare-selector-hint">
                Select up to 4 herbs. Choose at least 2 herbs
                to compare.
              </p>

            </section>

            {/* EMPTY STATE */}
            {selectedHerbs.length === 0 && (
              <section className="compare-empty-state">

                <div className="compare-empty-icon">
                  ♧
                </div>

                <h2>
                  Compare Ayurvedic herbs
                </h2>

                <p>
                  Select two or more herbs to compare their
                  classical properties side by side.
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

            {/* ONE HERB SELECTED */}
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

            {/* COMPARISON */}
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

                    {/* HERB HEADER */}
                    <div
                      className="comparison-row comparison-header-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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
                              onClick={() =>
                                removeHerb(herb.id)
                              }
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
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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
                          {formatDosha(herb.dosha)}
                        </div>
                      ))}

                    </div>

                    {/* DHATU */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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
                          {formatDhatu(herb.dhatu)}
                        </div>
                      ))}

                    </div>

                    {/* MALA */}
<div
  className="comparison-row"
  style={{
    gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
  }}
>
  <div className="comparison-attribute">
    <strong>MALA</strong>
    <span>Waste products</span>
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

{/* SROTAS */}
<div
  className="comparison-row"
  style={{
    gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
  }}
>
  <div className="comparison-attribute">
    <strong>SROTAS</strong>
    <span>Channel affinity</span>
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

                    {/* RASA */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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
                          {herb.importantKarma || "—"}
                          {herb.otherKarma || "—"}

                        </div>


                      ))}

                    </div>

                    {/* MAJOR DISEASES */}
<div
  className="comparison-row"
  style={{
    gridTemplateColumns: `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
  }}
>
  <div className="comparison-attribute">
    <strong>INDICATIONS</strong>
    <span>Major diseases</span>
  </div>

  {selectedHerbs.map((herb) => (
    <div
      className="comparison-value"
      key={herb.id}
    >
      {herb.majorDiseases || "—"}
    </div>
  ))}
</div>

                    {/* STATUS */}
                    <div
                      className="comparison-row"
                      style={{
                        gridTemplateColumns:
                          `145px repeat(${selectedHerbs.length}, minmax(0, 1fr))`,
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