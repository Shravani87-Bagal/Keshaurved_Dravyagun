import { useState } from "react"
import "../styles/VocabularyManagement.css"

function VocabularyManagement() {

  const [activeCategory, setActiveCategory] = useState("Rasa")
  const [isAddTermOpen, setIsAddTermOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingTermId, setEditingTermId] = useState(null)
  const [mergingTerm, setMergingTerm] = useState(null)
  const [mergeTargetId, setMergeTargetId] = useState("")

  const [termForm, setTermForm] = useState({
  category: "Rasa",
  term: "",
  sanskrit: "",
  english: "",
  description: "",
  status: "Active"
})

  const categories = [
    "Rasa",
    "Guna",
    "Virya",
    "Vipaka",
    "Dhatu",
    "Mala",
    "Srotas",
  ]

  const [vocabularyData, setVocabularyData] = useState(() => {
    const savedVocabulary = JSON.parse(
      localStorage.getItem("vocabulary") || "[]"
    )
  
    return savedVocabulary
  })

  const filteredData = vocabularyData.filter((item) => {
    const matchesCategory = item.category === activeCategory
  
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sanskrit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.english.toLowerCase().includes(searchTerm.toLowerCase())
  
    return matchesCategory && matchesSearch
  })

  const mergeTargetOptions = vocabularyData.filter(
    (item) =>
      mergingTerm &&
      item.category === mergingTerm.category &&
      item.id !== mergingTerm.id &&
      item.status === "Active"
  )

  const handleTermChange = (event) => {
    const { name, value } = event.target
  
    setTermForm((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  const handleAddTerm = (event) => {
    event.preventDefault()
  
    const cleanedTerm = termForm.term.trim()
    const normalizedTerm = cleanedTerm.toLowerCase()
  
    if (!cleanedTerm) {
      alert("Please enter the vocabulary term.")
      return
    }
  
    const duplicateTerm = vocabularyData.some(
      (item) =>
        item.id !== editingTermId &&
        item.category === termForm.category &&
        item.term.trim().toLowerCase() === normalizedTerm
    )
  
    if (duplicateTerm) {
      alert(
        `"${cleanedTerm}" already exists in ${termForm.category}.`
      )
      return
    }
  
    if (editingTermId) {
      const updatedVocabulary = vocabularyData.map((item) => {
        if (item.id !== editingTermId) {
          return item
        }
  
        return {
          ...item,
          term: cleanedTerm,
          sanskrit: termForm.sanskrit.trim(),
          english: termForm.english.trim(),
          category: termForm.category,
          description: termForm.description.trim(),
          status: termForm.status,
          updatedAt: new Date().toISOString()
        }
      })
  
      setVocabularyData(updatedVocabulary)
  
      localStorage.setItem(
        "vocabulary",
        JSON.stringify(updatedVocabulary)
      )
  
      setActiveCategory(termForm.category)
      setEditingTermId(null)
      setIsAddTermOpen(false)
  
      setTermForm({
        category: termForm.category,
        term: "",
        sanskrit: "",
        english: "",
        description: "",
        status: "Active"
      })
  
      alert("Vocabulary term updated successfully.")
  
      return
    }
  
    const newTerm = {
      id: Date.now().toString(),
      term: cleanedTerm,
      sanskrit: termForm.sanskrit.trim(),
      english: termForm.english.trim(),
      category: termForm.category,
      description: termForm.description.trim(),
      usage: 0,
      status: termForm.status,
      createdAt: new Date().toISOString()
    }
  
    const updatedVocabulary = [
      ...vocabularyData,
      newTerm
    ]
  
    setVocabularyData(updatedVocabulary)
  
    localStorage.setItem(
      "vocabulary",
      JSON.stringify(updatedVocabulary)
    )
  
    setActiveCategory(termForm.category)
    setIsAddTermOpen(false)
  
    setTermForm({
      category: termForm.category,
      term: "",
      sanskrit: "",
      english: "",
      description: "",
      status: "Active"
    })
  
    alert("Vocabulary term added successfully.")
  }

  const handleStatusChange = (termId) => {
    const updatedVocabulary = vocabularyData.map((item) => {
      if (item.id !== termId) {
        return item
      }

      return {
        ...item,
        status: item.status === "Active"
          ? "Inactive"
          : "Active"
      }
    })

    setVocabularyData(updatedVocabulary)

    localStorage.setItem(
      "vocabulary",
      JSON.stringify(updatedVocabulary)
    )
  }

  const handleDeleteTerm = (termId) => {
    const termToDelete = vocabularyData.find(
      (item) => item.id === termId
    )
  
    if (!termToDelete) {
      return
    }
  
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete "${termToDelete.term}"?\n\nThis action cannot be undone.`
    )
  
    if (!confirmDelete) {
      return
    }
  
    const updatedVocabulary = vocabularyData.filter(
      (item) => item.id !== termId
    )
  
    setVocabularyData(updatedVocabulary)
  
    localStorage.setItem(
      "vocabulary",
      JSON.stringify(updatedVocabulary)
    )
  
    alert(`"${termToDelete.term}" was permanently deleted.`)
  }

  const handleEditTerm = (termId) => {
    const termToEdit = vocabularyData.find(
      (item) => item.id === termId
    )
  
    if (!termToEdit) {
      return
    }
  
    setTermForm({
      category: termToEdit.category,
      term: termToEdit.term,
      sanskrit: termToEdit.sanskrit,
      english: termToEdit.english,
      description: termToEdit.description,
      status: termToEdit.status
    })
  
    setEditingTermId(termId)
    setIsAddTermOpen(true)
  }
  const handleMergeTerms = () => {
    if (!mergingTerm || !mergeTargetId) {
      alert("Please select a target term.")
      return
    }
  
    const targetTerm = vocabularyData.find(
      (item) => item.id === mergeTargetId
    )
  
    if (!targetTerm) {
      alert("Target term not found.")
      return
    }
  
    if (mergingTerm.category !== targetTerm.category) {
      alert("Terms must belong to the same category.")
      return
    }
  
    const updatedVocabulary = vocabularyData.map((item) => {
      if (item.id === targetTerm.id) {
        return {
          ...item,
          usage: Number(item.usage || 0) + Number(mergingTerm.usage || 0)
        }
      }
  
      if (item.id === mergingTerm.id) {
        return {
          ...item,
          status: "Inactive",
          mergedInto: targetTerm.id,
          mergedIntoTerm: targetTerm.term
        }
      }
  
      return item
    })
  
    setVocabularyData(updatedVocabulary)
  
    localStorage.setItem(
      "vocabulary",
      JSON.stringify(updatedVocabulary)
    )
  
    setMergingTerm(null)
    setMergeTargetId("")
  
    alert(
      `"${mergingTerm.term}" was merged into "${targetTerm.term}".`
    )
  }

  const handleOpenMerge = (termId) => {
    const termToMerge = vocabularyData.find(
      (item) => item.id === termId
    )
  
    if (!termToMerge) {
      return
    }
  
    setMergingTerm(termToMerge)
  }

  return (
    <div className="vocabulary-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="vocabulary-page-header">

        <div>

          <p className="vocabulary-label">
            KNOWLEDGE MANAGEMENT
          </p>

          <h1>
            Vocabulary Management
          </h1>

          <p className="vocabulary-description">
            Maintain standardized Ayurvedic terms and searchable values.
          </p>

        </div>

        <button
        type="button"
        className="vocabulary-add-button"
        onClick={() => {
          setEditingTermId(null)
        
          setTermForm({
            category: activeCategory,
            term: "",
            sanskrit: "",
            english: "",
            description: "",
            status: "Active"
          })
        
          setIsAddTermOpen(true)
        }}
>
          <span>＋</span>
          Add Term
        </button>

      </div>


      {/* =========================================
          CATEGORY TABS
      ========================================= */}

      <div className="vocabulary-category-tabs">

        {categories.map((category) => (

          <button
            key={category}
            type="button"
            className={`vocabulary-category-tab ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(category)
              setSearchTerm("")
            }}
          >
            {category}
          </button>

        ))}

      </div>


      {/* =========================================
          SEARCH + TERM COUNT
      ========================================= */}

      <section className="vocabulary-table-card">

        <div className="vocabulary-search-row">

        <div className="vocabulary-search-box">
          <span>⌕</span>
          <input
          type="text"
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          />
          </div>

          <span className="vocabulary-term-count">
            {filteredData.length} terms in {activeCategory}
          </span>

        </div>


        {/* =========================================
            TABLE
        ========================================= */}

        <div className="vocabulary-table-wrapper">

          <table className="vocabulary-table">

            <thead>

              <tr>
                <th>TERM</th>
                <th>SANSKRIT</th>
                <th>ENGLISH</th>
                <th>CATEGORY</th>
                <th>DESCRIPTION</th>
                <th>USAGE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>

            </thead>


            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map((item) => (

                  <tr key={item.term}>

                    <td className="vocabulary-term">
                      {item.term}
                    </td>

                    <td className="vocabulary-sanskrit">
                      {item.sanskrit}
                    </td>

                    <td>
                      {item.english}
                    </td>

                    <td>
                      <span className="vocabulary-category-badge">
                        {item.category}
                      </span>
                    </td>

                    <td className="vocabulary-description-cell">
                      {item.description}
                    </td>

                    <td className="vocabulary-usage">
                      {item.usage}
                    </td>

                    <td>
                      <span
                      className={`vocabulary-status ${
                        item.status === "Active"
                         ? "active"
                         : "inactive"
                         }`}
                          >
                             {item.status}
                             </span>
                             
                          </td>

                    <td>

                      <div className="vocabulary-actions">

                      <button
                       type="button"
                       className="vocabulary-action-button"
                       title="Edit"
                        onClick={() => handleEditTerm(item.id)}
                        > ✎
                        </button>

                        <button
                        type="button"
                        className="vocabulary-action-text"
                        onClick={() => handleOpenMerge(item.id)}>
                           Merge
                        </button>

                        <button
                        type="button"
                        className="vocabulary-action-text"
                        onClick={() => handleStatusChange(item.id)}
                        >
                          {item.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                          </button>

                          <button
                          type="button"
                          className="vocabulary-action-delete"
                          onClick={() => handleDeleteTerm(item.id)}>
                            Delete
                          </button>

                      </div>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="vocabulary-empty-state"
                  >
                    No vocabulary terms available for {activeCategory}.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

      {
      isAddTermOpen && (
  <div className="vocabulary-modal-overlay">
    <div className="vocabulary-modal">

      <div className="vocabulary-modal-header">
        <div>
          <p className="vocabulary-modal-label">
            KNOWLEDGE MANAGEMENT
          </p>

          <h2>
            {editingTermId
            ? "Edit Vocabulary Term"
            : "Add Vocabulary Term"}
            </h2>

          <p>
            Add a standardized term to the Ayurvedic knowledge vocabulary.
          </p>
        </div>

        <button
          type="button"
          className="vocabulary-modal-close"
          onClick={() => {
            setIsAddTermOpen(false)
            setEditingTermId(null)
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <form
        className="vocabulary-term-form"
        onSubmit={handleAddTerm}
      >

        <div className="vocabulary-form-field">
          <label htmlFor="vocabulary-category">
            Category
          </label>

          <select
            id="vocabulary-category"
            name="category"
            value={termForm.category}
            onChange={handleTermChange}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>


        <div className="vocabulary-form-field">
          <label htmlFor="vocabulary-term">
            Term <span>*</span>
          </label>

          <input
            id="vocabulary-term"
            name="term"
            type="text"
            value={termForm.term}
            onChange={handleTermChange}
            placeholder="e.g. Madhura"
          />
        </div>


        <div className="vocabulary-form-row">

          <div className="vocabulary-form-field">
            <label htmlFor="vocabulary-sanskrit">
              Sanskrit
            </label>

            <input
              id="vocabulary-sanskrit"
              name="sanskrit"
              type="text"
              value={termForm.sanskrit}
              onChange={handleTermChange}
              placeholder="e.g. मधुर"
            />
          </div>


          <div className="vocabulary-form-field">
            <label htmlFor="vocabulary-english">
              English
            </label>

            <input
              id="vocabulary-english"
              name="english"
              type="text"
              value={termForm.english}
              onChange={handleTermChange}
              placeholder="e.g. Sweet"
            />
          </div>

        </div>


        <div className="vocabulary-form-field">
          <label htmlFor="vocabulary-description">
            Description
          </label>

          <textarea
            id="vocabulary-description"
            name="description"
            value={termForm.description}
            onChange={handleTermChange}
            placeholder="Describe the meaning or clinical relevance of this term..."
            rows="4"
          />
        </div>


        <div className="vocabulary-form-field">
          <label htmlFor="vocabulary-status">
            Status
          </label>

          <select
            id="vocabulary-status"
            name="status"
            value={termForm.status}
            onChange={handleTermChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>


        <div className="vocabulary-modal-actions">

          <button
            type="button"
            className="vocabulary-cancel-button"
            onClick={() => {
              setIsAddTermOpen(false)
              setEditingTermId(null)
            }}
          >
            Cancel
          </button>

          <button
          type="submit"
          className="vocabulary-save-button">
            {editingTermId ? "Save Changes" : "Add Term"}
            </button>

        </div>
      </form>
    </div>
  </div>
)}

{mergingTerm && (
  <div className="vocabulary-modal-overlay">
    <div className="vocabulary-modal">

      <div className="vocabulary-modal-header">
        <div>
          <p className="vocabulary-modal-label">
            KNOWLEDGE MANAGEMENT
          </p>

          <h2>
            Merge Vocabulary Term
          </h2>

          <p>
            Merge a duplicate or equivalent term into a standardized vocabulary term.
          </p>
        </div>

        <button
          type="button"
          className="vocabulary-modal-close"
          onClick={() => {
            setMergingTerm(null)
            setMergeTargetId("")
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="vocabulary-merge-content">

        <div className="vocabulary-merge-source">
          <span className="vocabulary-merge-label">
            SOURCE TERM
          </span>

          <strong>
            {mergingTerm.term}
          </strong>

          <span>
            {mergingTerm.category}
          </span>

          <small>
            Current usage: {mergingTerm.usage}
          </small>
        </div>

        <div className="vocabulary-merge-arrow">
          ↓
        </div>

        <div className="vocabulary-form-field">
          <label htmlFor="merge-target">
            Merge into
          </label>

          <select
            id="merge-target"
            value={mergeTargetId}
            onChange={(event) =>
              setMergeTargetId(event.target.value)
            }
          >
            <option value="">
              Select target term
            </option>

            {mergeTargetOptions.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.term}
              </option>
            ))}
          </select>
        </div>

        {mergeTargetId && (
          <div className="vocabulary-merge-target-preview">
            {(() => {
              const targetTerm = vocabularyData.find(
                (item) => item.id === mergeTargetId
              )

              if (!targetTerm) {
                return null
              }

              return (
                <>
                  <span className="vocabulary-merge-label">
                    TARGET TERM
                  </span>

                  <strong>
                    {targetTerm.term}
                  </strong>

                  <span>
                    {targetTerm.category}
                  </span>

                  <small>
                    Current usage: {targetTerm.usage}
                  </small>
                </>
              )
            })()}
          </div>
        )}

        <div className="vocabulary-merge-warning">
          <strong>
            What will happen?
          </strong>

          <p>
            The source term will become inactive and its usage will be
            combined with the selected target term.
          </p>
        </div>

        <div className="vocabulary-modal-actions">

          <button
            type="button"
            className="vocabulary-cancel-button"
            onClick={() => {
              setMergingTerm(null)
              setMergeTargetId("")
            }}
          >
            Cancel
          </button>

          <button
          type="button"
          className="vocabulary-save-button"
          disabled={!mergeTargetId}
          onClick={handleMergeTerms} >
            Merge Terms
          </button>

        </div>

      </div>

    </div>
  </div>
)}

    </div>
  )
}

export default VocabularyManagement