import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/ManageHerbs.css"

function ManageHerbs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDosha, setSelectedDosha] = useState("")
  const [selectedRasa, setSelectedRasa] = useState("")
  const [selectedSrotas, setSelectedSrotas] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  
  const navigate = useNavigate()

  const [herbs, setHerbs] = useState([])

  useEffect(() => {
    const savedHerbs = JSON.parse(
      localStorage.getItem("herbs") || "[]"
    )
  
    setHerbs(savedHerbs)
  }, [])

  const normalizedHerbs = herbs.map((herb) => {
    const dosha = []
  
    if (herb.dosha?.vata) {
      dosha.push(`Vata ${herb.dosha.vata}`)
    }
  
    if (herb.dosha?.pitta) {
      dosha.push(`Pitta ${herb.dosha.pitta}`)
    }
  
    if (herb.dosha?.kapha) {
      dosha.push(`Kapha ${herb.dosha.kapha}`)
    }
  
    return {
      id: herb.id,
      name: herb.herbNameEnglish || "Unnamed Herb",
      botanical: herb.botanicalName || "—",
      rasa: Array.isArray(herb.rasa) ? herb.rasa : [],
      virya: herb.virya || "—",
      vipaka: herb.vipaka || "—",
      dosha,
      srotas: Array.isArray(herb.srotas) ? herb.srotas : [],
      status: herb.verificationStatus || "Draft",
      updated: herb.savedAt
        ? new Date(herb.savedAt).toLocaleDateString()
        : "—",
      updatedBy: "Admin"
    }
  })
  
  const filteredHerbs = normalizedHerbs.filter((herb) => {
    const matchesSearch =
      herb.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  
    const matchesDosha =
      selectedDosha === "" ||
      herb.dosha.some((item) =>
        item.toLowerCase().startsWith(selectedDosha)
      )
  
    const matchesRasa =
      selectedRasa === "" ||
      herb.rasa.some((item) =>
        item.toLowerCase() === selectedRasa
      )
  
    const matchesSrotas =
      selectedSrotas === "" ||
      herb.srotas.some((item) =>
        item.toLowerCase() === selectedSrotas
      )
  
    const matchesStatus =
      selectedStatus === "All" ||
      herb.status === selectedStatus
  
    return (
      matchesSearch &&
      matchesDosha &&
      matchesRasa &&
      matchesSrotas &&
      matchesStatus
    )
  })

  const handleHerbAction = (herbId, action) => {
    if (action === "view") {
      navigate(`/admin/add-herb?id=${herbId}&mode=view`)
    }
  
    if (action === "edit") {
      navigate(`/admin/add-herb?id=${herbId}&mode=edit`)
    }
  
    if (action === "review") {
      navigate(`/admin/add-herb?id=${herbId}&mode=review`)
    }
  }
  
  return (
    <>
      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="manage-herbs-page-heading">

        <div>
          <h1>Manage Herbs</h1>

          <p>
            Review, update, verify, and maintain the Ayurvedic herb
            knowledge base.
          </p>
        </div>

        <button
        type="button"
        className="manage-herbs-add-button"
        onClick={() => navigate("/admin/add-herb")}
        > + Add New Herb
        </button>

      </div>


{/* =========================
    SEARCH + FILTERS
========================= */}

<section className="manage-herbs-filter-card">

  <div className="manage-herbs-search-box">

    <span>⌕</span>

    <input
      type="text"
      placeholder="Search herbs..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
    />

  </div>

  <div className="manage-herbs-filter-button">
  <select
    value={selectedDosha}
    onChange={(event) => setSelectedDosha(event.target.value)}
  >
    <option value="">All Dosha</option>
    <option value="vata">Vata</option>
    <option value="pitta">Pitta</option>
    <option value="kapha">Kapha</option>
  </select>
</div>
  

<div className="manage-herbs-filter-button">
  <select
    value={selectedRasa}
    onChange={(event) => setSelectedRasa(event.target.value)}
  >
    <option value="">All Rasa</option>
    <option value="madhura">Madhura</option>
    <option value="katu">Katu</option>
    <option value="tikta">Tikta</option>
    <option value="amla">Amla</option>
  </select>
</div>
  

<div className="manage-herbs-filter-button">
  <select
    value={selectedSrotas}
    onChange={(event) => setSelectedSrotas(event.target.value)}
  >
    <option value="">All Srotas</option>
    <option value="pranavaha">Pranavaha</option>
    <option value="rasavaha">Rasavaha</option>
    <option value="mamsavaha">Mamsavaha</option>
  </select>
</div>
 

<span className="manage-herbs-count">
  {filteredHerbs.length} herbs
</span>

</section>

      {/* =========================
          STATUS TABS
      ========================= */}
      <div className="manage-herbs-status-tabs">

<button
  type="button"
  className={`manage-herbs-status-tab ${
    selectedStatus === "All" ? "active" : ""
  }`}
  onClick={() => setSelectedStatus("All")}
>
  All
</button>

<button
  type="button"
  className={`manage-herbs-status-tab ${
    selectedStatus === "Verified" ? "active" : ""
  }`}
  onClick={() => setSelectedStatus("Verified")}
>
  Verified
</button>

<button
  type="button"
  className={`manage-herbs-status-tab ${
    selectedStatus === "Reviewed" ? "active" : ""
  }`}
  onClick={() => setSelectedStatus("Reviewed")}
>
  Reviewed
</button>

<button
  type="button"
  className={`manage-herbs-status-tab ${
    selectedStatus === "Draft" ? "active" : ""
  }`}
  onClick={() => setSelectedStatus("Draft")}
>
  Draft
</button>

</div>


      {/* =========================
          HERB TABLE
      ========================= */}

      <section className="manage-herbs-table-card">

        <div className="manage-herbs-table-wrapper">

          <table className="manage-herbs-table">

            <thead>

              <tr>
                <th>HERB</th>
                <th>BOTANICAL NAME</th>
                <th>RASA</th>
                <th>VIRYA</th>
                <th>VIPAKA</th>
                <th>DOSHA</th>
                <th>STATUS</th>
                <th>LAST UPDATED</th>
                <th>UPDATED BY</th>
                <th>ACTION</th>
              </tr>

            </thead>

            <tbody>
  {filteredHerbs.length > 0 ? (
    filteredHerbs.map((herb) => (
      <tr key={herb.id || herb.name}>

        <td>
          <strong>{herb.name}</strong>
        </td>

        <td>{herb.botanical}</td>

        <td>{herb.rasa.join(", ")}</td>

        <td>{herb.virya}</td>

        <td>{herb.vipaka}</td>

        <td>{herb.dosha.join(", ")}</td>

        <td>{herb.status}</td>

        <td>{herb.updated}</td>

        <td>{herb.updatedBy}</td>

        <td>
  <div className="manage-herbs-actions">

    <button
      type="button"
      className="manage-herbs-action-button"
      title="View herb"
      onClick={() => handleHerbAction(herb.id, "view")}
    >
      👁
    </button>

    <button
      type="button"
      className="manage-herbs-action-button"
      title="Edit herb"
      onClick={() => handleHerbAction(herb.id, "edit")}
    >
      ✎
    </button>

    <button
      type="button"
      className="manage-herbs-action-button"
      title="Review herb"
      onClick={() => handleHerbAction(herb.id, "review")}
    >
      ✓
    </button>

    <button
      type="button"
      className="manage-herbs-action-button"
      title="More actions"
    >
      ⋯
    </button>

  </div>
</td>

      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="10"
        className="manage-herbs-empty-state"
      >
        <div>
          <strong>No herbs found</strong>
          <p>
            Add a new herb to start building the Ayurvedic
            knowledge base.
          </p>
        </div>
      </td>
    </tr>
  )}
</tbody>
          </table>

        </div>

      </section>
    </>
  )
}

export default ManageHerbs