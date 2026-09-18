import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
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
  const [isAddRasaTermOpen, setIsAddRasaTermOpen] = useState(false)
  const [isAddGunaTermOpen, setIsAddGunaTermOpen] = useState(false)
  const [isAddDhatuTermOpen, setIsAddDhatuTermOpen] = useState(false)
  const [isAddMalaTermOpen, setIsAddMalaTermOpen] = useState(false)
  const [isAddSrotasTermOpen, setIsAddSrotasTermOpen] = useState(false)
  const [isAddViryaTermOpen, setIsAddViryaTermOpen] = useState(false)
  const [isAddVipakaTermOpen, setIsAddVipakaTermOpen] = useState(false)

  const [rasaTermForm, setRasaTermForm] = useState({
  term: "",
  english: "",
  description: ""
})

const [gunaTermForm, setGunaTermForm] = useState({
  term: "",
  english: "",
  description: ""
})

const [dhatuTermForm, setDhatuTermForm] = useState({
  term: "",
  english: "",
  description: ""
})

const [malaTermForm, setMalaTermForm] = useState({
  term: "",
  english: "",
  description: ""
})

const [srotasTermForm, setSrotasTermForm] = useState({
  term: "",
  english: "",
  description: ""
})

const [viryaTermForm, setViryaTermForm] = useState({
  term: "",
  english: "",
  description: ""
})

const [vipakaTermForm, setVipakaTermForm] = useState({
  term: "",
  english: "",
  description: ""
})

  const [rasaVocabulary, setRasaVocabulary] = useState([])
  const [gunaVocabulary, setGunaVocabulary] = useState([])
  const [dhatuVocabulary, setDhatuVocabulary] = useState([])
  const [malaVocabulary, setMalaVocabulary] = useState([])
  const [srotasVocabulary, setSrotasVocabulary] = useState([])
  const [viryaVocabulary, setViryaVocabulary] = useState([])
  const [vipakaVocabulary, setVipakaVocabulary] = useState([])

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
      kapha: ""
    },
    doshaNotes: "",

    dhatu: [],
    mala: [],
    srotas: [],

    karma: "",
    therapeuticActions: "",
    clinicalIndications: "",

    classicalReferences: [
      {
        source: "",
        chapter: "",
        verse: "",
        notes: ""
      }
    ],

    verificationStatus: "Draft"
  })

