import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import "../styles/HerbDetailPage.css"

function LeafIcon() {
  return (
    <div className="detail-leaf-icon">
      <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M48.5 10.5C35.5 12 23.2 17.2 16.5 26.3C9.8 35.4 11.8 47 12.4 49.6C15 49.9 27.5 49.5 36.1 41.2C44.3 33.3 48.4 20.7 48.5 10.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M13 50C21.5 41.2 29.5 34.3 41.5 25.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        <path
          d="M23.5 39.5C20.5 38.2 18.2 36.3 16.5 33.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <path
          d="M31 32.8C28.8 31.8 26.7 30.3 25 28.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function HerbDetailPage() {
    const navigate = useNavigate()
    const { id } = useParams()
  
    const [isFavorite, setIsFavorite] = useState(false)
  
    const herbs = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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

  const herb = herbs.find((item) => item.id === Number(id))
  useEffect(() => {
    const currentHerb = herbs.find(
      (item) => item.id === Number(id)
    )
  
    if (!currentHerb) {
      return
    }
  
    const savedFavorites = localStorage.getItem("favoriteHerbs")
  
    if (!savedFavorites) {
      setIsFavorite(false)
      return
    }
  
    const favorites = JSON.parse(savedFavorites)
  
    const alreadyFavorite = favorites.some(
      (item) => item.id === currentHerb.id
    )
  
    setIsFavorite(alreadyFavorite)
  }, [id])

  const handleFavorite = () => {
    const savedFavorites = localStorage.getItem("favoriteHerbs")
  
    const favorites = savedFavorites
      ? JSON.parse(savedFavorites)
      : []
  
    const alreadyFavorite = favorites.some(
      (item) => item.id === herb.id
    )
  
    let updatedFavorites
  
    if (alreadyFavorite) {
      updatedFavorites = favorites.filter(
        (item) => item.id !== herb.id
      )
    } else {
      updatedFavorites = [...favorites, herb]
    }
  
    localStorage.setItem(
      "favoriteHerbs",
      JSON.stringify(updatedFavorites)
    )
  
    setIsFavorite(!alreadyFavorite)
  }

  if (!herb) {
    return (
      <div className="herb-detail-layout">
        <DashboardNavbar />

        <div className="herb-detail-body">
          <Sidebar />

          <main className="herb-detail-content">
            <div className="herb-detail-inner">
              <h1>Herb not found</h1>

              <button
                type="button"
                onClick={() => navigate("/herb-library")}
              >
                Back to Herb Library
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="herb-detail-layout">
      <DashboardNavbar />

      <div className="herb-detail-body">
        <Sidebar />

        <main className="herb-detail-content">
          <div className="herb-detail-inner">

            {/* BACK */}
            <button
              className="detail-back-button"
              type="button"
              onClick={() => navigate("/herb-library")}
            >
              ← Back to Herb Library
            </button>

            {/* HEADER */}
            <section className="herb-detail-header">

              <div className="herb-detail-heading">

                <div className="herb-detail-icon-wrapper">
                  <LeafIcon />
                </div>

                <div>
                  <p className="herb-detail-breadcrumb">
                    HERB LIBRARY / HERB INFORMATION
                  </p>

                  <h1>{herb.name}</h1>

                  <em>{herb.scientificName}</em>
                </div>

              </div>

              {/* FAVORITE BUTTON */}
              <button
  className={`herb-favorite-button ${
    isFavorite ? "favorite-active" : ""
  }`}
  type="button"
  onClick={handleFavorite}
>
  <span className="favorite-heart">
    {isFavorite ? "♥" : "♡"}
  </span>

  <span>
    {isFavorite
      ? "Saved to favorites"
      : "Add to favorites"}
  </span>
</button>

            </section>

            {/* DESCRIPTION */}
            <section className="herb-detail-description-card">

              <div className="detail-status">
                <span>✓</span>
                {herb.status}
              </div>

              <p>
                {herb.description}
              </p>

            </section>

            {/* AYURVEDIC PROPERTIES */}
            <section className="herb-properties-section">

              <div className="detail-section-heading">
                <p>AYURVEDIC PROFILE</p>
                <h2>Classical properties</h2>
              </div>

              <div className="herb-properties-grid">

                <div className="property-card">
                  <span>RASA</span>
                  <strong>{herb.rasa}</strong>
                </div>

                <div className="property-card">
                  <span>GUNA</span>
                  <strong>{herb.guna}</strong>
                </div>

                <div className="property-card">
                  <span>VIRYA</span>
                  <strong>{herb.virya}</strong>
                </div>

                <div className="property-card">
                  <span>VIPAKA</span>
                  <strong>{herb.vipaka}</strong>
                </div>

                <div className="property-card">
                  <span>PRABHAVA</span>
                  <strong>—</strong>
                </div>

                <div className="property-card">
                  <span>DOSHA</span>
                  <strong>{herb.dosha}</strong>
                </div>

                <div className="property-card">
                  <span>DHATU</span>
                  <strong>{herb.dhatu}</strong>
                </div>

                <div className="property-card">
                  <span>KARMA</span>
                  <strong>{herb.karma}</strong>
                </div>

              </div>

            </section>

            {/* RESEARCH NOTE */}
            <section className="herb-detail-note">
              <span>i</span>

              <div>
                <strong>Knowledge record</strong>

                <p>
                  Ayurvedic attributes shown here are structured knowledge
                  fields intended for clinical and research-oriented
                  exploration. Classical references and verification status
                  should be maintained with the underlying herb record.
                </p>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}

export default HerbDetailPage