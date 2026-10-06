import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addAuditLog } from "../utils/auditLogger"
import "../styles/ManageHerbs.css"

function ManageHerbs() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDosha, setSelectedDosha] = useState("")
  const [selectedRasa, setSelectedRasa] = useState("")
  const [selectedGuna, setSelectedGuna] = useState("")
  const [selectedSrotas, setSelectedSrotas] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")

  const [herbs, setHerbs] = useState([])

  /* =========================================================
     LOAD HERBS
  ========================================================= */

  useEffect(() => {
    loadHerbs()
  }, [])

  const loadHerbs = () => {
    try {
      const savedHerbs = JSON.parse(
        localStorage.getItem("herbs") || "[]"
      )

      setHerbs(Array.isArray(savedHerbs) ? savedHerbs : [])
    } catch {
      setHerbs([])
    }
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  const toArray = (value) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean)
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }

    return []
  }

  const getDisplayDate = (herb) => {
    const dateValue =
      herb.updatedAt ||
      herb.savedAt ||
      herb.createdAt ||
      herb.lastUpdated

    if (!dateValue) {
      return "—"
    }

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
      return "—"
    }

    return date.toLocaleDateString()
  }

  const getUpdatedBy = (herb) => {
    return (
      herb.updatedBy ||
      herb.lastUpdatedBy ||
      herb.createdBy ||
      "Admin"
    )
  }

  /* =========================================================
     DOSHA NORMALIZATION
  ========================================================= */

  const getDoshaValues = (herb) => {
    const values = []

    if (herb.dosha && typeof herb.dosha === "object") {
      if (herb.dosha.vata) {
        values.push(`Vata ${herb.dosha.vata}`)
      }

      if (herb.dosha.pitta) {
        values.push(`Pitta ${herb.dosha.pitta}`)
      }

      if (herb.dosha.kapha) {
        values.push(`Kapha ${herb.dosha.kapha}`)
      }
    }

    if (Array.isArray(herb.dosha)) {
      values.push(...herb.dosha)
    }

    if (typeof herb.dosha === "string") {
      values.push(...toArray(herb.dosha))
    }

    if (Array.isArray(herb.doshaAffinity)) {
      values.push(...herb.doshaAffinity)
    }

    return [...new Set(values.filter(Boolean))]
  }

  /* =========================================================
     NORMALIZE HERB DATA
  ========================================================= */

  const normalizedHerbs = useMemo(() => {
    return herbs.map((herb, index) => {
      const rasa = toArray(herb.rasa)
      const guna = toArray(herb.guna)
      const srotas = toArray(herb.srotas)

      const dhatu = toArray(
        herb.dhatu ||
        herb.dhatuAffinity
      )

      const mala = toArray(
        herb.mala ||
        herb.malaAffinity
      )

      const karma = toArray(
        herb.karma ||
        herb.therapeuticActions
      )

      const indications = toArray(
        herb.indications ||
        herb.therapeuticIndications ||
        herb.mainIndications
      )

      const dosha = getDoshaValues(herb)

      return {
        ...herb,

        id:
          herb.id ||
          `herb-${index}`,

        name:
          herb.herbNameEnglish ||
          herb.englishName ||
          herb.commonName ||
          herb.name ||
          "Unnamed Herb",

        botanical:
          herb.botanicalName ||
          herb.botanical_name ||
          "—",

        sanskrit:
          herb.sanskritName ||
          herb.ayurvedicName ||
          herb.sanskrit_name ||
          "—",

        family:
          herb.family ||
          "—",

        rasa,

        guna,

        virya:
          herb.virya ||
          "—",

        vipaka:
          herb.vipaka ||
          "—",

        prabhava:
          toArray(
            herb.prabhava ||
            herb.prabhav
          ),

        dosha,

        dhatu,

        mala,

        srotas,

        avayava:
          toArray(
            herb.avayava ||
            herb.organ ||
            herb.organAffinity
          ),

        karma,

        indications,

        status:
          herb.verificationStatus ||
          "Draft",

        updated:
          getDisplayDate(herb),

        updatedBy:
          getUpdatedBy(herb),
      }
    })
  }, [herbs])

  /* =========================================================
     DYNAMIC FILTER OPTIONS
     ========================================================= */

  const uniqueValues = (items) => {
    return [
      ...new Set(
        items
          .flat()
          .filter(Boolean)
          .map((item) => String(item).trim())
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      a.localeCompare(b)
    )
  }

  const rasaOptions = useMemo(
    () =>
      uniqueValues(
        normalizedHerbs.map(
          (herb) => herb.rasa
        )
      ),
    [normalizedHerbs]
  )

  const gunaOptions = useMemo(
    () =>
      uniqueValues(
        normalizedHerbs.map(
          (herb) => herb.guna
        )
      ),
    [normalizedHerbs]
  )

  const srotasOptions = useMemo(
    () =>
      uniqueValues(
        normalizedHerbs.map(
          (herb) => herb.srotas
        )
      ),
    [normalizedHerbs]
  )

  const doshaOptions = [
    "Vata",
    "Pitta",
    "Kapha",
  ]

  /* =========================================================
     FILTER HERBS
  ========================================================= */

  const filteredHerbs = useMemo(() => {
    const query =
      searchTerm
        .trim()
        .toLowerCase()

    return normalizedHerbs.filter((herb) => {
      /* SEARCH */

      const searchableText = [
        herb.name,
        herb.botanical,
        herb.sanskrit,
        herb.family,
        ...herb.rasa,
        ...herb.guna,
        ...herb.dosha,
        ...herb.dhatu,
        ...herb.mala,
        ...herb.srotas,
        ...herb.avayava,
        ...herb.karma,
        ...herb.indications,
      ]
        .join(" ")
        .toLowerCase()

      const matchesSearch =
        !query ||
        searchableText.includes(query)

      /* DOSHA */

      const matchesDosha =
        selectedDosha === "" ||
        herb.dosha.some((item) =>
          item
            .toLowerCase()
            .startsWith(
              selectedDosha.toLowerCase()
            )
        )

      /* RASA */

      const matchesRasa =
        selectedRasa === "" ||
        herb.rasa.some(
          (item) =>
            item.toLowerCase() ===
            selectedRasa.toLowerCase()
        )

      /* GUNA */

      const matchesGuna =
        selectedGuna === "" ||
        herb.guna.some(
          (item) =>
            item.toLowerCase() ===
            selectedGuna.toLowerCase()
        )

      /* SROTAS */

      const matchesSrotas =
        selectedSrotas === "" ||
        herb.srotas.some(
          (item) =>
            item.toLowerCase() ===
            selectedSrotas.toLowerCase()
        )

      /* STATUS */

      const matchesStatus =
        selectedStatus === "All" ||
        herb.status === selectedStatus

      return (
        matchesSearch &&
        matchesDosha &&
        matchesRasa &&
        matchesGuna &&
        matchesSrotas &&
        matchesStatus
      )
    })
  }, [
    normalizedHerbs,
    searchTerm,
    selectedDosha,
    selectedRasa,
    selectedGuna,
    selectedSrotas,
    selectedStatus,
  ])

  /* =========================================================
     HERB ACTIONS
  ========================================================= */

  const handleHerbAction = (
    herbId,
    action
  ) => {
    if (!herbId) {
      return
    }

    if (action === "view") {
      navigate(
        `/admin/add-herb?id=${herbId}&mode=view`
      )
    }

    if (action === "edit") {
      navigate(
        `/admin/add-herb?id=${herbId}&mode=edit`
      )
    }

    if (action === "review") {
      navigate(
        `/admin/add-herb?id=${herbId}&mode=review`
      )
    }
  }

  /* =========================================================
     DELETE HERB
  ========================================================= */

  const handleDeleteHerb = (herbId) => {
    if (!herbId) {
      return
    }

    const herbToDelete =
      normalizedHerbs.find(
        (herb) =>
          herb.id === herbId
      )

    if (!herbToDelete) {
      return
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${herbToDelete.name}"?\n\nThis will remove the herb entry from the current admin dataset.`
      )

    if (!confirmed) {
      return
    }

    const updatedHerbs =
      herbs.filter(
        (herb, index) =>
          (herb.id || `herb-${index}`) !==
          herbId
      )
      localStorage.setItem(
        "herbs",
        JSON.stringify(updatedHerbs)
      )
      
      setHerbs(updatedHerbs)
      
      addAuditLog({
        action: "Deleted",
        module: "Herb",
        item: herbToDelete.name,
        previous: `Status: ${herbToDelete.status}`,
        newValue: "Deleted",
      })
  }

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDosha("")
    setSelectedRasa("")
    setSelectedGuna("")
    setSelectedSrotas("")
    setSelectedStatus("All")
  }

  /* =========================================================
     STATUS COUNT
  ========================================================= */

  const getStatusCount = (status) => {
    if (status === "All") {
      return normalizedHerbs.length
    }

    return normalizedHerbs.filter(
      (herb) =>
        herb.status === status
    ).length
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          PAGE HEADING
      ===================================================== */}

      <div className="manage-herbs-page-heading">

        <div>
          <h1>
            Manage Herbs
          </h1>

          <p>
            Review, update, verify, and maintain
            the Ayurvedic herb knowledge base.
          </p>
        </div>

        <button
          type="button"
          className="manage-herbs-add-button"
          onClick={() =>
            navigate("/admin/add-herb")
          }
        >
          + Add New Herb
        </button>

      </div>


      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <section className="manage-herbs-filter-card">

        {/* SEARCH */}

        <div className="manage-herbs-search-box">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by herb, botanical name, Sanskrit name..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        {/* DOSHA */}

        <div className="manage-herbs-filter-button">

          <select
            value={selectedDosha}
            onChange={(event) =>
              setSelectedDosha(
                event.target.value
              )
            }
          >

            <option value="">
              All Dosha
            </option>

            {doshaOptions.map(
              (dosha) => (
                <option
                  key={dosha}
                  value={dosha}
                >
                  {dosha}
                </option>
              )
            )}

          </select>

        </div>


        {/* RASA */}

        <div className="manage-herbs-filter-button">

          <select
            value={selectedRasa}
            onChange={(event) =>
              setSelectedRasa(
                event.target.value
              )
            }
          >

            <option value="">
              All Rasa
            </option>

            {rasaOptions.map(
              (rasa) => (
                <option
                  key={rasa}
                  value={rasa}
                >
                  {rasa}
                </option>
              )
            )}

          </select>

        </div>


        {/* GUNA */}

        <div className="manage-herbs-filter-button">

          <select
            value={selectedGuna}
            onChange={(event) =>
              setSelectedGuna(
                event.target.value
              )
            }
          >

            <option value="">
              All Guna
            </option>

            {gunaOptions.map(
              (guna) => (
                <option
                  key={guna}
                  value={guna}
                >
                  {guna}
                </option>
              )
            )}

          </select>

        </div>


        {/* SROTAS */}

        <div className="manage-herbs-filter-button">

          <select
            value={selectedSrotas}
            onChange={(event) =>
              setSelectedSrotas(
                event.target.value
              )
            }
          >

            <option value="">
              All Srotas
            </option>

            {srotasOptions.map(
              (srotas) => (
                <option
                  key={srotas}
                  value={srotas}
                >
                  {srotas}
                </option>
              )
            )}

          </select>

        </div>


        {/* RESULT COUNT */}

        <span className="manage-herbs-count">
          {filteredHerbs.length}{" "}
          {filteredHerbs.length === 1
            ? "herb"
            : "herbs"}
        </span>

      </section>


      {/* =====================================================
          STATUS TABS
      ===================================================== */}

      <div className="manage-herbs-status-tabs">

        <button
          type="button"
          className={`manage-herbs-status-tab ${
            selectedStatus === "All"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedStatus("All")
          }
        >
          All
          <span>
            {getStatusCount("All")}
          </span>
        </button>


        <button
          type="button"
          className={`manage-herbs-status-tab ${
            selectedStatus === "Verified"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedStatus("Verified")
          }
        >
          Verified
          <span>
            {getStatusCount("Verified")}
          </span>
        </button>


        <button
          type="button"
          className={`manage-herbs-status-tab ${
            selectedStatus === "Reviewed"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedStatus("Reviewed")
          }
        >
          Reviewed
          <span>
            {getStatusCount("Reviewed")}
          </span>
        </button>


        <button
          type="button"
          className={`manage-herbs-status-tab ${
            selectedStatus === "Draft"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedStatus("Draft")
          }
        >
          Draft
          <span>
            {getStatusCount("Draft")}
          </span>
        </button>

      </div>


      {/* =====================================================
          CLEAR FILTERS
      ===================================================== */}

      {(searchTerm ||
        selectedDosha ||
        selectedRasa ||
        selectedGuna ||
        selectedSrotas ||
        selectedStatus !== "All") && (

        <div className="manage-herbs-active-filters">

          <span>
            Filters applied
          </span>

          <button
            type="button"
            onClick={clearFilters}
          >
            Clear filters
          </button>

        </div>

      )}


      {/* =====================================================
          HERB TABLE
      ===================================================== */}

      <section className="manage-herbs-table-card">

        <div className="manage-herbs-table-wrapper">

          <table className="manage-herbs-table">

            <thead>

              <tr>

                <th>
                  HERB
                </th>

                <th>
                  BOTANICAL NAME
                </th>

                <th>
                  RASA
                </th>

                <th>
                  GUNA
                </th>

                <th>
                  VIRYA
                </th>

                <th>
                  VIPAKA
                </th>

                <th>
                  DOSHA
                </th>

                <th>
                  SROTAS
                </th>

                <th>
                  STATUS
                </th>

                <th>
                  LAST UPDATED
                </th>

                <th>
                  UPDATED BY
                </th>

                <th>
                  ACTION
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredHerbs.length > 0 ? (

                filteredHerbs.map(
                  (herb) => (

                    <tr
                      key={
                        herb.id ||
                        herb.name
                      }
                    >

                      {/* HERB */}

                      <td>

                        <strong>
                          {herb.name}
                        </strong>

                        {herb.sanskrit !== "—" && (
                          <small>
                            {herb.sanskrit}
                          </small>
                        )}

                      </td>


                      {/* BOTANICAL */}

                      <td>
                        <em>
                          {herb.botanical}
                        </em>
                      </td>


                      {/* RASA */}

                      <td>
                        {herb.rasa.length > 0
                          ? herb.rasa.join(", ")
                          : "—"}
                      </td>


                      {/* GUNA */}

                      <td>
                        {herb.guna.length > 0
                          ? herb.guna.join(", ")
                          : "—"}
                      </td>


                      {/* VIRYA */}

                      <td>
                        {herb.virya}
                      </td>


                      {/* VIPAKA */}

                      <td>
                        {herb.vipaka}
                      </td>


                      {/* DOSHA */}

                      <td>
                        {herb.dosha.length > 0
                          ? herb.dosha.join(", ")
                          : "—"}
                      </td>


                      {/* SROTAS */}

                      <td>
                        {herb.srotas.length > 0
                          ? herb.srotas.join(", ")
                          : "—"}
                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`manage-herbs-status-badge status-${String(
                            herb.status
                          )
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                        >
                          {herb.status}
                        </span>

                      </td>


                      {/* LAST UPDATED */}

                      <td>
                        {herb.updated}
                      </td>


                      {/* UPDATED BY */}

                      <td>
                        {herb.updatedBy}
                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="manage-herbs-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            className="manage-herbs-action-button"
                            title="View herb"
                            aria-label="View herb"
                            onClick={() =>
                              handleHerbAction(
                                herb.id,
                                "view"
                              )
                            }
                          >
                            👁
                          </button>


                          {/* EDIT */}

                          <button
                            type="button"
                            className="manage-herbs-action-button"
                            title="Edit herb"
                            aria-label="Edit herb"
                            onClick={() =>
                              handleHerbAction(
                                herb.id,
                                "edit"
                              )
                            }
                          >
                            ✎
                          </button>


                          {/* REVIEW */}

                          <button
                            type="button"
                            className="manage-herbs-action-button"
                            title="Review herb"
                            aria-label="Review herb"
                            onClick={() =>
                              handleHerbAction(
                                herb.id,
                                "review"
                              )
                            }
                          >
                            ✓
                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            className="manage-herbs-action-button manage-herbs-delete-button"
                            title="Delete herb"
                            aria-label="Delete herb"
                            onClick={() =>
                              handleDeleteHerb(
                                herb.id
                              )
                            }
                          >
                            🗑
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="12"
                    className="manage-herbs-empty-state"
                  >

                    <div>

                      <strong>
                        No herbs found
                      </strong>

                      <p>
                        No herb matches the
                        current search or
                        filters.
                      </p>

                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                      >
                        Clear filters
                      </button>

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