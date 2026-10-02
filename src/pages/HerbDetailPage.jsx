import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"
import herbDataset from "../data/herbDataset"

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


/* =========================================
   FORMAT ARRAY VALUES
   ========================================= */

function formatArray(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "—"
  }

  return value.join(", ")
}


/* =========================================
   HERB DETAIL PAGE
   ========================================= */

function HerbDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [isFavorite, setIsFavorite] = useState(false)


  /* =========================================
     FIND HERB FROM REAL DATASET
     ========================================= */

  const herb = herbDataset.find(
    (item) => item.id === id
  )


  /* =========================================
     CHECK FAVORITE STATUS
     ========================================= */

  useEffect(() => {
    if (!herb) {
      setIsFavorite(false)
      return
    }

    const savedFavorites =
      localStorage.getItem("favoriteHerbs")

    if (!savedFavorites) {
      setIsFavorite(false)
      return
    }

    try {
      const favorites = JSON.parse(savedFavorites)

      const alreadyFavorite = favorites.some(
        (item) => item.id === herb.id
      )

      setIsFavorite(alreadyFavorite)
    } catch (error) {
      console.error(
        "Unable to load favorite herbs:",
        error
      )

      setIsFavorite(false)
    }
  }, [id, herb])


  /* =========================================
     ADD / REMOVE FAVORITE
     ========================================= */

  const handleFavorite = () => {
    if (!herb) return

    const savedFavorites =
      localStorage.getItem("favoriteHerbs")

    let favorites = []

    if (savedFavorites) {
      try {
        favorites = JSON.parse(savedFavorites)
      } catch (error) {
        console.error(
          "Unable to read favorite herbs:",
          error
        )

        favorites = []
      }
    }

    const alreadyFavorite = favorites.some(
      (item) => item.id === herb.id
    )

    let updatedFavorites

    if (alreadyFavorite) {
      updatedFavorites = favorites.filter(
        (item) => item.id !== herb.id
      )
    } else {
      updatedFavorites = [
        ...favorites,
        herb,
      ]
    }

    localStorage.setItem(
      "favoriteHerbs",
      JSON.stringify(updatedFavorites)
    )

    setIsFavorite(!alreadyFavorite)
  }


  /* =========================================
     HERB NOT FOUND
     ========================================= */

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
                onClick={() =>
                  navigate("/herb-library")
                }
              >
                Back to Herb Library
              </button>

            </div>

          </main>

        </div>

      </div>
    )
  }


  /* =========================================
     REAL DATA PREPARATION
     ========================================= */

  const regionalNames =
    Array.isArray(herb.regionalNames)
      ? herb.regionalNames.join(", ")
      : herb.regionalNames || "—"


  const rasa = formatArray(herb.rasa)
  const guna = formatArray(herb.guna)


  const dhatu = Array.isArray(herb.dhatu)
    ? herb.dhatu
    : []


  const mala = Array.isArray(herb.mala)
    ? herb.mala
    : []


  const srotas = Array.isArray(herb.srotas)
    ? herb.srotas
    : []


  const karma = Array.isArray(herb.karma)
    ? herb.karma
    : []


  const indications =
    Array.isArray(herb.indications)
      ? herb.indications
      : []


  return (
    <div className="herb-detail-layout">

      <DashboardNavbar />


      <div className="herb-detail-body">

        <Sidebar />


        <main className="herb-detail-content">

          <div className="herb-detail-inner">


            {/* =========================================
                BACK
                ========================================= */}

            <button
              className="detail-back-button"
              type="button"
              onClick={() =>
                navigate("/herb-library")
              }
            >
              ← Back to Herb Library
            </button>


            {/* =========================================
                HEADER
                ========================================= */}

            <section className="herb-detail-header">

              <div className="herb-detail-heading">

                <div className="herb-detail-icon-wrapper">
                  <LeafIcon />
                </div>


                <div>

                  <p className="herb-detail-breadcrumb">
                    HERB LIBRARY / HERB INFORMATION
                  </p>


                  <h1>
                    {herb.englishName}
                  </h1>


                  <em>
                    {herb.botanicalName || "—"}
                  </em>

                </div>

              </div>


            </section>


            {/* =========================================
                BASIC INFORMATION
                ========================================= */}

            <section className="herb-basic-section">

              <div className="detail-section-heading">

                <p>
                  HERB IDENTITY
                </p>

                <h2>
                  Basic information
                </h2>

              </div>


              <div className="herb-basic-grid">

                <DetailField
                  label="ENGLISH NAME"
                  value={herb.englishName}
                />


                <DetailField
                  label="REGIONAL NAMES"
                  value={regionalNames}
                />


                <DetailField
                  label="BOTANICAL NAME"
                  value={herb.botanicalName}
                />


                <DetailField
                  label="PART USED"
                  value={herb.partUsed}
                />


                <DetailField
                  label="HERB ID"
                  value={herb.id}
                />


                <DetailField
                  label="VERIFICATION STATUS"
                  value={herb.verificationStatus}
                />

              </div>

            </section>


            {/* =========================================
                AYURVEDIC PROFILE
                ========================================= */}

            <section className="herb-properties-section">

              <div className="detail-section-heading">

                <p>
                  AYURVEDIC PROFILE
                </p>

                <h2>
                  Classical properties
                </h2>

              </div>


              <div className="herb-properties-grid">

                <PropertyCard
                  label="RASA"
                  value={rasa}
                />


                <PropertyCard
                  label="GUNA"
                  value={guna}
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


            {/* =========================================
                DOSHA
                ========================================= */}

            <section className="detail-data-section">

              <div className="detail-section-heading">

                <p>
                  DOSHA AFFINITY
                </p>

                <h2>
                  Dosha actions
                </h2>

              </div>


              <div className="detail-data-grid">

                <PropertyCard
                  label="VATA"
                  value={herb.dosha?.vata}
                />


                <PropertyCard
                  label="PITTA"
                  value={herb.dosha?.pitta}
                />


                <PropertyCard
                  label="KAPHA"
                  value={herb.dosha?.kapha}
                />

              </div>

            </section>


            {/* =========================================
                DHATU
                ========================================= */}

            <section className="detail-data-section">

              <div className="detail-section-heading">

                <p>
                  DHATU AFFINITY
                </p>

                <h2>
                  Dhatu actions
                </h2>

              </div>


              <div className="detail-data-grid">

                {dhatu.length > 0 ? (

                  dhatu.map((item, index) => (

                    <PropertyCard
                      key={`dhatu-${index}`}
                      label={`DHATU ${index + 1}`}
                      value={item}
                    />

                  ))

                ) : (

                  <PropertyCard
                    label="DHATU"
                    value="—"
                  />

                )}

              </div>

            </section>


            {/* =========================================
                MALA
                ========================================= */}

            <section className="detail-data-section">

              <div className="detail-section-heading">

                <p>
                  MALA AFFINITY
                </p>

                <h2>
                  Mala actions
                </h2>

              </div>


              <div className="detail-data-grid">

                {mala.length > 0 ? (

                  mala.map((item, index) => {

                    const [name, action] =
                      String(item).split(":")


                    return (
                      <PropertyCard
                        key={`mala-${index}`}
                        label={
                          name
                            ? name.trim().toUpperCase()
                            : `MALA ${index + 1}`
                        }
                        value={
                          action
                            ? action.trim()
                            : item
                        }
                      />
                    )

                  })

                ) : (

                  <PropertyCard
                    label="MALA"
                    value="—"
                  />

                )}

              </div>

            </section>


            {/* =========================================
                SROTAS
                ========================================= */}

            <section className="detail-data-section">

              <div className="detail-section-heading">

                <p>
                  SROTAS AFFINITY
                </p>

                <h2>
                  Srotas actions
                </h2>

              </div>


              <div className="detail-data-grid srotas-grid">

                {srotas.length > 0 ? (

                  srotas.map((item, index) => (

                    <PropertyCard
                      key={`srotas-${index}`}
                      label={`SROTAS ${index + 1}`}
                      value={item}
                    />

                  ))

                ) : (

                  <PropertyCard
                    label="SROTAS"
                    value="—"
                  />

                )}

              </div>

            </section>


            {/* =========================================
                PRABHAVA
                ========================================= */}

            <section className="detail-data-section">

              <div className="detail-section-heading">

                <p>
                  SPECIAL ACTION
                </p>

                <h2>
                  Prabhava
                </h2>

              </div>


              <div className="major-disease-card">

                <p>
                  {herb.prabhava || "—"}
                </p>

              </div>

            </section>


            {/* =========================================
                AVAYAVA
                ========================================= */}

            <section className="detail-data-section">

              <div className="detail-section-heading">

                <p>
                  TARGET ORGANS
                </p>

                <h2>
                  Avayava
                </h2>

              </div>


              <div className="major-disease-card">

                <p>
                  {formatArray(herb.avayava)}
                </p>

              </div>

            </section>


            {/* =========================================
                KARMA
                ========================================= */}

            <section className="detail-data-section">

              <div className="detail-section-heading">

                <p>
                  THERAPEUTIC ACTIONS
                </p>

                <h2>
                  Karma
                </h2>

              </div>


              <div className="herb-properties-grid karma-grid">

                <PropertyCard
                  label="KARMA"
                  value={formatArray(karma)}
                />

              </div>

            </section>


            {/* =========================================
                MAJOR DISEASES / INDICATIONS
                ========================================= */}

            <section className="detail-data-section">

              <div className="detail-section-heading">

                <p>
                  CLINICAL INDICATIONS
                </p>

                <h2>
                  Major diseases / indications
                </h2>

              </div>


              <div className="major-disease-card">

                <p>
                  {formatArray(indications)}
                </p>

              </div>

            </section>


            {/* =========================================
                KNOWLEDGE NOTE
                ========================================= */}

            <section className="herb-detail-note">

              <span>
                i
              </span>


              <div>

                <strong>
                  Knowledge record
                </strong>


                <p>
                  Ayurvedic attributes shown here are
                  structured knowledge fields from the herb
                  knowledge base. The complete record,
                  including classical references and
                  additional source information, will be
                  connected to the underlying dataset during
                  backend integration.
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