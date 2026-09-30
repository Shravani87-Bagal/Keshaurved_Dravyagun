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

function DetailField({ label, value }) {
  return (
    <div className="detail-field">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  )
}

function PropertyCard({ label, value }) {
  return (
    <div className="property-card">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  )
}

function HerbDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isFavorite, setIsFavorite] = useState(false)

  /*
    Temporary frontend records.

    These IDs are intentionally the same as the IDs used
    in HerbLibrary.jsx.

    Later, these temporary records will be replaced by
    the actual herb dataset.
  */

  const herbs = [
    {
      id: "HERB_REC_0001",
      englishName: "Ashwagandha",
      sanskritName: "—",
      botanicalName: "Withania somnifera",
      localName: "—",
      family: "—",
      partUsed: "Root",

      rasa: "Madhura, Tikta",
      guna: "Laghu, Snigdha",
      virya: "Ushna",
      vipaka: "Madhura",

      dosha: {
        vata: "Decreases",
        pitta: "—",
        kapha: "Decreases",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Balya, Rasayana",
      otherKarma: "—",

      majorDiseases:
        "—",
    },

    {
      id: "HERB_REC_0002",
      englishName: "Guduchi",
      sanskritName: "—",
      botanicalName: "Tinospora cordifolia",
      localName: "—",
      family: "—",
      partUsed: "Stem",

      rasa: "Tikta, Kashay",
      guna: "Laghu, Snigdha",
      virya: "Ushna",
      vipaka: "Madhura",

      dosha: {
        vata: "—",
        pitta: "—",
        kapha: "—",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Rasayana, Deepana",
      otherKarma: "—",

      majorDiseases:
        "Vaatrakt, Jwar, Kamala, Pandu, Prameha, Kushta, Daah, Krimirog, Visha",
    },

    {
      id: "HERB_REC_0003",
      englishName: "Shatavari",
      sanskritName: "—",
      botanicalName: "Asparagus racemosus",
      localName: "—",
      family: "—",
      partUsed: "Root",

      rasa: "Madhura, Tikta",
      guna: "Guru, Snigdha",
      virya: "Sheeta",
      vipaka: "Madhura",

      dosha: {
        vata: "Decreases",
        pitta: "Decreases",
        kapha: "—",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Rasayana, Stanyajanana",
      otherKarma: "—",

      majorDiseases: "—",
    },

    {
      id: "HERB_REC_0004",
      englishName: "Tulsi",
      sanskritName: "—",
      botanicalName: "Ocimum tenuiflorum",
      localName: "—",
      family: "—",
      partUsed: "Leaves",

      rasa: "Katu, Tikta",
      guna: "Laghu, Ruksha",
      virya: "Ushna",
      vipaka: "Katu",

      dosha: {
        vata: "Decreases",
        pitta: "—",
        kapha: "Decreases",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Deepana, Kaphaghna",
      otherKarma: "—",

      majorDiseases: "—",
    },

    {
      id: "HERB_REC_0005",
      englishName: "Yashtimadhu",
      sanskritName: "—",
      botanicalName: "Glycyrrhiza glabra",
      localName: "—",
      family: "—",
      partUsed: "Root",

      rasa: "Madhura",
      guna: "Guru, Snigdha",
      virya: "Sheeta",
      vipaka: "Madhura",

      dosha: {
        vata: "Decreases",
        pitta: "Decreases",
        kapha: "—",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Rasayana, Varnya",
      otherKarma: "—",

      majorDiseases: "—",
    },

    {
      id: "HERB_REC_0006",
      englishName: "Neem",
      sanskritName: "—",
      botanicalName: "Azadirachta indica",
      localName: "—",
      family: "—",
      partUsed: "Leaves",

      rasa: "Tikta, Kashay",
      guna: "Laghu, Ruksha",
      virya: "Sheeta",
      vipaka: "Katu",

      dosha: {
        vata: "—",
        pitta: "Decreases",
        kapha: "Decreases",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Krimighna, Kusthaghna",
      otherKarma: "—",

      majorDiseases: "—",
    },

    {
      id: "HERB_REC_0007",
      englishName: "Haritaki",
      sanskritName: "—",
      botanicalName: "Terminalia chebula",
      localName: "—",
      family: "—",
      partUsed: "Fruit",

      rasa: "Kashay",
      guna: "Laghu, Ruksha",
      virya: "Ushna",
      vipaka: "Madhura",

      dosha: {
        vata: "Decreases",
        pitta: "—",
        kapha: "—",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Anulomana, Rasayana",
      otherKarma: "—",

      majorDiseases: "—",
    },

    {
      id: "HERB_REC_0008",
      englishName: "Amalaki",
      sanskritName: "—",
      botanicalName: "Phyllanthus emblica",
      localName: "—",
      family: "—",
      partUsed: "Fruit",

      rasa: "Amla, Madhura, Tikta, Kashay, Katu",
      guna: "Laghu, Ruksha",
      virya: "Sheeta",
      vipaka: "Madhura",

      dosha: {
        vata: "—",
        pitta: "Decreases",
        kapha: "—",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Rasayana, Vayasthapana",
      otherKarma: "—",

      majorDiseases: "—",
    },

    {
      id: "HERB_REC_0009",
      englishName: "Turmeric",
      sanskritName: "—",
      botanicalName: "Curcuma longa",
      localName: "—",
      family: "—",
      partUsed: "Rhizome",

      rasa: "Katu, Tikta",
      guna: "Laghu, Ruksha",
      virya: "Ushna",
      vipaka: "Katu",

      dosha: {
        vata: "Decreases",
        pitta: "—",
        kapha: "Decreases",
      },

      dhatu: {
        rasa: "—",
        rakta: "—",
        mamsa: "—",
        meda: "—",
        asthi: "—",
        majja: "—",
        shukra: "—",
      },

      mala: {
        purisha: "—",
        mutra: "—",
        sweda: "—",
      },

      srotas: {
        pranavaha: "—",
        annavaha: "—",
        udakavaha: "—",
        rasavaha: "—",
        raktavaha: "—",
        mamsavaha: "—",
        medovaha: "—",
        asthivaha: "—",
        majjavaha: "—",
        shukravaha: "—",
        mutravaha: "—",
        swedavaha: "—",
        purishavaha: "—",
        artavavaha: "—",
      },

      importantKarma: "Kaphaghna, Krimighna",
      otherKarma: "—",

      majorDiseases: "—",
    },
  ]

  const herb = herbs.find((item) => item.id === id)

  useEffect(() => {
    if (!herb) {
      setIsFavorite(false)
      return
    }

    const savedFavorites = localStorage.getItem("favoriteHerbs")

    if (!savedFavorites) {
      setIsFavorite(false)
      return
    }

    const favorites = JSON.parse(savedFavorites)

    const alreadyFavorite = favorites.some(
      (item) => item.id === herb.id
    )

    setIsFavorite(alreadyFavorite)
  }, [id, herb])

  const handleFavorite = () => {
    if (!herb) return

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

                  <h1>{herb.englishName}</h1>

                  <em>{herb.botanicalName}</em>
                </div>
              </div>

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

            {/* BASIC INFORMATION */}
            <section className="herb-basic-section">
              <div className="detail-section-heading">
                <p>HERB IDENTITY</p>
                <h2>Basic information</h2>
              </div>

              <div className="herb-basic-grid">
                <DetailField
                  label="ENGLISH NAME"
                  value={herb.englishName}
                />

                <DetailField
                  label="SANSKRIT NAME"
                  value={herb.sanskritName}
                />

                <DetailField
                  label="BOTANICAL NAME"
                  value={herb.botanicalName}
                />

                <DetailField
                  label="LOCAL NAME"
                  value={herb.localName}
                />

                <DetailField
                  label="FAMILY"
                  value={herb.family}
                />

                <DetailField
                  label="PART USED"
                  value={herb.partUsed}
                />
              </div>
            </section>

            {/* AYURVEDIC PROFILE */}
            <section className="herb-properties-section">
              <div className="detail-section-heading">
                <p>AYURVEDIC PROFILE</p>
                <h2>Classical properties</h2>
              </div>

              <div className="herb-properties-grid">
                <PropertyCard
                  label="RASA"
                  value={herb.rasa}
                />

                <PropertyCard
                  label="GUNA"
                  value={herb.guna}
                />

                <PropertyCard
                  label="VIRYA"
                  value={herb.virya}
                />

                <PropertyCard
                  label="VIPAKA"
                  value={herb.vipaka}
                />
              </div>
            </section>

            {/* DOSHA */}
            <section className="detail-data-section">
              <div className="detail-section-heading">
                <p>DOSHA AFFINITY</p>
                <h2>Dosha actions</h2>
              </div>

              <div className="detail-data-grid">
                <PropertyCard
                  label="VATA"
                  value={herb.dosha.vata}
                />

                <PropertyCard
                  label="PITTA"
                  value={herb.dosha.pitta}
                />

                <PropertyCard
                  label="KAPHA"
                  value={herb.dosha.kapha}
                />
              </div>
            </section>

            {/* DHATU */}
            <section className="detail-data-section">
              <div className="detail-section-heading">
                <p>DHATU AFFINITY</p>
                <h2>Dhatu actions</h2>
              </div>

              <div className="detail-data-grid">
                <PropertyCard
                  label="RASA DHATU"
                  value={herb.dhatu.rasa}
                />

                <PropertyCard
                  label="RAKTA DHATU"
                  value={herb.dhatu.rakta}
                />

                <PropertyCard
                  label="MAMSA DHATU"
                  value={herb.dhatu.mamsa}
                />

                <PropertyCard
                  label="MEDA DHATU"
                  value={herb.dhatu.meda}
                />

                <PropertyCard
                  label="ASTHI DHATU"
                  value={herb.dhatu.asthi}
                />

                <PropertyCard
                  label="MAJJA DHATU"
                  value={herb.dhatu.majja}
                />

                <PropertyCard
                  label="SHUKRA DHATU"
                  value={herb.dhatu.shukra}
                />
              </div>
            </section>

            {/* MALA */}
            <section className="detail-data-section">
              <div className="detail-section-heading">
                <p>MALA AFFINITY</p>
                <h2>Mala actions</h2>
              </div>

              <div className="detail-data-grid">
                <PropertyCard
                  label="PURISHA"
                  value={herb.mala.purisha}
                />

                <PropertyCard
                  label="MUTRA"
                  value={herb.mala.mutra}
                />

                <PropertyCard
                  label="SWEDA"
                  value={herb.mala.sweda}
                />
              </div>
            </section>

            {/* SROTAS */}
            <section className="detail-data-section">
              <div className="detail-section-heading">
                <p>SROTAS AFFINITY</p>
                <h2>Srotas actions</h2>
              </div>

              <div className="detail-data-grid srotas-grid">
                <PropertyCard
                  label="PRANAVAHA"
                  value={herb.srotas.pranavaha}
                />

                <PropertyCard
                  label="ANNAVAHA"
                  value={herb.srotas.annavaha}
                />

                <PropertyCard
                  label="UDAKAVAHA"
                  value={herb.srotas.udakavaha}
                />

                <PropertyCard
                  label="RASAVAHA"
                  value={herb.srotas.rasavaha}
                />

                <PropertyCard
                  label="RAKTAVAHA"
                  value={herb.srotas.raktavaha}
                />

                <PropertyCard
                  label="MAMSAVAHA"
                  value={herb.srotas.mamsavaha}
                />

                <PropertyCard
                  label="MEDOVAHA"
                  value={herb.srotas.medovaha}
                />

                <PropertyCard
                  label="ASTHIVAHA"
                  value={herb.srotas.asthivaha}
                />

                <PropertyCard
                  label="MAJJAVAHA"
                  value={herb.srotas.majjavaha}
                />

                <PropertyCard
                  label="SHUKRAVAHA"
                  value={herb.srotas.shukravaha}
                />

                <PropertyCard
                  label="MUTRAVAHA"
                  value={herb.srotas.mutravaha}
                />

                <PropertyCard
                  label="SWEDAVAHA"
                  value={herb.srotas.swedavaha}
                />

                <PropertyCard
                  label="PURISHAVAHA"
                  value={herb.srotas.purishavaha}
                />

                <PropertyCard
                  label="ARTAVAVAHA"
                  value={herb.srotas.artavavaha}
                />
              </div>
            </section>

            {/* KARMA */}
            <section className="detail-data-section">
              <div className="detail-section-heading">
                <p>THERAPEUTIC ACTIONS</p>
                <h2>Karma</h2>
              </div>

              <div className="herb-properties-grid karma-grid">
                <PropertyCard
                  label="IMPORTANT KARMA"
                  value={herb.importantKarma}
                />

                <PropertyCard
                  label="OTHER KARMA"
                  value={herb.otherKarma}
                />
              </div>
            </section>

            {/* MAJOR DISEASES */}
            <section className="detail-data-section">
              <div className="detail-section-heading">
                <p>CLINICAL INDICATIONS</p>
                <h2>Major diseases / indications</h2>
              </div>

              <div className="major-disease-card">
                <p>{herb.majorDiseases || "—"}</p>
              </div>
            </section>

            {/* KNOWLEDGE NOTE */}
            <section className="herb-detail-note">
              <span>i</span>

              <div>
                <strong>Knowledge record</strong>

                <p>
                  Ayurvedic attributes shown here are structured knowledge
                  fields from the herb knowledge base. The complete record,
                  including classical references and additional source
                  information, will be connected to the underlying dataset
                  during backend integration.
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