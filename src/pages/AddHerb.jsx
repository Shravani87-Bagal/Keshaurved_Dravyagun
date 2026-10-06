import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import "../styles/AddHerb.css"

function AddHerb() {
  const navigate = useNavigate()
  const imageInputRef = useRef(null)
  const [searchParams] = useSearchParams()

  const selectedHerbId = searchParams.get("id")
  const mode = searchParams.get("mode") || "add"

  const isViewMode = mode === "view"
  const isEditMode = mode === "edit"
  const isReviewMode = mode === "review"

  const [openSection, setOpenSection] = useState(null)

  const [rasaVocabulary, setRasaVocabulary] = useState([])
  const [gunaVocabulary, setGunaVocabulary] = useState([])

  const [isAddRasaTermOpen, setIsAddRasaTermOpen] = useState(false)
  const [isAddGunaTermOpen, setIsAddGunaTermOpen] = useState(false)

  const [rasaTermForm, setRasaTermForm] = useState({
    term: "",
    english: "",
    description: "",
  })

  const [gunaTermForm, setGunaTermForm] = useState({
    term: "",
    english: "",
    description: "",
  })

  const [imageName, setImageName] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [herbId, setHerbId] = useState("")

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    herbNameEnglish: "",
    sanskritName: "",
    commonNames: "",
    botanicalName: "",
    family: "",

    plantDescription: "",
    partUsed: "",
    identificationNotes: "",

    rasa: [],
    guna: [],
    virya: "",
    vipaka: "",
    prabhava: "",
    dosha: {
      vata: "",
      pitta: "",
      kapha: "",
    },

    doshaNotes: "",

    dhatu: {
      rasa: "",
      rakta: "",
      mamsa: "",
      meda: "",
      asthi: "",
      majja: "",
      shukra: "",
    },

    mala: {
      purisha: "",
      mutra: "",
      sweda: "",
    },

    srotas: {
      pranavaha: "",
      udakavaha: "",
      annavaha: "",
      rasavaha: "",
      raktavaha: "",
      mamsavaha: "",
      medovaha: "",
      asthivaha: "",
      majjavaha: "",
      shukravaha: "",
      mutravaha: "",
      purishavaha: "",
      swedavaha: "",
      artavavaha: "",
      stanyavaha: "",
    },

    importantKarma: "",
    otherKarma: "",
    therapeuticActions: "",
    clinicalIndications: "",
    majorDiseases: "",

    classicalReferences: [
      {
        source: "",
        chapter: "",
        verse: "",
        notes: "",
      },
    ],

    verificationStatus: "Draft",
    verificationHistory: [],
  })

  // =====================================================
  // SECTIONS
  // =====================================================

  const sections = [
    {
      number: "01",
      title: "Basic Information",
      description: "Enter the primary identity of the herb.",
    },
    {
      number: "02",
      title: "Identification",
      description: "Add botanical and plant identification information.",
    },
    {
      number: "03",
      title: "Rasa",
      description: "Select all applicable Rasa values.",
    },
    {
      number: "04",
      title: "Guna",
      description: "Select all applicable Guna values.",
    },
    {
      number: "05",
      title: "Virya",
      description: "Select the potency of the herb.",
    },
    {
      number: "06",
      title: "Vipaka",
      description: "Select the post-digestive taste.",
    },
    {
      number: "07",
      title: "Prabhava",
      description: "Add the distinctive action of the herb.",
    },
    {
      number: "08",
      title: "Dosha Affinity",
      description: "Specify the effect on Vata, Pitta and Kapha.",
    },
    {
      number: "09",
      title: "Dhatu Affinity",
      description: "Assign a 0–5 affinity score to each Dhatu.",
    },
    {
      number: "10",
      title: "Mala Affinity",
      description: "Assign a 0–5 affinity score to each Mala.",
    },
    {
      number: "11",
      title: "Srotas Affinity",
      description: "Assign a 0–5 affinity score to each Srotas.",
    },
    {
      number: "12",
      title: "Karma & Clinical Information",
      description: "Add Karma, diseases and clinical information.",
    },
    {
      number: "13",
      title: "Classical References",
      description: "Add supporting Ayurvedic references.",
    },
  ]

  // =====================================================
  // STATIC DATA
  // =====================================================

  const viryaOptions = [
    "Ushna",
    "Sheeta",
  ]

  const vipakaOptions = [
    "Madhura",
    "Amla",
    "Katu",
  ]

  const doshaOptions = [
    {
      value: "Decreases",
      label: "Decreases",
    },
    {
      value: "Increases",
      label: "Increases",
    },
    {
      value: "Neutral",
      label: "Neutral",
    },
  ]

  const dhatuOptions = [
    { key: "rasa", label: "Rasa (Plasma)" },
    { key: "rakta", label: "Rakta (Blood)" },
    { key: "mamsa", label: "Mamsa (Muscle)" },
    { key: "meda", label: "Meda (Fat)" },
    { key: "asthi", label: "Asthi (Bone)" },
    { key: "majja", label: "Majja (Marrow)" },
    { key: "shukra", label: "Shukra (Reproductive)" },
  ]

  const malaOptions = [
    { key: "purisha", label: "Purisha (Feces)" },
    { key: "mutra", label: "Mutra (Urine)" },
    { key: "sweda", label: "Sweda (Sweat)" },
  ]

  const srotasOptions = [
    { key: "pranavaha", label: "Pranavaha Srotas" },
    { key: "udakavaha", label: "Udakavaha Srotas" },
    { key: "annavaha", label: "Annavaha Srotas" },
    { key: "rasavaha", label: "Rasavaha Srotas" },
    { key: "raktavaha", label: "Raktavaha Srotas" },
    { key: "mamsavaha", label: "Mamsavaha Srotas" },
    { key: "medovaha", label: "Medovaha Srotas" },
    { key: "asthivaha", label: "Asthivaha Srotas" },
    { key: "majjavaha", label: "Majjavaha Srotas" },
    { key: "shukravaha", label: "Shukravaha Srotas" },
    { key: "mutravaha", label: "Mutravaha Srotas" },
    { key: "purishavaha", label: "Purishavaha Srotas" },
    { key: "swedavaha", label: "Swedavaha Srotas" },
    { key: "artavavaha", label: "Artavavaha Srotas" },
    { key: "stanyavaha", label: "Stanyavaha Srotas" },
  ]

  const affinityScores = [
    { value: "", label: "Not specified" },
    { value: "0", label: "0 — None" },
    { value: "1", label: "1 — Very low" },
    { value: "2", label: "2 — Low" },
    { value: "3", label: "3 — Moderate" },
    { value: "4", label: "4 — High" },
    { value: "5", label: "5 — Very high" },
  ]

  // =====================================================
  // HELPERS
  // =====================================================

  const toggleSection = (sectionNumber) => {
    setOpenSection(
      openSection === sectionNumber ? null : sectionNumber
    )
  }

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleDoshaChange = (dosha, value) => {
    setFormData((previous) => ({
      ...previous,
      dosha: {
        ...previous.dosha,
        [dosha]: value,
      },
    }))
  }

  const handleAffinityChange = (group, key, value) => {
    setFormData((previous) => ({
      ...previous,
      [group]: {
        ...previous[group],
        [key]: value,
      },
    }))
  }

  const handleMultiSelect = (field, value) => {
    setFormData((previous) => {
      const currentValues = previous[field] || []

      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return {
        ...previous,
        [field]: updatedValues,
      }
    })
  }

  const handleReferenceChange = (index, field, value) => {
    setFormData((previous) => {
      const updatedReferences = [
        ...previous.classicalReferences,
      ]

      updatedReferences[index] = {
        ...updatedReferences[index],
        [field]: value,
      }

      return {
        ...previous,
        classicalReferences: updatedReferences,
      }
    })
  }

  const addReference = () => {
    setFormData((previous) => ({
      ...previous,
      classicalReferences: [
        ...previous.classicalReferences,
        {
          source: "",
          chapter: "",
          verse: "",
          notes: "",
        },
      ],
    }))
  }

  // =====================================================
  // VOCABULARY
  // =====================================================

  useEffect(() => {
    const savedVocabulary = JSON.parse(
      localStorage.getItem("vocabulary") || "[]"
    )

    setRasaVocabulary(
      savedVocabulary.filter(
        (item) =>
          item.category === "Rasa" &&
          item.status === "Active"
      )
    )

    setGunaVocabulary(
      savedVocabulary.filter(
        (item) =>
          item.category === "Guna" &&
          item.status === "Active"
      )
    )
  }, [selectedHerbId])

  const addVocabularyTerm = (
    category,
    termForm,
    setTermForm,
    closeModal,
    setVocabulary,
    field
  ) => {
    const cleanedTerm = termForm.term.trim()

    if (!cleanedTerm) {
      alert(`Please enter the ${category} term.`)
      return
    }

    const savedVocabulary = JSON.parse(
      localStorage.getItem("vocabulary") || "[]"
    )

    const duplicate = savedVocabulary.some(
      (item) =>
        item.category === category &&
        item.term?.trim().toLowerCase() ===
          cleanedTerm.toLowerCase()
    )

    if (duplicate) {
      alert(
        `"${cleanedTerm}" already exists in ${category} vocabulary.`
      )
      return
    }

    const newTerm = {
      id: Date.now().toString(),
      term: cleanedTerm,
      sanskrit: cleanedTerm,
      english: termForm.english.trim(),
      description: termForm.description.trim(),
      category,
      usage: 0,
      status: "Active",
      createdAt: new Date().toISOString(),
    }

    const updatedVocabulary = [
      ...savedVocabulary,
      newTerm,
    ]

    localStorage.setItem(
      "vocabulary",
      JSON.stringify(updatedVocabulary)
    )

    setVocabulary((previous) => [
      ...previous,
      newTerm,
    ])

    setFormData((previous) => ({
      ...previous,
      [field]: previous[field].includes(cleanedTerm)
        ? previous[field]
        : [...previous[field], cleanedTerm],
    }))

    setTermForm({
      term: "",
      english: "",
      description: "",
    })

    closeModal()

    alert(
      `"${cleanedTerm}" was added to ${category} vocabulary.`
    )
  }

  // =====================================================
  // IMAGE
  // =====================================================

  const processImageFile = (file) => {
    if (!file) return

    const allowedTypes = [
      "image/png",
      "image/jpeg",
    ]

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PNG or JPG/JPEG image.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.")
      return
    }

    setImageName(file.name)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageChange = (event) => {
    processImageFile(event.target.files?.[0])
  }

  const handleImageDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleImageDragLeave = () => {
    setIsDragging(false)
  }

  const handleImageDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)

    processImageFile(event.dataTransfer.files?.[0])
  }

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // =====================================================
  // LOAD EXISTING HERB
  // =====================================================

  useEffect(() => {
    if (!selectedHerbId) return

    const savedHerbs = JSON.parse(
      localStorage.getItem("herbs") || "[]"
    )

    const selectedHerb = savedHerbs.find(
      (herb) => herb.id === selectedHerbId
    )

    if (!selectedHerb) return
    setHerbId(selectedHerb.id)

    setFormData((previous) => ({
      ...previous,
      ...selectedHerb,
      dosha: {
        ...previous.dosha,
        ...(selectedHerb.dosha || {}),
      },
      dhatu: {
        ...previous.dhatu,
        ...(selectedHerb.dhatu || {}),
      },
      mala: {
        ...previous.mala,
        ...(selectedHerb.mala || {}),
      },
      srotas: {
        ...previous.srotas,
        ...(selectedHerb.srotas || {}),
      },
      classicalReferences:
        selectedHerb.classicalReferences?.length
          ? selectedHerb.classicalReferences
          : previous.classicalReferences,
      verificationHistory:
        selectedHerb.verificationHistory || [],
    }))

    if (selectedHerb.imageName) {
      setImageName(selectedHerb.imageName)
    }
  }, [selectedHerbId])

  // =====================================================
  // VERIFICATION HISTORY
  // =====================================================

  const getCurrentReviewer = () => {
    const savedUser = localStorage.getItem("herbUser")

    if (!savedUser) {
      return "Admin"
    }

    try {
      const user = JSON.parse(savedUser)
      return (
        user.fullName ||
        user.email ||
        "Admin"
      )
    } catch {
      return "Admin"
    }
  }

  const createHistoryEntry = (
    previousStatus,
    newStatus
  ) => {
    return {
      id: Date.now().toString(),
      previousStatus:
        previousStatus || "New",
      newStatus,
      changedBy: getCurrentReviewer(),
      changedAt: new Date().toISOString(),
    }
  }

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = (action) => {
    const currentId =
      herbId || `HERB_${Date.now()}`

    let nextStatus =
      formData.verificationStatus

    if (action === "draft") {
      nextStatus = "Draft"
    }

    if (action === "review") {
      nextStatus = "Reviewed"
    }

    if (action === "verify") {
      nextStatus = "Verified"
    }

    const previousStatus =
      formData.verificationStatus

    let updatedHistory =
      formData.verificationHistory || []

    if (previousStatus !== nextStatus) {
      updatedHistory = [
        ...updatedHistory,
        createHistoryEntry(
          previousStatus,
          nextStatus
        ),
      ]
    }

    const now = new Date().toISOString()

    const herbData = {
      id: currentId,
      ...formData,

      verificationStatus: nextStatus,

      verificationHistory:
        updatedHistory,

      imageName,

      savedAt: now,
      updatedAt: now,
    }

    const existingHerbs = JSON.parse(
      localStorage.getItem("herbs") || "[]"
    )

    const existingIndex =
      existingHerbs.findIndex(
        (herb) => herb.id === currentId
      )

    if (existingIndex !== -1) {
      existingHerbs[existingIndex] =
        herbData
    } else {
      existingHerbs.push(herbData)
    }

    localStorage.setItem(
      "herbs",
      JSON.stringify(existingHerbs)
    )

    setHerbId(currentId)

    setFormData((previous) => ({
      ...previous,
      verificationStatus: nextStatus,
      verificationHistory:
        updatedHistory,
    }))

    if (action === "draft") {
      alert("Herb saved as draft.")
      return
    }

    if (action === "review") {
      alert("Herb submitted for review.")
      return
    }

    if (action === "verify") {
      alert("Herb marked as verified.")
      return
    }

    if (action === "save") {
      alert("Information saved successfully.")
      return
    }

    if (action === "submit") {
      alert("Herb saved successfully.")
      navigate("/admin/manage-herbs")
    }
  }

  const handleCancel = () => {
    navigate("/admin/manage-herbs")
  }

  // =====================================================
  // VERIFICATION DISPLAY
  // =====================================================

  const history =
    formData.verificationHistory || []

  const reviewedEntry =
    [...history]
      .reverse()
      .find(
        (item) =>
          item.newStatus === "Reviewed"
      )

  const verifiedEntry =
    [...history]
      .reverse()
      .find(
        (item) =>
          item.newStatus === "Verified"
      )

  const lastHistoryEntry =
    history.length > 0
      ? history[history.length - 1]
      : null

  const formatDate = (date) => {
    if (!date) return "—"

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      )
    } catch {
      return "—"
    } }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="add-herb-page">

      {/* HEADER */}

      <div className="add-herb-page-header">

        <div>
          <p className="add-herb-label">
            HERB KNOWLEDGE BASE
          </p>

          <h1>
            {isViewMode
              ? "View Herb"
              : isEditMode
              ? "Edit Herb"
              : isReviewMode
              ? "Review Herb"
              : "Add New Herb"}
          </h1>

          <p className="add-herb-description">
            {isViewMode
              ? "Review the complete Ayurvedic herb profile in read-only mode."
              : isEditMode
              ? "Update the Ayurvedic herb profile and save changes."
              : isReviewMode
              ? "Review the herb information and update its verification status."
              : "Create a structured Ayurvedic herb profile for the knowledge base."}
          </p>
        </div>

        <div className="add-herb-header-actions">

          <button
            type="button"
            className="add-herb-cancel-button"
            onClick={handleCancel}
          >
            {isViewMode
              ? "Close"
              : "Cancel"}
          </button>

          {!isViewMode &&
            !isReviewMode && (
              <button
                type="button"
                className="add-herb-draft-button"
                onClick={() =>
                  handleSave("draft")
                }
              >
                Save Draft
              </button>
            )}

          {!isViewMode && (
            <button
              type="button"
              className="add-herb-submit-button"
              onClick={() =>
                isReviewMode
                  ? handleSave("review")
                  : handleSave("submit")
              }
            >
              {isReviewMode
                ? "Save Review"
                : "Save & Submit"}
            </button>
          )}

        </div>
      </div>


      {/* IMAGE */}

      <section className="add-herb-image-card">

        <h2>Herb Image</h2>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <div
          className={`add-herb-upload-area ${
            isDragging ? "dragging" : ""
          } ${
            imagePreview ? "has-image" : ""
          }`}
          onClick={() =>
            imageInputRef.current?.click()
          }
          onDragOver={handleImageDragOver}
          onDragLeave={handleImageDragLeave}
          onDrop={handleImageDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              imageInputRef.current?.click()
            }  }}
        >

          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Selected herb"
                className="add-herb-image-preview"
              />

              <h3 className="add-herb-image-file-name">
                {imageName}
              </h3>

              <p className="add-herb-image-change">
                Click or drag another image to replace
              </p>
            </>
          ) : (
            <>
              <div className="add-herb-upload-icon">
                ⇧
              </div>

              <h3>
                Drag & drop herb image or browse files
              </h3>

              <p>
                PNG, JPG or JPEG · Max 5 MB
              </p>
            </>
          )}
        </div>

      </section>

      {/* HERB SECTIONS */}

      <fieldset
        className={`add-herb-sections ${
          isViewMode || isReviewMode
            ? "read-only-mode"
            : ""
        }`}
      >
        {sections.map((section) => (

          <div
            className={`add-herb-section ${
              openSection === section.number
                ? "open"
                : ""
            }`}
            key={section.number}
          >

            <button
              type="button"
              className="add-herb-section-header"
              onClick={() =>
                toggleSection(section.number)
              }
            >

              <div className="add-herb-section-title">

                <span className="add-herb-section-number">
                  {section.number}
                </span>

                <span>
                  Section{" "}
                  {parseInt(section.number)} —{" "}
                  {section.title}
                </span>

              </div>

              <span className="add-herb-section-arrow">
                {openSection === section.number
                  ? "⌃"
                  : "›"}
              </span>

            </button>

            {openSection === section.number && (

              <div className="add-herb-section-body">

                {/* 01 BASIC */}

                {section.number === "01" && (
                  <div className="add-herb-basic-grid">

                    {[
                      [
                        "herbNameEnglish",
                        "Herb Name (English)",
                        "e.g., Guduchi",
                      ],
                      [
                        "sanskritName",
                        "Sanskrit Name",
                        "e.g., Guduchi",
                      ],
                      [
                        "commonNames",
                        "Common / Local Names",
                        "Separate multiple with commas",
                      ],
                      [
                        "botanicalName",
                        "Botanical Name",
                        "e.g., Tinospora cordifolia",
                      ],
                      [
                        "family",
                        "Family",
                        "e.g., Menispermaceae",
                      ],
                      [
                        "partUsed",
                        "Part Used",
                        "e.g., Stem",
                      ],
                    ].map(
                      ([
                        field,
                        label,
                        placeholder,
                      ]) => (

                        <div
                          className="add-herb-field"
                          key={field}
                        >

                          <label htmlFor={field}>
                            {label}
                          </label>

                          <input
                            id={field}
                            type="text"
                            value={
                              formData[field]
                            }
                            onChange={(event) =>
                              handleInputChange(
                                field,
                                event.target.value
                              )
                            }
                            placeholder={
                              placeholder
                            }
                          />
                        </div>
                      )
                    )}
                  </div>
                )}


                {/* 02 IDENTIFICATION */}

                {section.number === "02" && (

                  <div className="add-herb-identification-fields">
                    <div className="add-herb-field">

                      <label>
                        Plant Description
                      </label>

                      <textarea
                        value={
                          formData.plantDescription
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "plantDescription",
                            event.target.value
                          )
                        }
                        placeholder="Morphological description..."
                      />
                    </div>

                    <div className="add-herb-field">

                      <label>
                        Identification Notes
                      </label>

                      <textarea
                        value={
                          formData.identificationNotes
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "identificationNotes",
                            event.target.value
                          )
                        }
                        placeholder="Key distinguishing features..."
                      />
                    </div>
                  </div>
                )}

                {/* 03 RASA */}

                {section.number === "03" && (

                  <div className="add-herb-selection-section">

                    <p className="add-herb-selection-description">
                      Select all applicable Rasa values from Vocabulary.
                    </p>

                    <div className="add-herb-option-grid">

                      {rasaVocabulary.length > 0 ? (
                        rasaVocabulary.map((item) => (

                          <label
                            className="add-herb-option-card"
                            key={item.id}
                          >

                            <input
                              type="checkbox"
                              checked={formData.rasa.includes(
                                item.term
                              )}
                              onChange={() =>
                                handleMultiSelect(
                                  "rasa",
                                  item.term
                                )
                              }
                            />

                            <span>
                              {item.term}

                              {item.english
                                ? ` (${item.english})`
                                : ""}
                            </span>
                          </label>

                        ))
                      ) : (
                        <p className="add-herb-empty-message">
                          No active Rasa terms are available.
                        </p>
                      )}

                    </div>

                    {!isViewMode &&
                      !isReviewMode && (
                        <button
                          type="button"
                          className="add-herb-add-term-button"
                          onClick={() =>
                            setIsAddRasaTermOpen(true)
                          }
                        >
                          ＋ Add new Rasa term
                        </button>
                      )}
                  </div>
                )}


                {/* 04 GUNA */}

                {section.number === "04" && (
                  <div className="add-herb-selection-section">

                    <p className="add-herb-selection-description">
                      Select all applicable Guna values from Vocabulary.
                    </p>

                    <div className="add-herb-option-grid">

                      {gunaVocabulary.length > 0 ? (
                        gunaVocabulary.map((item) => (

                          <label
                            className="add-herb-option-card"
                            key={item.id}
                          >

                            <input
                              type="checkbox"
                              checked={formData.guna.includes(
                                item.term
                              )}
                              onChange={() =>
                                handleMultiSelect(
                                  "guna",
                                  item.term
                                ) }
                            />

                            <span>
                              {item.term}

                              {item.english
                                ? ` (${item.english})`
                                : ""}
                            </span>

                          </label>

                        ))
                      ) : (
                        <p className="add-herb-empty-message">
                          No active Guna terms are available.
                        </p>
                      )}

                    </div>

                    {!isViewMode &&
                      !isReviewMode && (
                        <button
                          type="button"
                          className="add-herb-add-term-button"
                          onClick={() =>
                            setIsAddGunaTermOpen(true)
                          }
                        >
                          ＋ Add new Guna term
                        </button>
                      )}
                  </div>
                )}


                {/* 05 VIRYA */}

                {section.number === "05" && (
                  <div className="add-herb-single-selection">

                    <p className="add-herb-selection-description">
                      Select the potency.
                    </p>

                    <div className="add-herb-single-options">

                      {viryaOptions.map(
                        (option) => (

                          <label
                            className="add-herb-option-card"
                            key={option}
                          >

                            <input
                              type="radio"
                              name="virya"
                              value={option}
                              checked={
                                formData.virya ===
                                option
                              }
                              onChange={(event) =>
                                handleInputChange(
                                  "virya",
                                  event.target.value
                                )
                              }
                            />

                            <span>
                              {option}
                            </span>

                          </label>
                        )
                      )}

                    </div>
                  </div>
                )}

                {/* 06 VIPAKA */}

                {section.number === "06" && (

                  <div className="add-herb-single-selection">

                    <p className="add-herb-selection-description">
                      Select the post-digestive taste.
                    </p>

                    <div className="add-herb-single-options">

                      {vipakaOptions.map(
                        (option) => (

                          <label
                            className="add-herb-option-card"
                            key={option}
                          >

                            <input
                              type="radio"
                              name="vipaka"
                              value={option}
                              checked={
                                formData.vipaka ===
                                option
                              }
                              onChange={(event) =>
                                handleInputChange(
                                  "vipaka",
                                  event.target.value
                                )
                              }
                            />

                            <span>
                              {option}
                            </span>

                          </label>

                        )
                      )}

                    </div>

                  </div>

                )}


                {/* 07 PRABHAVA */}

                {section.number === "07" && (

                  <div className="add-herb-text-section">

                    <div className="add-herb-field">

                      <label>
                        Prabhava
                      </label>

                      <textarea
                        className="add-herb-large-textarea"
                        value={
                          formData.prabhava
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "prabhava",
                            event.target.value
                          )
                        }
                        placeholder="Describe the distinctive action..."
                      />

                    </div>

                  </div>

                )}


                {/* 08 DOSHA */}

                {section.number === "08" && (

                  <div className="add-herb-dosha-section">

                    <div className="add-herb-dosha-grid">

                      {[
                        ["vata", "Vata"],
                        ["pitta", "Pitta"],
                        ["kapha", "Kapha"],
                      ].map(
                        ([key, label]) => (

                          <div
                            className="add-herb-field"
                            key={key}
                          >

                            <label>
                              {label}
                            </label>

                            <select
                              value={
                                formData.dosha[key]
                              }
                              onChange={(event) =>
                                handleDoshaChange(
                                  key,
                                  event.target.value
                                )
                              }
                            >

                              <option value="">
                                Select effect
                              </option>

                              {doshaOptions.map(
                                (option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                )
                              )}

                            </select>

                          </div>
                        )
                      )}

                    </div>

                    <div className="add-herb-field">

                      <label>
                        Dosha Notes
                      </label>

                      <textarea
                        value={
                          formData.doshaNotes
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "doshaNotes",
                            event.target.value
                          )
                        }
                        placeholder="Additional Dosha notes..."
                      />

                    </div>
                  </div>
                )}

                {/* 09 DHATU */}

                {section.number === "09" && (

                  <div className="add-herb-score-section">
                    <p className="add-herb-selection-description">
                      Assign an affinity score from 0–5.
                    </p>

                    <div className="add-herb-score-grid">

                      {dhatuOptions.map(
                        (item) => (

                          <div
                            className="add-herb-field"
                            key={item.key}
                          >

                            <label>
                              {item.label}
                            </label>

                            <select
                              value={
                                formData.dhatu[
                                  item.key
                                ]
                              }
                              onChange={(event) =>
                                handleAffinityChange(
                                  "dhatu",
                                  item.key,
                                  event.target.value
                                )
                              }
                            >

                              {affinityScores.map(
                                (score) => (
                                  <option
                                    key={score.value}
                                    value={score.value}
                                  >
                                    {score.label}
                                  </option>
                                )
                              )}

                            </select>
                          </div>
                        )
                      )}

                    </div>
                  </div>
                )}


                {/* 10 MALA */}

                {section.number === "10" && (

                  <div className="add-herb-score-section">
                    <p className="add-herb-selection-description">
                      Assign an affinity score from 0–5.
                    </p>

                    <div className="add-herb-score-grid">

                      {malaOptions.map(
                        (item) => (

                          <div
                            className="add-herb-field"
                            key={item.key}
                          >

                            <label>
                              {item.label}
                            </label>

                            <select
                              value={
                                formData.mala[
                                  item.key
                                ]
                              }
                              onChange={(event) =>
                                handleAffinityChange(
                                  "mala",
                                  item.key,
                                  event.target.value
                                )
                              }
                            >

                              {affinityScores.map(
                                (score) => (
                                  <option
                                    key={score.value}
                                    value={score.value}
                                  >
                                    {score.label}
                                  </option>
                                )
                              )}

                            </select>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}


                {/* 11 SROTAS */}

                {section.number === "11" && (

                  <div className="add-herb-score-section">
                    <p className="add-herb-selection-description">
                      Assign a 0–5 affinity score to each Srotas.
                    </p>

                    <div className="add-herb-score-grid">

                      {srotasOptions.map(
                        (item) => (

                          <div
                            className="add-herb-field"
                            key={item.key}
                          >

                            <label>
                              {item.label}
                            </label>

                            <select
                              value={
                                formData.srotas[
                                  item.key
                                ]
                              }
                              onChange={(event) =>
                                handleAffinityChange(
                                  "srotas",
                                  item.key,
                                  event.target.value
                                )
                              }
                            >

                              {affinityScores.map(
                                (score) => (
                                  <option
                                    key={score.value}
                                    value={score.value}
                                  >
                                    {score.label}
                                  </option>
                                )
                              )}

                            </select>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}


                {/* 12 KARMA */}

                {section.number === "12" && (

                  <div className="add-herb-therapeutic-section">
                    <div className="add-herb-field">

                      <label>
                        Important Karma
                      </label>

                      <input
                        type="text"
                        value={
                          formData.importantKarma
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "importantKarma",
                            event.target.value
                          )
                        }
                        placeholder="e.g., Rasayana, Deepana"
                      />

                    </div>

                    <div className="add-herb-field">

                      <label>
                        Other Karma
                      </label>

                      <input
                        type="text"
                        value={
                          formData.otherKarma
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "otherKarma",
                            event.target.value
                          )
                        }
                        placeholder="Additional Karma"
                      />
                    </div>

                    <div className="add-herb-field">

                      <label>
                        Therapeutic Actions
                      </label>

                      <textarea
                        value={
                          formData.therapeuticActions
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "therapeuticActions",
                            event.target.value
                          )
                        }
                        placeholder="Describe therapeutic actions..."
                      />

                    </div>

                    <div className="add-herb-field">

                      <label>
                        Major Diseases / Indications
                      </label>

                      <textarea
                        value={
                          formData.majorDiseases
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "majorDiseases",
                            event.target.value
                          )
                        }
                        placeholder="Enter diseases or indications..."
                      />

                    </div>

                    <div className="add-herb-field">

                      <label>
                        Clinical Indications / Notes
                      </label>

                      <textarea
                        value={
                          formData.clinicalIndications
                        }
                        onChange={(event) =>
                          handleInputChange(
                            "clinicalIndications",
                            event.target.value
                          )
                        }
                        placeholder="Additional clinical notes..."
                      />

                    </div>

                  </div>

                )}


                {/* 13 REFERENCES */}

                {section.number === "13" && (

                  <div className="add-herb-reference-section">

                    {formData.classicalReferences.map(
                      (reference, index) => (

                        <div
                          className="add-herb-reference-block"
                          key={index}
                        >

                          <div className="add-herb-reference-grid">

                            <div className="add-herb-field">

                              <label>
                                Classical Text / Source
                              </label>

                              <input
                                type="text"
                                value={
                                  reference.source
                                }
                                onChange={(event) =>
                                  handleReferenceChange(
                                    index,
                                    "source",
                                    event.target.value
                                  )
                                }
                                placeholder="e.g., Charaka Samhita"
                              />

                            </div>

                            <div className="add-herb-field">

                              <label>
                                Chapter
                              </label>

                              <input
                                type="text"
                                value={
                                  reference.chapter
                                }
                                onChange={(event) =>
                                  handleReferenceChange(
                                    index,
                                    "chapter",
                                    event.target.value
                                  )
                                }
                                placeholder="Chapter"
                              />

                            </div>

                            <div className="add-herb-field">

                              <label>
                                Verse / Shloka
                              </label>

                              <input
                                type="text"
                                value={
                                  reference.verse
                                }
                                onChange={(event) =>
                                  handleReferenceChange(
                                    index,
                                    "verse",
                                    event.target.value
                                  )
                                }
                                placeholder="Verse reference"
                              />

                            </div>

                          </div>

                          <div className="add-herb-field">

                            <label>
                              Notes
                            </label>

                            <textarea
                              value={
                                reference.notes
                              }
                              onChange={(event) =>
                                handleReferenceChange(
                                  index,
                                  "notes",
                                  event.target.value
                                )
                              }
                              placeholder="Additional reference notes..."
                            />

                          </div>

                        </div>

                      )
                    )}

                    {!isViewMode &&
                      !isReviewMode && (
                        <button
                          type="button"
                          className="add-herb-add-reference-button"
                          onClick={addReference}
                        >
                          + Add another reference
                        </button>
                      )}

                  </div>

                )}

              </div>

            )}

          </div>

        ))}

      </fieldset>


      {/* =====================================================
          RASA MODAL
      ===================================================== */}

      {isAddRasaTermOpen && (

        <div className="add-herb-term-modal-overlay">

          <div className="add-herb-term-modal">

            <div className="add-herb-term-modal-header">

              <div>

                <p className="add-herb-term-modal-label">
                  VOCABULARY
                </p>

                <h2>
                  Add new Rasa term
                </h2>

                <p>
                  Add a standardized Rasa term for herb records.
                </p>

              </div>

              <button
                type="button"
                className="add-herb-term-modal-close"
                onClick={() =>
                  setIsAddRasaTermOpen(false)
                }
              >
                ×
              </button>

            </div>

            <div className="add-herb-term-modal-form">

              <div className="add-herb-term-field">

                <label>
                  Term
                </label>

                <input
                  type="text"
                  value={rasaTermForm.term}
                  onChange={(event) =>
                    setRasaTermForm(
                      (previous) => ({
                        ...previous,
                        term: event.target.value,
                      })
                    )
                  }
                />

              </div>

              <div className="add-herb-term-field">

                <label>
                  English Meaning
                </label>

                <input
                  type="text"
                  value={rasaTermForm.english}
                  onChange={(event) =>
                    setRasaTermForm(
                      (previous) => ({
                        ...previous,
                        english:
                          event.target.value,
                      })
                    )
                  }
                />

              </div>

              <div className="add-herb-term-field">

                <label>
                  Description
                </label>

                <textarea
                  value={
                    rasaTermForm.description
                  }
                  onChange={(event) =>
                    setRasaTermForm(
                      (previous) => ({
                        ...previous,
                        description:
                          event.target.value,
                      })
                    )
                  }
                />

              </div>

            </div>

            <div className="add-herb-term-modal-actions">

              <button
                type="button"
                className="add-herb-term-cancel-button"
                onClick={() =>
                  setIsAddRasaTermOpen(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="add-herb-term-save-button"
                onClick={() =>
                  addVocabularyTerm(
                    "Rasa",
                    rasaTermForm,
                    setRasaTermForm,
                    () =>
                      setIsAddRasaTermOpen(false),
                    setRasaVocabulary,
                    "rasa"
                  )
                }
              >
                Add Term
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          GUNA MODAL
      ===================================================== */}

      {isAddGunaTermOpen && (

        <div className="add-herb-term-modal-overlay">

          <div className="add-herb-term-modal">

            <div className="add-herb-term-modal-header">

              <div>

                <p className="add-herb-term-modal-label">
                  VOCABULARY
                </p>

                <h2>
                  Add new Guna term
                </h2>

                <p>
                  Add a standardized Guna term for herb records.
                </p>

              </div>

              <button
                type="button"
                className="add-herb-term-modal-close"
                onClick={() =>
                  setIsAddGunaTermOpen(false)
                }
              >
                ×
              </button>

            </div>

            <div className="add-herb-term-modal-form">

              <div className="add-herb-term-field">

                <label>
                  Term
                </label>

                <input
                  type="text"
                  value={gunaTermForm.term}
                  onChange={(event) =>
                    setGunaTermForm(
                      (previous) => ({
                        ...previous,
                        term: event.target.value,
                      })
                    )
                  }
                />

              </div>

              <div className="add-herb-term-field">

                <label>
                  English Meaning
                </label>

                <input
                  type="text"
                  value={gunaTermForm.english}
                  onChange={(event) =>
                    setGunaTermForm(
                      (previous) => ({
                        ...previous,
                        english:
                          event.target.value,
                      })
                    )
                  }
                />

              </div>

              <div className="add-herb-term-field">

                <label>
                  Description
                </label>

                <textarea
                  value={
                    gunaTermForm.description
                  }
                  onChange={(event) =>
                    setGunaTermForm(
                      (previous) => ({
                        ...previous,
                        description:
                          event.target.value,
                      })
                    )
                  }
                />

              </div>

            </div>

            <div className="add-herb-term-modal-actions">

              <button
                type="button"
                className="add-herb-term-cancel-button"
                onClick={() =>
                  setIsAddGunaTermOpen(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="add-herb-term-save-button"
                onClick={() =>
                  addVocabularyTerm(
                    "Guna",
                    gunaTermForm,
                    setGunaTermForm,
                    () =>
                      setIsAddGunaTermOpen(false),
                    setGunaVocabulary,
                    "guna"
                  )
                }
              >
                Add Term
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          VERIFICATION
      ===================================================== */}

      <section className="add-herb-verification-card">

        <div className="add-herb-verification-column">

          <h2>
            Verification Status
          </h2>

          <select
            className="add-herb-verification-select"
            value={
              formData.verificationStatus
            }
            disabled={
              isViewMode
            }
            onChange={(event) =>
              handleInputChange(
                "verificationStatus",
                event.target.value
              )
            }
          >

            <option value="Draft">
              Draft
            </option>

            <option value="Reviewed">
              Reviewed
            </option>

            <option value="Verified">
              Verified
            </option>

          </select>

          <div className="add-herb-verification-warning">

            <span>
              !
            </span>

            <p>
              Only authorized reviewers should mark
              an herb as Verified.
            </p>

          </div>

        </div>


        <div className="add-herb-history-column">

          <h2>
            Verification History
          </h2>

          <div className="add-herb-history-row">

            <span>
              Current Status
            </span>

            <strong>
              {formData.verificationStatus}
            </strong>

          </div>

          <div className="add-herb-history-row">

            <span>
              Reviewed by
            </span>

            <strong>
              {reviewedEntry?.changedBy || "—"}
            </strong>

          </div>

          <div className="add-herb-history-row">

            <span>
              Verified by
            </span>

            <strong>
              {verifiedEntry?.changedBy || "—"}
            </strong>

          </div>

          <div className="add-herb-history-row">

            <span>
              Last updated
            </span>

            <strong>
              {lastHistoryEntry
                ? formatDate(
                    lastHistoryEntry.changedAt
                  )
                : "—"}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATUS TIMELINE
      ===================================================== */}

      {history.length > 0 && (

        <section className="add-herb-verification-card">

          <div className="add-herb-history-column">

            <h2>
              Status Timeline
            </h2>

            <div className="add-herb-history-list">

              {history.map((entry) => (

                <div
                  className="add-herb-history-item"
                  key={entry.id}
                >

                  <strong>
                    {entry.previousStatus}
                    {" → "}
                    {entry.newStatus}
                  </strong>

                  <span>
                    {entry.changedBy}
                  </span>

                  <small>
                    {formatDate(
                      entry.changedAt
                    )}
                  </small>

                </div>
              ))}
            </div>
          </div>

        </section>

      )}


      {/* =====================================================
          BOTTOM ACTIONS
      ===================================================== */}

      <div className="add-herb-bottom-actions">

        <div className="add-herb-bottom-left">

          {!isViewMode &&
            !isReviewMode && (
              <button
                type="button"
                className="add-herb-save-button"
                onClick={() =>
                  handleSave("save")
                }
              >
                Save Changes
              </button>
            )}

          {!isViewMode && (
            <button
              type="button"
              className="add-herb-review-button"
              onClick={() =>
                handleSave("review")
              }
            >
              {isReviewMode
                ? "Save Review"
                : "Submit for Review"}
            </button>
          )}

          {!isViewMode &&
            !isReviewMode && (
              <button
                type="button"
                className="add-herb-bottom-draft-button"
                onClick={() =>
                  handleSave("draft")
                }
              >
                Save Draft
              </button>
            )}
        </div>

        <button
          type="button"
          className="add-herb-bottom-cancel"
          onClick={handleCancel}
        >
          {isViewMode
            ? "Close"
            : "Cancel"}
        </button>
      </div>
    </div>
  )
}

export default AddHerb