const [imageName, setImageName] = useState("")
const [imagePreview, setImagePreview] = useState("")
const [isDragging, setIsDragging] = useState(false)
const [herbId, setHerbId] = useState("")

  const sections = [
    {
      number: "01",
      title: "Basic Information",
      description:
        "Enter the primary name and basic details of the herb."
    },
    {
      number: "02",
      title: "Identification",
      description:
        "Add botanical, regional, and identification information."
    },
    {
      number: "03",
      title: "Rasa",
      description:
        "Select all applicable tastes (Rasa) for this herb."
    },
    {
      number: "04",
      title: "Guna",
      description:
        "Select applicable Gunas (qualities)."
    },
    {
      number: "05",
      title: "Virya",
      description:
        "Select the potency (Virya)."
    },
    {
      number: "06",
      title: "Vipaka",
      description:
        "Select post-digestive taste (Vipaka)."
    },
    {
      number: "07",
      title: "Prabhava",
      description:
        "Add the specific or distinctive action of the herb."
    },
    {
      number: "08",
      title: "Dosha Affinity",
      description:
        "Specify the effect of the herb on Vata, Pitta, and Kapha."
    },
    {
      number: "09",
      title: "Dhatu Affinity",
      description:
        "Select the tissues influenced by the herb."
    },
    {
      number: "10",
      title: "Mala Affinity",
      description:
        "Select the effect of the herb on the malas."
    },
    {
      number: "11",
      title: "Srotas Affinity",
      description:
        "Select the channels associated with the herb." },
    {
      number: "12",
      title: "Karma / Therapeutic Actions",
      description:
        "Add therapeutic actions and clinical indications." },

    {
      number: "13",
      title: "Classical References",
      description:
        "Add classical Ayurvedic texts and supporting references." } ]


  const gunaOptions = [
    { value: "Guru", label: "Guru (Heavy)" },
    { value: "Laghu", label: "Laghu (Light)" },
    { value: "Snigdha", label: "Snigdha (Unctuous)" },
    { value: "Ruksha", label: "Ruksha (Dry)" },
    { value: "Ushna", label: "Ushna (Hot)" },
    { value: "Shita", label: "Shita (Cold)" },
    { value: "Mrudu", label: "Mrudu (Soft)" },
    { value: "Kathina", label: "Kathina (Hard)" },
    { value: "Vishada", label: "Vishada (Non-slimy)" } ]

    const dhatuOptions =
  dhatuVocabulary.length > 0
    ? dhatuVocabulary.map((item) => ({
        value: item.term,
        label: item.english
          ? `${item.term} (${item.english})`
          : item.term
      }))
    : [
        { value: "Rasa", label: "Rasa" },
        { value: "Rakta", label: "Rakta" },
        { value: "Mamsa", label: "Mamsa" },
        { value: "Meda", label: "Meda" },
        { value: "Asthi", label: "Asthi" },
        { value: "Majja", label: "Majja" },
        { value: "Shukra", label: "Shukra" }
      ]

      const malaOptions =
      malaVocabulary.length > 0
        ? malaVocabulary
        : []

        const srotasOptions =
        srotasVocabulary.length > 0
          ? srotasVocabulary
          : []

  const toggleSection = (sectionNumber) => {
    setOpenSection(
      openSection === sectionNumber ? null : sectionNumber
    ) }

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    })) }

  const handleDoshaChange = (dosha, value) => {
    setFormData((previous) => ({
      ...previous,
      dosha: {
        ...previous.dosha,
        [dosha]: value
      } })) }

  const handleMultiSelect = (field, value) => {
    setFormData((previous) => {
      const currentValues = previous[field]

      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return {
        ...previous,
        [field]: updatedValues  }  }) }

  const handleReferenceChange = (index, field, value) => {
    setFormData((previous) => {
      const updatedReferences = [...previous.classicalReferences]

      updatedReferences[index] = {
        ...updatedReferences[index],
        [field]: value }

      return {
        ...previous,
        classicalReferences: updatedReferences } })  }

  

  const addReference = () => {
    setFormData((previous) => ({
      ...previous,
      classicalReferences: [
        ...previous.classicalReferences,
        {
          source: "",
          chapter: "",
          verse: "",
          notes: "" } ] }))  }

          const handleAddRasaTerm = () => {
            const cleanedTerm = rasaTermForm.term.trim()
            const cleanedEnglish = rasaTermForm.english.trim()
            const cleanedDescription = rasaTermForm.description.trim()
          
            if (!cleanedTerm) {
              alert("Please enter the Rasa term.")
              return
            }
          
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const duplicateTerm = savedVocabulary.some(
              (item) =>
                item.category === "Rasa" &&
                item.term.trim().toLowerCase() === cleanedTerm.toLowerCase()
            )
          
            if (duplicateTerm) {
              alert(`"${cleanedTerm}" already exists in Rasa vocabulary.`)
              return
            }
          
            const newTerm = {
              id: Date.now().toString(),
              term: cleanedTerm,
              sanskrit: cleanedTerm,
              english: cleanedEnglish,
              category: "Rasa",
              description: cleanedDescription,
              usage: 0,
              status: "Active",
              createdAt: new Date().toISOString()
            }
          
            const updatedVocabulary = [
              ...savedVocabulary,
              newTerm
            ]
          
            localStorage.setItem(
              "vocabulary",
              JSON.stringify(updatedVocabulary)
            )
          
            setRasaVocabulary((previous) => [
              ...previous,
              newTerm
            ])
          
            setFormData((previous) => ({
              ...previous,
              rasa: previous.rasa.includes(cleanedTerm)
                ? previous.rasa
                : [...previous.rasa, cleanedTerm]
            }))
          
            setRasaTermForm({
              term: "",
              english: "",
              description: ""
            })
          
            setIsAddRasaTermOpen(false)
          
            alert(`"${cleanedTerm}" was added to Rasa vocabulary.`)
          }

          const handleAddGunaTerm = () => {
            const cleanedTerm = gunaTermForm.term.trim()
            const cleanedEnglish = gunaTermForm.english.trim()
            const cleanedDescription = gunaTermForm.description.trim()
          
            if (!cleanedTerm) {
              alert("Please enter the Guna term.")
              return
            }
          
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const duplicateTerm = savedVocabulary.some(
              (item) =>
                item.category === "Guna" &&
                item.term.trim().toLowerCase() ===
                  cleanedTerm.toLowerCase()
            )
          
            if (duplicateTerm) {
              alert(`"${cleanedTerm}" already exists in Guna vocabulary.`)
              return
            }
          
            const newTerm = {
              id: Date.now().toString(),
              term: cleanedTerm,
              sanskrit: cleanedTerm,
              english: cleanedEnglish,
              category: "Guna",
              description: cleanedDescription,
              usage: 0,
              status: "Active",
              createdAt: new Date().toISOString()
            }
          
            const updatedVocabulary = [
              ...savedVocabulary,
              newTerm
            ]
          
            localStorage.setItem(
              "vocabulary",
              JSON.stringify(updatedVocabulary)
            )
          
            setGunaVocabulary((previous) => [
              ...previous,
              newTerm
            ])
          
            setFormData((previous) => ({
              ...previous,
              guna: previous.guna.includes(cleanedTerm)
                ? previous.guna
                : [...previous.guna, cleanedTerm]
            }))
          
            setGunaTermForm({
              term: "",
              english: "",
              description: ""
            })
          
            setIsAddGunaTermOpen(false)
          
            alert(`"${cleanedTerm}" was added to Guna vocabulary.`)
          }

          const handleAddDhatuTerm = () => {
            const cleanedTerm = dhatuTermForm.term.trim()
            const cleanedEnglish = dhatuTermForm.english.trim()
            const cleanedDescription = dhatuTermForm.description.trim()
          
            if (!cleanedTerm) {
              alert("Please enter the Dhatu term.")
              return
            }
          
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const duplicateTerm = savedVocabulary.some(
              (item) =>
                item.category === "Dhatu" &&
                item.term.trim().toLowerCase() ===
                  cleanedTerm.toLowerCase()
            )
          
            if (duplicateTerm) {
              alert(`"${cleanedTerm}" already exists in Dhatu vocabulary.`)
              return
            }
          
            const newTerm = {
              id: Date.now().toString(),
              term: cleanedTerm,
              sanskrit: cleanedTerm,
              english: cleanedEnglish,
              category: "Dhatu",
              description: cleanedDescription,
              usage: 0,
              status: "Active",
              createdAt: new Date().toISOString()
            }
          
            const updatedVocabulary = [
              ...savedVocabulary,
              newTerm
            ]
          
            localStorage.setItem(
              "vocabulary",
              JSON.stringify(updatedVocabulary)
            )
          
            setDhatuVocabulary((previous) => [
              ...previous,
              newTerm
            ])
          
            setFormData((previous) => ({
              ...previous,
              dhatu: previous.dhatu.includes(cleanedTerm)
                ? previous.dhatu
                : [...previous.dhatu, cleanedTerm]
            }))
          
            setDhatuTermForm({
              term: "",
              english: "",
              description: ""
            })
          
            setIsAddDhatuTermOpen(false)
          
            alert(`"${cleanedTerm}" was added to Dhatu vocabulary.`)
          }

          const handleAddMalaTerm = () => {
            const cleanedTerm = malaTermForm.term.trim()
            const cleanedEnglish = malaTermForm.english.trim()
            const cleanedDescription = malaTermForm.description.trim()
          
            if (!cleanedTerm) {
              alert("Please enter the Mala term.")
              return
            }
          
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const duplicateTerm = savedVocabulary.some(
              (item) =>
                item.category === "Mala" &&
                item.term.trim().toLowerCase() ===
                  cleanedTerm.toLowerCase()
            )
          
            if (duplicateTerm) {
              alert(`"${cleanedTerm}" already exists in Mala vocabulary.`)
              return
            }
          
            const newTerm = {
              id: Date.now().toString(),
              term: cleanedTerm,
              sanskrit: cleanedTerm,
              english: cleanedEnglish,
              category: "Mala",
              description: cleanedDescription,
              usage: 0,
              status: "Active",
              createdAt: new Date().toISOString()
            }
          
            const updatedVocabulary = [
              ...savedVocabulary,
              newTerm
            ]
          
            localStorage.setItem(
              "vocabulary",
              JSON.stringify(updatedVocabulary)
            )
          
            setMalaVocabulary((previous) => [
              ...previous,
              newTerm
            ])
          
            setFormData((previous) => ({
              ...previous,
              mala: previous.mala.includes(cleanedTerm)
                ? previous.mala
                : [...previous.mala, cleanedTerm]
            }))
          
            setMalaTermForm({
              term: "",
              english: "",
              description: ""
            })
          
            setIsAddMalaTermOpen(false)
          
            alert(`"${cleanedTerm}" was added to Mala vocabulary.`)
          }

          const handleAddSrotasTerm = () => {
            const cleanedTerm = srotasTermForm.term.trim()
            const cleanedEnglish = srotasTermForm.english.trim()
            const cleanedDescription = srotasTermForm.description.trim()
          
            if (!cleanedTerm) {
              alert("Please enter the Srotas term.")
              return
            }
          
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const duplicateTerm = savedVocabulary.some(
              (item) =>
                item.category === "Srotas" &&
                item.term.trim().toLowerCase() ===
                  cleanedTerm.toLowerCase()
            )
          
            if (duplicateTerm) {
              alert(`"${cleanedTerm}" already exists in Srotas vocabulary.`)
              return
            }
          
            const newTerm = {
              id: Date.now().toString(),
              term: cleanedTerm,
              sanskrit: cleanedTerm,
              english: cleanedEnglish,
              category: "Srotas",
              description: cleanedDescription,
              usage: 0,
              status: "Active",
              createdAt: new Date().toISOString()
            }
          
            const updatedVocabulary = [
              ...savedVocabulary,
              newTerm
            ]
          
            localStorage.setItem(
              "vocabulary",
              JSON.stringify(updatedVocabulary)
            )
          
            setSrotasVocabulary((previous) => [
              ...previous,
              newTerm
            ])
          
            setFormData((previous) => ({
              ...previous,
              srotas: previous.srotas.includes(cleanedTerm)
                ? previous.srotas
                : [...previous.srotas, cleanedTerm]
            }))
          
            setSrotasTermForm({
              term: "",
              english: "",
              description: ""
            })
          
            setIsAddSrotasTermOpen(false)
          
            alert(`"${cleanedTerm}" was added to Srotas vocabulary.`)
          }

          const handleAddViryaTerm = () => {
            const cleanedTerm = viryaTermForm.term.trim()
            const cleanedEnglish = viryaTermForm.english.trim()
            const cleanedDescription = viryaTermForm.description.trim()
          
            if (!cleanedTerm) {
              alert("Please enter the Virya term.")
              return
            }
          
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const duplicateTerm = savedVocabulary.some(
              (item) =>
                item.category === "Virya" &&
                item.term.trim().toLowerCase() ===
                  cleanedTerm.toLowerCase()
            )
          
            if (duplicateTerm) {
              alert(`"${cleanedTerm}" already exists in Virya vocabulary.`)
              return
            }
          
            const newTerm = {
              id: Date.now().toString(),
              term: cleanedTerm,
              sanskrit: cleanedTerm,
              english: cleanedEnglish,
              category: "Virya",
              description: cleanedDescription,
              usage: 0,
              status: "Active",
              createdAt: new Date().toISOString()
            }
          
            const updatedVocabulary = [
              ...savedVocabulary,
              newTerm
            ]
          
            localStorage.setItem(
              "vocabulary",
              JSON.stringify(updatedVocabulary)
            )
          
            setViryaVocabulary((previous) => [
              ...previous,
              newTerm
            ])
          
            setFormData((previous) => ({
              ...previous,
              virya: cleanedTerm
            }))
          
            setViryaTermForm({
              term: "",
              english: "",
              description: ""
            })
          
            setIsAddViryaTermOpen(false)
          
            alert(`"${cleanedTerm}" was added to Virya vocabulary.`)
          }

          const handleAddVipakaTerm = () => {
            const cleanedTerm = vipakaTermForm.term.trim()
            const cleanedEnglish = vipakaTermForm.english.trim()
            const cleanedDescription = vipakaTermForm.description.trim()
          
            if (!cleanedTerm) {
              alert("Please enter the Vipaka term.")
              return
            }
          
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const duplicateTerm = savedVocabulary.some(
              (item) =>
                item.category === "Vipaka" &&
                item.term.trim().toLowerCase() ===
                  cleanedTerm.toLowerCase()
            )
          
            if (duplicateTerm) {
              alert(`"${cleanedTerm}" already exists in Vipaka vocabulary.`)
              return
            }
          
            const newTerm = {
              id: Date.now().toString(),
              term: cleanedTerm,
              sanskrit: cleanedTerm,
              english: cleanedEnglish,
              category: "Vipaka",
              description: cleanedDescription,
              usage: 0,
              status: "Active",
              createdAt: new Date().toISOString()
            }
          
            const updatedVocabulary = [
              ...savedVocabulary,
              newTerm
            ]
          
            localStorage.setItem(
              "vocabulary",
              JSON.stringify(updatedVocabulary)
            )
          
            setVipakaVocabulary((previous) => [
              ...previous,
              newTerm
            ])
          
            setFormData((previous) => ({
              ...previous,
              vipaka: cleanedTerm
            }))
          
            setVipakaTermForm({
              term: "",
              english: "",
              description: ""
            })
          
            setIsAddVipakaTermOpen(false)
          
            alert(`"${cleanedTerm}" was added to Vipaka vocabulary.`)
          }

          const processImageFile = (file) => {
            if (!file) {
              return
            }
          
            const allowedTypes = [
              "image/png",
              "image/jpeg"
            ]
          
            if (!allowedTypes.includes(file.type)) {
              alert("Please select a PNG or JPG/JPEG image.")
              return
            }
          
            const maxSize = 5 * 1024 * 1024
          
            if (file.size > maxSize) {
              alert("Image size must be less than 5 MB.")
              return
            }
          
            setImageName(file.name)
            setImagePreview(URL.createObjectURL(file))
          }
          
          const handleImageChange = (event) => {
            const file = event.target.files?.[0]
          
            processImageFile(file)
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
          
            const file = event.dataTransfer.files?.[0]
          
            processImageFile(file)
          }

          useEffect(() => {
            return () => {
              if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
              }
            }
          }, [imagePreview])

          useEffect(() => {
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const activeRasa = savedVocabulary.filter(
              (item) =>
                item.category === "Rasa" &&
                item.status === "Active"
            )
          
            if (selectedHerbId) {
              const savedHerbs = JSON.parse(
                localStorage.getItem("herbs") || "[]"
              )
          
              const selectedHerb = savedHerbs.find(
                (herb) => herb.id === selectedHerbId
              )
          
              const existingRasaTerms = savedVocabulary.filter(
                (item) =>
                  item.category === "Rasa" &&
                  selectedHerb?.rasa?.includes(item.term)
              )
          
              const combinedRasa = [
                ...activeRasa,
                ...existingRasaTerms.filter(
                  (existingTerm) =>
                    !activeRasa.some(
                      (activeTerm) =>
                        activeTerm.id === existingTerm.id
                    )
                )
              ]
          
              setRasaVocabulary(combinedRasa)
            } else {
              setRasaVocabulary(activeRasa)
            }
          }, [selectedHerbId])

          useEffect(() => {
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const activeGuna = savedVocabulary.filter(
              (item) =>
                item.category === "Guna" &&
                item.status === "Active"
            )
          
            if (selectedHerbId) {
              const savedHerbs = JSON.parse(
                localStorage.getItem("herbs") || "[]"
              )
          
              const selectedHerb = savedHerbs.find(
                (herb) => herb.id === selectedHerbId
              )
          
              const existingGunaTerms = savedVocabulary.filter(
                (item) =>
                  item.category === "Guna" &&
                  selectedHerb?.guna?.includes(item.term)
              )
          
              const combinedGuna = [
                ...activeGuna,
                ...existingGunaTerms.filter(
                  (existingTerm) =>
                    !activeGuna.some(
                      (activeTerm) =>
                        activeTerm.id === existingTerm.id
                    )
                )
              ]
          
              setGunaVocabulary(combinedGuna)
            } else {
              setGunaVocabulary(activeGuna)
            }
          }, [selectedHerbId])

          useEffect(() => {
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const activeDhatu = savedVocabulary.filter(
              (item) =>
                item.category === "Dhatu" &&
                item.status === "Active"
            )
          
            if (selectedHerbId) {
              const savedHerbs = JSON.parse(
                localStorage.getItem("herbs") || "[]"
              )
          
              const selectedHerb = savedHerbs.find(
                (herb) => herb.id === selectedHerbId
              )
          
              const existingDhatuTerms = savedVocabulary.filter(
                (item) =>
                  item.category === "Dhatu" &&
                  selectedHerb?.dhatu?.includes(item.term)
              )
          
              const combinedDhatu = [
                ...activeDhatu,
                ...existingDhatuTerms.filter(
                  (existingTerm) =>
                    !activeDhatu.some(
                      (activeTerm) =>
                        activeTerm.id === existingTerm.id
                    )
                )
              ]
          
              setDhatuVocabulary(combinedDhatu)
            } else {
              setDhatuVocabulary(activeDhatu)
            }
          }, [selectedHerbId])

          useEffect(() => {
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const activeMala = savedVocabulary.filter(
              (item) =>
                item.category === "Mala" &&
                item.status === "Active"
            )
          
            if (selectedHerbId) {
              const savedHerbs = JSON.parse(
                localStorage.getItem("herbs") || "[]"
              )
          
              const selectedHerb = savedHerbs.find(
                (herb) => herb.id === selectedHerbId
              )
          
              const existingMalaTerms = savedVocabulary.filter(
                (item) =>
                  item.category === "Mala" &&
                  selectedHerb?.mala?.includes(item.term)
              )
          
              const combinedMala = [
                ...activeMala,
                ...existingMalaTerms.filter(
                  (existingTerm) =>
                    !activeMala.some(
                      (activeTerm) =>
                        activeTerm.id === existingTerm.id
                    )
                )
              ]
          
              setMalaVocabulary(combinedMala)
            } else {
              setMalaVocabulary(activeMala)
            }
          }, [selectedHerbId])

          useEffect(() => {
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const activeSrotas = savedVocabulary.filter(
              (item) =>
                item.category === "Srotas" &&
                item.status === "Active"
            )
          
            if (selectedHerbId) {
              const savedHerbs = JSON.parse(
                localStorage.getItem("herbs") || "[]"
              )
          
              const selectedHerb = savedHerbs.find(
                (herb) => herb.id === selectedHerbId
              )
          
              const existingSrotasTerms = savedVocabulary.filter(
                (item) =>
                  item.category === "Srotas" &&
                  selectedHerb?.srotas?.includes(item.term)
              )
          
              const combinedSrotas = [
                ...activeSrotas,
                ...existingSrotasTerms.filter(
                  (existingTerm) =>
                    !activeSrotas.some(
                      (activeTerm) =>
                        activeTerm.id === existingTerm.id
                    )
                )
              ]
          
              setSrotasVocabulary(combinedSrotas)
            } else {
              setSrotasVocabulary(activeSrotas)
            }
          }, [selectedHerbId])

          useEffect(() => {
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )

            const activeVirya = savedVocabulary.filter(
              (item) =>
                item.category === "Virya" &&
                item.status === "Active"
            )

            if (selectedHerbId) {
              const savedHerbs = JSON.parse(
                localStorage.getItem("herbs") || "[]"
              )

              const selectedHerb = savedHerbs.find(
                (herb) => herb.id === selectedHerbId
              )

              const existingViryaTerms = savedVocabulary.filter(
                (item) =>
                  item.category === "Virya" &&
                  item.term === selectedHerb?.virya
              )

              const combinedVirya = [
                ...activeVirya,
                ...existingViryaTerms.filter(
                  (existingTerm) =>
                    !activeVirya.some(
                      (activeTerm) =>
                        activeTerm.id === existingTerm.id
                    )
                )
              ]

              setViryaVocabulary(combinedVirya)
            } else {
              setViryaVocabulary(activeVirya)
            }
          }, [selectedHerbId])

          useEffect(() => {
            const savedVocabulary = JSON.parse(
              localStorage.getItem("vocabulary") || "[]"
            )
          
            const activeVipaka = savedVocabulary.filter(
              (item) =>
                item.category === "Vipaka" &&
                item.status === "Active"
            )
          
            if (selectedHerbId) {
              const savedHerbs = JSON.parse(
                localStorage.getItem("herbs") || "[]"
              )
          
              const selectedHerb = savedHerbs.find(
                (herb) => herb.id === selectedHerbId
              )
          
              const existingVipakaTerms = savedVocabulary.filter(
                (item) =>
                  item.category === "Vipaka" &&
                  item.term === selectedHerb?.vipaka
              )
          
              const combinedVipaka = [
                ...activeVipaka,
                ...existingVipakaTerms.filter(
                  (existingTerm) =>
                    !activeVipaka.some(
                      (activeTerm) =>
                        activeTerm.id === existingTerm.id
                    )
                )
              ]
          
              setVipakaVocabulary(combinedVipaka)
            } else {
              setVipakaVocabulary(activeVipaka)
            }
          }, [selectedHerbId])


          useEffect(() => {
            if (selectedHerbId) {
              const savedHerbs = JSON.parse(
                localStorage.getItem("herbs") || "[]"
              )
          
              const selectedHerb = savedHerbs.find(
                (herb) => herb.id === selectedHerbId
              )
          
              if (selectedHerb) {
                setFormData((previous) => ({
                  ...previous,
                  ...selectedHerb
                }))
          
                setHerbId(selectedHerb.id)
          
                if (selectedHerb.imageName) {
                  setImageName(selectedHerb.imageName)
                }
          
                return
              }
            }
          
            const savedDraft = localStorage.getItem("herbDraft")
            if (!savedDraft) {
              return
            }
            try {
              const savedData = JSON.parse(savedDraft)
          
              setFormData((previous) => ({
                ...previous,
                ...savedData
              }))
          
              if (savedData.imageName) {
                setImageName(savedData.imageName)
              }
          
              if (savedData.id) {
                setHerbId(savedData.id)
              }
            } catch (error) {
              console.error("Unable to load saved herb data.", error)
            }
          }, [selectedHerbId])
        
          const handleSave = (action) => {
            const currentId = herbId || Date.now().toString()
          
            if (!herbId) {
              setHerbId(currentId)
            }
          
            let status = formData.verificationStatus
          
            if (action === "draft") {
              status = "Draft"
            }
          
            if (action === "review") {
              status = "Reviewed"
            }
          
            const herbData = {
              id: currentId,
              ...formData,
              verificationStatus: status,
              imageName,
              savedAt: new Date().toISOString()
            }
          
            const existingHerbs = JSON.parse(
              localStorage.getItem("herbs") || "[]"
            )
          
            const existingIndex = existingHerbs.findIndex(
              (herb) => herb.id === currentId
            )
          
            if (existingIndex !== -1) {
              existingHerbs[existingIndex] = herbData
            } else {
              existingHerbs.push(herbData)
            }
          
            localStorage.setItem(
              "herbs",
              JSON.stringify(existingHerbs)
            )
          
            if (action === "draft") {
              setFormData((previous) => ({
                ...previous,
                verificationStatus: "Draft"
              }))
          
              alert("Herb saved as draft.")
              return
            }
          
            if (action === "review") {
              setFormData((previous) => ({
                ...previous,
                verificationStatus: "Reviewed"
              }))
          
              alert("Herb submitted for review.")
              return
            }
          
            if (action === "save") {
              alert("Information saved successfully.")
              return
            }
          
            if (action === "submit") {
              alert("Information saved successfully.")
              navigate("/admin/manage-herbs")
            } }

  const handleCancel = () => {
    navigate("/admin/manage-herbs") }

  return (
    <div className="add-herb-page">

      {/* =========================================
          PAGE HEADER
          ========================================= */}

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
            ? "Update the Ayurvedic herb profile and save changes to the existing record."
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
  {isViewMode ? "Close" : "Cancel"}
</button>

{!isViewMode && !isReviewMode && (
  <button
    type="button"
    className="add-herb-draft-button"
    onClick={() => handleSave("draft")}
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
    } >
      {isReviewMode ? "Save Review" : "Save & Submit"}
      </button> )}
        </div>
      </div>

      {/* =========================================
          HERB IMAGE
          ========================================= */}

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
          } ${imagePreview ? "has-image" : ""}`}
            onClick={() => imageInputRef.current?.click()}
           onDragOver={handleImageDragOver}
           onDragLeave={handleImageDragLeave}
            onDrop={handleImageDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
               if (event.key === "Enter" || event.key === " ") {
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
        PNG, JPG or JPEG · Max 5 MB · Recommended 800 × 600px
      </p>
    </>
  )}
</div>
          
      </section>

      {/* =========================================
          ALL 13 SECTIONS
          ========================================= */}

<fieldset
  className={`add-herb-sections ${
    isViewMode || isReviewMode ? "read-only-mode" : ""
  }`}
>

        {sections.map((section) => (

          <div
            className={`add-herb-section ${
              openSection === section.number ? "open" : ""
            }`}
            key={section.number}
          >

            {/* Section Header */}

            <button
              type="button"
              className="add-herb-section-header"
              onClick={() => toggleSection(section.number)} >
              <div className="add-herb-section-title">

                <span className="add-herb-section-number">
                  {section.number}
                </span>

                <span>
                  Section {parseInt(section.number)} — {section.title}
                </span>
              </div>

              <span className="add-herb-section-arrow">
                {openSection === section.number
                  ? "⌃"
                  : "›"}
              </span>
            </button>

            {/* Section Body */}

            {openSection === section.number && (
              <div className="add-herb-section-body">

                {/* =========================================
                    SECTION 01 — BASIC INFORMATION
                    ========================================= */}

                {section.number === "01" && (
                  <div className="add-herb-basic-grid">
                    <div className="add-herb-field">
                      <label htmlFor="herbNameEnglish">
                        Herb Name (English)
                      </label>

                      <input
                        id="herbNameEnglish"
                        type="text"
                        value={formData.herbNameEnglish}
                        onChange={(event) =>
                          handleInputChange(
                            "herbNameEnglish",
                            event.target.value
                          )
                        }
                        placeholder="e.g., Winter Cherry"
                      />
                    </div>

                    <div className="add-herb-field">
                      <label htmlFor="sanskritName">
                        Sanskrit Name
                      </label>

                      <input
                        id="sanskritName"
                        type="text"
                        value={formData.sanskritName}
                        onChange={(event) =>
                          handleInputChange(
                            "sanskritName",
                            event.target.value
                          )
                        }
                        placeholder="e.g., Ashwagandha"
                      />
                    </div>

                    <div className="add-herb-field">
                      <label htmlFor="commonNames">
                        Common Names
                      </label>

                      <input
                        id="commonNames"
                        type="text"
                        value={formData.commonNames}
                        onChange={(event) =>
                          handleInputChange(
                            "commonNames",
                            event.target.value
                          )
                        }
                        placeholder="Separate multiple with commas"
                      />
                    </div>

                    <div className="add-herb-field">
                      <label htmlFor="botanicalName">
                        Botanical Name
                      </label>

                      <input
                        id="botanicalName"
                        type="text"
                        value={formData.botanicalName}
                        onChange={(event) =>
                          handleInputChange(
                            "botanicalName",
                            event.target.value
                          )
                        }
                        placeholder="e.g., Withania somnifera"
                      />
                    </div>

                    <div className="add-herb-field add-herb-field-full">
                      <label htmlFor="family">
                        Family
                      </label>

                      <input
                        id="family"
                        type="text"
                        value={formData.family}
                        onChange={(event) =>
                          handleInputChange(
                            "family",
                            event.target.value
                          )
                        }
                        placeholder="e.g., Solanaceae"
                      />
                    </div>
                  </div>
                )}

                {/* =========================================
                    SECTION 02 — IDENTIFICATION
                    ========================================= */}

                {section.number === "02" && (
                  <div className="add-herb-identification-fields">
                    <div className="add-herb-field">

                      <label htmlFor="plantDescription">
                        Plant Description
                      </label>

                      <textarea
                        id="plantDescription"
                        value={formData.plantDescription}
                        onChange={(event) =>
                          handleInputChange(
                            "plantDescription",
                            event.target.value
                          )
                        }
                        placeholder="Morphological description of the plant..." />
                    </div>

                    <div className="add-herb-field">
                      <label htmlFor="partUsed">
                        Part Used
                      </label>

                      <input
                        id="partUsed"
                        type="text"
                        value={formData.partUsed}
                        onChange={(event) =>
                          handleInputChange(
                            "partUsed",
                            event.target.value
                          )
                        }
                        placeholder="e.g., Root, Leaf, Bark, Fruit"
                      />
                    </div>

                    <div className="add-herb-field">
                      <label htmlFor="identificationNotes">
                        Identification Notes
                      </label>

                      <textarea
                        id="identificationNotes"
                        value={formData.identificationNotes}
                        onChange={(event) =>
                          handleInputChange(
                            "identificationNotes",
                            event.target.value
                          )
                        }
                        placeholder="Key distinguishing features..."/>
                    </div>
                  </div>
                )}

                {/* =========================================
                   SECTION 03 — RASA
                 ========================================= */}
{section.number === "03" && (
  <div className="add-herb-selection-section">

    <p className="add-herb-selection-description">
      Select all applicable tastes (Rasa) for this herb.
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
              checked={formData.rasa.includes(item.term)}
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
          No active Rasa terms are available. Add or activate
          Rasa terms from Vocabulary Management.
        </p>
      )}
    </div>

    <button
      type="button"
      className="add-herb-add-term-button"
      onClick={() => setIsAddRasaTermOpen(true)}
    >
      ＋ Add new Rasa term
    </button>

  </div>
)}

 {/* =========================================
    SECTION 04 — GUNA
========================================= */}

{section.number === "04" && (
  <div className="add-herb-selection-section">
    <p className="add-herb-selection-description">
      Select applicable Gunas (qualities).
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
              checked={formData.guna.includes(item.term)}
              onChange={() =>
                handleMultiSelect(
                  "guna",
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
          No active Guna terms are available. Add or activate
          Guna terms from Vocabulary Management.
        </p>
      )}
    </div>

    <button
      type="button"
      className="add-herb-add-term-button"
      onClick={() => setIsAddGunaTermOpen(true)}
    >
      ＋ Add new Guna term
    </button>
  </div>
)}

               {/* =========================================
    SECTION 05 — VIRYA
========================================= */}

{section.number === "05" && (
  <div className="add-herb-single-selection">

    <p className="add-herb-selection-description">
      Select the potency (Virya).
    </p>

    <div className="add-herb-single-options">
      {viryaVocabulary.length > 0 ? (
        viryaVocabulary.map((item) => (
          <label
            className="add-herb-option-card"
            key={item.id}
          >
            <input
              type="radio"
              name="virya"
              value={item.term}
              checked={formData.virya === item.term}
              onChange={(event) =>
                handleInputChange(
                  "virya",
                  event.target.value
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
          No active Virya terms are available. Add or activate
          Virya terms from Vocabulary Management.
        </p>
      )}
    </div>

    <button
      type="button"
      className="add-herb-add-term-button"
      onClick={() => setIsAddViryaTermOpen(true)}
    >
      + Add new Virya term
    </button>

  </div>
)}

                {/* =========================================
    SECTION 06 — VIPAKA
    ========================================= */}

{section.number === "06" && (
  <div className="add-herb-single-selection">

    <p className="add-herb-selection-description">
      Select post-digestive taste (Vipaka).
    </p>

    <div className="add-herb-single-options">

      {vipakaVocabulary.length > 0 ? (
        vipakaVocabulary.map((item) => (
          <label
            className="add-herb-option-card"
            key={item.id}
          >
            <input
              type="radio"
              name="vipaka"
              value={item.term}
              checked={formData.vipaka === item.term}
              onChange={(event) =>
                handleInputChange(
                  "vipaka",
                  event.target.value
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
          No active Vipaka terms are available. Add or activate
          Vipaka terms from Vocabulary Management.
        </p>
      )}

    </div>

    <button
      type="button"
      className="add-herb-add-term-button"
      onClick={() => setIsAddVipakaTermOpen(true)}
    >
      + Add new Vipaka term
    </button>

  </div>
)}
               

                {/* =========================================
                    SECTION 07 — PRABHAVA
                    ========================================= */}

                {section.number === "07" && (
                  <div className="add-herb-text-section">
                    <div className="add-herb-field">

                      <label htmlFor="prabhava">
                        Prabhava (Specific Action)
                      </label>

                      <textarea
                        id="prabhava"
                        className="add-herb-large-textarea"
                        value={formData.prabhava}
                        onChange={(event) =>
                          handleInputChange(
                            "prabhava",
                            event.target.value
                          ) }
                        placeholder="Describe the herb specific unexplainable action or unique property" />
                    </div>
                  </div>)}

                {/* =========================================
                    SECTION 08 — DOSHA AFFINITY
                    ========================================= */}

                {section.number === "08" && (
                  <div className="add-herb-dosha-section">
                    <div className="add-herb-dosha-grid">
                      <div className="add-herb-field">

                        <label htmlFor="vataEffect">
                          Vata
                        </label>

                        <select
                          id="vataEffect"
                          value={formData.dosha.vata}
                          onChange={(event) =>
                            handleDoshaChange(
                              "vata",
                              event.target.value
                            ) }  >
                              
                          <option value="">
                            Select effect
                          </option>
                          <option value="increase">
                            Increase
                          </option>
                          <option value="decrease">
                            Decrease
                          </option>
                          <option value="neutral">
                            Neutral
                          </option>
                        </select>
                      </div>

                      <div className="add-herb-field">
                        <label htmlFor="pittaEffect">
                          Pitta
                        </label>

                        <select
                          id="pittaEffect"
                          value={formData.dosha.pitta}
                          onChange={(event) =>
                            handleDoshaChange(
                              "pitta",
                              event.target.value
                            ) }  >
                          <option value="">
                            Select effect
                          </option>
                          <option value="increase">
                            Increase
                          </option>
                          <option value="decrease">
                            Decrease
                          </option>
                          <option value="neutral">
                            Neutral
                          </option>
                        </select>
                      </div>

                      <div className="add-herb-field">
                        <label htmlFor="kaphaEffect">
                          Kapha
                        </label>

                        <select
                          id="kaphaEffect"
                          value={formData.dosha.kapha}
                          onChange={(event) =>
                            handleDoshaChange(
                              "kapha",
                              event.target.value
                            ) }  >
                          <option value="">
                            Select effect
                          </option>
                          <option value="increase">
                            Increase
                          </option>
                          <option value="decrease">
                            Decrease
                          </option>
                          <option value="neutral">
                            Neutral
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="add-herb-field">

                      <label htmlFor="doshaNotes">
                        Dosha Balancing Notes
                      </label>

                      <textarea
                        id="doshaNotes"
                        value={formData.doshaNotes}
                        onChange={(event) =>
                          handleInputChange(
                            "doshaNotes",
                            event.target.value
                          ) }
                        placeholder="Clinical notes on Dosha effects..."
                      />
                    </div>
                  </div> )}

                {/* =========================================
                    SECTION 09 — DHATU AFFINITY
                    ========================================= */}

                {section.number === "09" && (
                  <div className="add-herb-selection-section">
                    <p className="add-herb-selection-description">
                      Select applicable Dhatus for this herb.
                    </p>

                    <div className="add-herb-option-grid">
                      {dhatuOptions.map((option) => (

                        <label
                          className="add-herb-option-card"
                          key={option.value}
                        >

                          <input
                            type="checkbox"
                            checked={formData.dhatu.includes(option.value)}
                            onChange={() =>
                              handleMultiSelect(
                                "dhatu",
                                option.value  )   }  />
                          <span>
                            {option.label}
                          </span>
                        </label>
                      ))}
                      <button
                      type="button"
                      className="add-herb-add-term-button"
                      onClick={() => setIsAddDhatuTermOpen(true)}>
                    ＋ Add new Dhatu term
                    </button>
                    </div>
                  </div> )}

                {/* =========================================
                    SECTION 10 — MALA AFFINITY
                    ========================================= */}
                     {section.number === "10" && (
  <div className="add-herb-selection-section">
    <p className="add-herb-selection-description">
      Select applicable Malas for this herb.
    </p>

    <div className="add-herb-option-grid">
      {malaOptions.length > 0 ? (
        malaOptions.map((item) => (
          <label
            className="add-herb-option-card"
            key={item.id}
          >
            <input
              type="checkbox"
              checked={formData.mala.includes(item.term)}
              onChange={() =>
                handleMultiSelect(
                  "mala",
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
          No active Mala terms are available. Add or activate
          Mala terms from Vocabulary Management.
        </p>
      )}
    </div>

    <button
      type="button"
      className="add-herb-add-term-button"
      onClick={() => setIsAddMalaTermOpen(true)}
    >
      ＋ Add new Mala term
    </button>
  </div>
)}
               

                {/* =========================================
                    SECTION 11 — SROTAS AFFINITY
                    ========================================= */}
                    {section.number === "11" && (
  <div className="add-herb-selection-section">
    <p className="add-herb-selection-description">
      Select applicable Srotas for this herb.
    </p>

    <div className="add-herb-option-grid">
      {srotasOptions.length > 0 ? (
        srotasOptions.map((item) => (
          <label
            className="add-herb-option-card"
            key={item.id}
          >
            <input
              type="checkbox"
              checked={formData.srotas.includes(item.term)}
              onChange={() =>
                handleMultiSelect(
                  "srotas",
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
          No active Srotas terms are available. Add or activate
          Srotas terms from Vocabulary Management.
        </p>
      )}
    </div>

    <button
      type="button"
      className="add-herb-add-term-button"
      onClick={() => setIsAddSrotasTermOpen(true)}
    >
      ＋ Add new Srotas term
    </button>
  </div>
)}

                {/* =========================================
                    SECTION 12 — KARMA / THERAPEUTIC ACTIONS
                    ========================================= */}

                {section.number === "12" && (
                  <div className="add-herb-therapeutic-section">
                    <div className="add-herb-field">

                      <label htmlFor="karma">
                        Ayurvedic Karma
                      </label>

                      <input
                        id="karma"
                        type="text"
                        value={formData.karma}
                        onChange={(event) =>
                          handleInputChange(
                            "karma",
                            event.target.value )  }
                        placeholder="e.g., Rasayana, Balya, Vatahar, Deepana..." />
                    </div>

                    <div className="add-herb-field">
                      <label htmlFor="therapeuticActions">
                        Therapeutic Actions
                      </label>

                      <textarea
                        id="therapeuticActions"
                        value={formData.therapeuticActions}
                        onChange={(event) =>
                          handleInputChange(
                            "therapeuticActions",
                            event.target.value ) }
                        placeholder="Describe the primary therapeutic actions..." />
                    </div>

                    <div className="add-herb-field">
                      <label htmlFor="clinicalIndications">
                        Clinical Indications
                      </label>

                      <textarea
                        id="clinicalIndications"
                        value={formData.clinicalIndications}
                        onChange={(event) =>
                          handleInputChange(
                            "clinicalIndications",
                            event.target.value
                          ) }
                        placeholder="List clinical indications and conditions treated..."  />
                    </div>
                  </div>  )}

                {/* =========================================
                    SECTION 13 — CLASSICAL REFERENCES
                    ========================================= */}

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
                                value={reference.source}
                                onChange={(event) =>
                                  handleReferenceChange(
                                    index,
                                    "source",
                                    event.target.value  )  }
                                placeholder="e.g., Charaka Samhita" />
                            </div>
                            <div className="add-herb-field">

                              <label>
                                Chapter
                              </label>

                              <input
                                type="text"
                                value={reference.chapter}
                                onChange={(event) =>
                                  handleReferenceChange(
                                    index,
                                    "chapter",
                                    event.target.value  ) }
                                placeholder="e.g., Sutrasthana Ch.1"
                              />
                            </div>

                            <div className="add-herb-field">

                              <label>
                                Verse / Shloka Reference
                              </label>

                              <input
                                type="text"
                                value={reference.verse}
                                onChange={(event) =>
                                  handleReferenceChange(
                                    index,
                                    "verse",
                                    event.target.value
                                  )
                                }
                                placeholder="e.g., 1.1-4"  />
                            </div>
                          </div>

                          <div className="add-herb-field">

                            <label>
                              Notes
                            </label>

                            <textarea
                              value={reference.notes}
                              onChange={(event) =>
                                handleReferenceChange(
                                  index,
                                  "notes",
                                  event.target.value
                                ) }
                              placeholder="Additional notes on the classical reference..."
                            />
                          </div>
                        </div>  ) )}
                    <button
                      type="button"
                      className="add-herb-add-reference-button"
                      onClick={addReference}
                    >
                      + Add another reference
                    </button>
                  </div> )}
                   </div> )}
                   </div>   ))}
                   </fieldset>

                   {isAddRasaTermOpen && (
  <div className="add-herb-term-modal-overlay">
    <div className="add-herb-term-modal">

      <div className="add-herb-term-modal-header">
        <div>
          <p className="add-herb-term-modal-label">
            VOCABULARY
          </p>
          <h2>Add new Rasa term</h2>
          <p>
            Add a standardized Rasa term for use in herb records.
          </p>
        </div>

        <button
          type="button"
          className="add-herb-term-modal-close"
          onClick={() => setIsAddRasaTermOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="add-herb-term-modal-form">

        <div className="add-herb-term-field">
          <label htmlFor="rasaTerm">
            Term
          </label>

          <input
            id="rasaTerm"
            type="text"
            placeholder="e.g. Madhura"
            value={rasaTermForm.term}
            onChange={(event) =>
              setRasaTermForm((previous) => ({
                ...previous,
                term: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="rasaEnglish">
            English meaning
          </label>

          <input
            id="rasaEnglish"
            type="text"
            placeholder="e.g. Sweet"
            value={rasaTermForm.english}
            onChange={(event) =>
              setRasaTermForm((previous) => ({
                ...previous,
                english: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="rasaDescription">
            Description
          </label>

          <textarea
            id="rasaDescription"
            rows="4"
            placeholder="Brief description of this Rasa term."
            value={rasaTermForm.description}
            onChange={(event) =>
              setRasaTermForm((previous) => ({
                ...previous,
                description: event.target.value
              }))
            }
          />
        </div>

      </div>

      <div className="add-herb-term-modal-actions">
        <button
          type="button"
          className="add-herb-term-cancel-button"
          onClick={() => setIsAddRasaTermOpen(false)}
        >
          Cancel
        </button>

        <button
  type="button"
  className="add-herb-term-save-button"
  onClick={handleAddRasaTerm}
>
  Add Term
</button>
      </div>

    </div>
  </div>
     )}

        {isAddGunaTermOpen && (
          <div className="add-herb-term-modal-overlay">
          <div className="add-herb-term-modal">
          <div className="add-herb-term-modal-header">
          <div>
          <p className="add-herb-term-modal-label">
            VOCABULARY
          </p>

          <h2>Add new Guna term</h2>

          <p>
            Add a standardized Guna term for use in herb records.
          </p>
        </div>

        <button
          type="button"
          className="add-herb-term-modal-close"
          onClick={() => setIsAddGunaTermOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="add-herb-term-modal-form">

        <div className="add-herb-term-field">
          <label htmlFor="gunaTerm">
            Term
          </label>

          <input
            id="gunaTerm"
            type="text"
            placeholder="e.g. Guru"
            value={gunaTermForm.term}
            onChange={(event) =>
              setGunaTermForm((previous) => ({
                ...previous,
                term: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="gunaEnglish">
            English meaning
          </label>

          <input
            id="gunaEnglish"
            type="text"
            placeholder="e.g. Heavy"
            value={gunaTermForm.english}
            onChange={(event) =>
              setGunaTermForm((previous) => ({
                ...previous,
                english: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="gunaDescription">
            Description
          </label>

          <textarea
            id="gunaDescription"
            rows="4"
            placeholder="Brief description of this Guna term."
            value={gunaTermForm.description}
            onChange={(event) =>
              setGunaTermForm((previous) => ({
                ...previous,
                description: event.target.value
              }))
            }
          />
        </div>

      </div>

      <div className="add-herb-term-modal-actions">

        <button
          type="button"
          className="add-herb-term-cancel-button"
          onClick={() => setIsAddGunaTermOpen(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="add-herb-term-save-button"
          onClick={handleAddGunaTerm}
        >
          Add Term
        </button>

      </div>

    </div>
  </div>
)}

{isAddDhatuTermOpen && (
  <div className="add-herb-term-modal-overlay">
    <div className="add-herb-term-modal">
      <div className="add-herb-term-modal-header">
        <div>
          <p className="add-herb-term-modal-label">VOCABULARY</p>

          <h2>Add new Dhatu term</h2>

          <p>
            Add a standardized Dhatu term for use in herb records.
          </p>
        </div>

        <button
          type="button"
          className="add-herb-term-modal-close"
          onClick={() => setIsAddDhatuTermOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="add-herb-term-modal-form">
        <div className="add-herb-term-field">
          <label htmlFor="dhatuTerm">Term</label>

          <input
            id="dhatuTerm"
            type="text"
            placeholder="e.g. Rasa"
            value={dhatuTermForm.term}
            onChange={(event) =>
              setDhatuTermForm((previous) => ({
                ...previous,
                term: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="dhatuEnglish">
            English meaning
          </label>

          <input
            id="dhatuEnglish"
            type="text"
            placeholder="e.g. Plasma"
            value={dhatuTermForm.english}
            onChange={(event) =>
              setDhatuTermForm((previous) => ({
                ...previous,
                english: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="dhatuDescription">
            Description
          </label>

          <textarea
            id="dhatuDescription"
            rows="4"
            placeholder="Brief description of this Dhatu term."
            value={dhatuTermForm.description}
            onChange={(event) =>
              setDhatuTermForm((previous) => ({
                ...previous,
                description: event.target.value
              }))
            }
          />
        </div>
      </div>

      <div className="add-herb-term-modal-actions">
        <button
          type="button"
          className="add-herb-term-cancel-button"
          onClick={() => setIsAddDhatuTermOpen(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="add-herb-term-save-button"
          onClick={handleAddDhatuTerm}
        >
          Add Term
        </button>
      </div>
    </div>
  </div>
)}

{isAddMalaTermOpen && (
  <div className="add-herb-term-modal-overlay">
    <div className="add-herb-term-modal">
      <div className="add-herb-term-modal-header">
        <div>
          <p className="add-herb-term-modal-label">
            VOCABULARY
          </p>

          <h2>Add new Mala term</h2>

          <p>
            Add a standardized Mala term for use in herb records.
          </p>
        </div>

        <button
          type="button"
          className="add-herb-term-modal-close"
          onClick={() => setIsAddMalaTermOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="add-herb-term-modal-form">
        <div className="add-herb-term-field">
          <label htmlFor="malaTerm">
            Term
          </label>

          <input
            id="malaTerm"
            type="text"
            placeholder="e.g. Mutra"
            value={malaTermForm.term}
            onChange={(event) =>
              setMalaTermForm((previous) => ({
                ...previous,
                term: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="malaEnglish">
            English meaning
          </label>

          <input
            id="malaEnglish"
            type="text"
            placeholder="e.g. Urine"
            value={malaTermForm.english}
            onChange={(event) =>
              setMalaTermForm((previous) => ({
                ...previous,
                english: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="malaDescription">
            Description
          </label>

          <textarea
            id="malaDescription"
            rows="4"
            placeholder="Brief description of this Mala term."
            value={malaTermForm.description}
            onChange={(event) =>
              setMalaTermForm((previous) => ({
                ...previous,
                description: event.target.value
              }))
            }
          />
        </div>
      </div>

      <div className="add-herb-term-modal-actions">
        <button
          type="button"
          className="add-herb-term-cancel-button"
          onClick={() => setIsAddMalaTermOpen(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="add-herb-term-save-button"
          onClick={handleAddMalaTerm}
        >
          Add Term
        </button>
      </div>
    </div>
  </div>
)}

{isAddSrotasTermOpen && (
  <div className="add-herb-term-modal-overlay">
    <div className="add-herb-term-modal">
      <div className="add-herb-term-modal-header">
        <div>
          <p className="add-herb-term-modal-label">
            VOCABULARY
          </p>

          <h2>Add new Srotas term</h2>

          <p>
            Add a standardized Srotas term for use in herb records.
          </p>
        </div>

        <button
          type="button"
          className="add-herb-term-modal-close"
          onClick={() => setIsAddSrotasTermOpen(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="add-herb-term-modal-form">
        <div className="add-herb-term-field">
          <label htmlFor="srotasTerm">Term</label>

          <input
            id="srotasTerm"
            type="text"
            placeholder="e.g. Pranavaha Srotas"
            value={srotasTermForm.term}
            onChange={(event) =>
              setSrotasTermForm((previous) => ({
                ...previous,
                term: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="srotasEnglish">
            English meaning
          </label>

          <input
            id="srotasEnglish"
            type="text"
            placeholder="e.g. Respiratory channels"
            value={srotasTermForm.english}
            onChange={(event) =>
              setSrotasTermForm((previous) => ({
                ...previous,
                english: event.target.value
              }))
            }
          />
        </div>

        <div className="add-herb-term-field">
          <label htmlFor="srotasDescription">
            Description
          </label>

          <textarea
            id="srotasDescription"
            rows="4"
            placeholder="Brief description of this Srotas term."
            value={srotasTermForm.description}
            onChange={(event) =>
              setSrotasTermForm((previous) => ({
                ...previous,
                description: event.target.value
              }))
            }
          />
        </div>
      </div>

      <div className="add-herb-term-modal-actions">
        <button
          type="button"
          className="add-herb-term-cancel-button"
          onClick={() => setIsAddSrotasTermOpen(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="add-herb-term-save-button"
          onClick={handleAddSrotasTerm}
        >
          Add Term
        </button>
      </div>
    </div>
  </div>
)}

{isAddViryaTermOpen && (
  <div className="add-herb-modal-overlay">
    <div className="add-herb-modal">

      <div className="add-herb-modal-header">
        <div>
          <p className="add-herb-modal-label">
            VOCABULARY
          </p>

          <h2>Add new Virya term</h2>

          <p>
            Add a new potency to the Virya vocabulary.
          </p>
        </div>

        <button
          type="button"
          className="add-herb-modal-close"
          onClick={() => setIsAddViryaTermOpen(false)}
        >
          ×
        </button>
      </div>

      <div className="add-herb-modal-form">

        <div className="add-herb-form-field">
          <label htmlFor="viryaTerm">
            Virya term
          </label>

          <input
            id="viryaTerm"
            type="text"
            value={viryaTermForm.term}
            onChange={(event) =>
              setViryaTermForm((previous) => ({
                ...previous,
                term: event.target.value
              }))
            }
            placeholder="e.g. Ushna"
          />
        </div>

        <div className="add-herb-form-field">
          <label htmlFor="viryaEnglish">
            English meaning
          </label>

          <input
            id="viryaEnglish"
            type="text"
            value={viryaTermForm.english}
            onChange={(event) =>
              setViryaTermForm((previous) => ({
                ...previous,
                english: event.target.value
              }))
            }
            placeholder="e.g. Hot"
          />
        </div>

        <div className="add-herb-form-field">
          <label htmlFor="viryaDescription">
            Description
          </label>

          <textarea
            id="viryaDescription"
            value={viryaTermForm.description}
            onChange={(event) =>
              setViryaTermForm((previous) => ({
                ...previous,
                description: event.target.value
              }))
            }
            placeholder="Describe the Virya term."
            rows="4"
          />
        </div>

      </div>

      <div className="add-herb-modal-actions">

        <button
          type="button"
          className="add-herb-modal-cancel"
          onClick={() => setIsAddViryaTermOpen(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="add-herb-modal-save"
          onClick={handleAddViryaTerm}
        >
          Add Virya term
        </button>

      </div>

    </div>
  </div>
)}

{isAddVipakaTermOpen && (
  <div className="add-herb-vipaka-modal-overlay">

    <div className="add-herb-vipaka-modal">

      <div className="add-herb-vipaka-modal-header">

        <div>
          <p className="add-herb-vipaka-modal-label">
            VOCABULARY
          </p>

          <h2>
            Add new Vipaka term
          </h2>

          <p>
            Add a new post-digestive taste to the Vipaka vocabulary.
          </p>
        </div>

        <button
          type="button"
          className="add-herb-vipaka-modal-close"
          onClick={() => setIsAddVipakaTermOpen(false)}
          aria-label="Close"
        >
          ×
        </button>

      </div>

      <div className="add-herb-vipaka-modal-form">

        <div className="add-herb-vipaka-form-field">

          <label htmlFor="vipakaTerm">
            Vipaka term
          </label>

          <input
            id="vipakaTerm"
            type="text"
            value={vipakaTermForm.term}
            onChange={(event) =>
              setVipakaTermForm((previous) => ({
                ...previous,
                term: event.target.value
              }))
            }
            placeholder="e.g. Madhura"
          />

        </div>

        <div className="add-herb-vipaka-form-field">

          <label htmlFor="vipakaEnglish">
            English meaning
          </label>

          <input
            id="vipakaEnglish"
            type="text"
            value={vipakaTermForm.english}
            onChange={(event) =>
              setVipakaTermForm((previous) => ({
                ...previous,
                english: event.target.value
              }))
            }
            placeholder="e.g. Sweet"
          />

        </div>

        <div className="add-herb-vipaka-form-field">

          <label htmlFor="vipakaDescription">
            Description
          </label>

          <textarea
            id="vipakaDescription"
            value={vipakaTermForm.description}
            onChange={(event) =>
              setVipakaTermForm((previous) => ({
                ...previous,
                description: event.target.value
              }))
            }
            placeholder="Describe the Vipaka term."
            rows="4"
          />

        </div>

      </div>

      <div className="add-herb-vipaka-modal-actions">

        <button
          type="button"
          className="add-herb-vipaka-modal-cancel"
          onClick={() => setIsAddVipakaTermOpen(false)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="add-herb-vipaka-modal-save"
          onClick={handleAddVipakaTerm}
        >
          Add Vipaka term
        </button>

      </div>

    </div>

  </div>
)}

      {/* =========================================
          VERIFICATION
          ========================================= */}

      <section className="add-herb-verification-card">
        <div className="add-herb-verification-column">

          <h2>
            Verification Status
          </h2>

          <select
            className="add-herb-verification-select"
            value={formData.verificationStatus}
            onChange={(event) =>
              handleInputChange(
                "verificationStatus",
                event.target.value
              ) } >

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
              Only authorized reviewers can mark an herb as Verified.
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
              —
            </strong>
          </div>

          <div className="add-herb-history-row">
            <span>
              Verified by
            </span>
            <strong>
              —
            </strong>
          </div>

          <div className="add-herb-history-row">
            <span>
              Last updated
            </span>
            <strong>
              —
            </strong>
          </div>
        </div>
      </section>

      {/* =========================================
          BOTTOM ACTIONS
          ========================================= */}

      <div className="add-herb-bottom-actions">
      <div className="add-herb-bottom-left">

{!isViewMode && !isReviewMode && (
  <button
    type="button"
    className="add-herb-save-button"
    onClick={() => handleSave("save")} >
    Save Changes
  </button>
)}

{!isViewMode && (
  <button
    type="button"
    className="add-herb-review-button"
    onClick={() => handleSave("review")}
  >
    {isReviewMode ? "Save Review" : "Submit for Review"}
  </button>
)}

{!isViewMode && !isReviewMode && (
  <button
    type="button"
    className="add-herb-bottom-draft-button"
    onClick={() => handleSave("draft")} >
    Save Draft
  </button> )}

</div>
        <button
          type="button"
          className="add-herb-bottom-cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>

      </div>
    </div> ) }
export default AddHerb