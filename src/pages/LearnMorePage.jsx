import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/LearnMorePage.css"

function LearnMorePage() {
  const navigate = useNavigate()

  const closeLearnMore = () => {
    navigate("/doctor")
  }

  return (
    <div className="learn-more-page-layout">

      {/* Top Navbar */}
      <DashboardNavbar />

      <div className="learn-more-page-body">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="learn-more-page-content">

          {/* Dark Overlay */}
          <div className="learn-more-overlay">

            {/* Learn More Modal */}
            <div className="learn-more-modal">

              {/* Close Button */}
              <button
                type="button"
                className="learn-more-close-button"
                onClick={closeLearnMore}
                aria-label="Close learn more"
              >
                ×
              </button>


              {/* Header */}
              <div className="learn-more-header">

                <p className="learn-more-label">
                  ABOUT THE PLATFORM
                </p>

                <h1>
                  Learn more about Dravyaguna
                </h1>

                <p>
                  Understand how the Ayurvedic Herb Intelligence Engine
                  supports structured herb research and clinical information retrieval.
                </p>

              </div>


              {/* Content */}
              <div className="learn-more-content">


                {/* What is Dravyaguna */}
                <section className="learn-more-section">

                  <h2>
                    What is Dravyaguna?
                  </h2>

                  <p>
                    Dravyaguna is an Ayurvedic Herb Intelligence Engine
                    designed to help practitioners explore structured
                    Ayurvedic herb knowledge and identify relevant herbs
                    based on clinical and classical parameters.
                  </p>

                </section>


                {/* How it works */}
                <section className="learn-more-section">

                  <p className="learn-more-section-label">
                    HOW IT WORKS
                  </p>

                  <h2>
                    From search to relevant herbs
                  </h2>


                  <div className="learn-more-steps">

                    <div className="learn-more-step">

                      <div className="learn-more-step-number">
                        01
                      </div>

                      <div>
                        <h3>
                          Search
                        </h3>

                        <p>
                          Enter a clinical problem or select relevant
                          Ayurvedic parameters.
                        </p>
                      </div>

                    </div>


                    <div className="learn-more-step">

                      <div className="learn-more-step-number">
                        02
                      </div>

                      <div>
                        <h3>
                          Match
                        </h3>

                        <p>
                          The system evaluates herbs against the
                          selected criteria.
                        </p>
                      </div>

                    </div>


                    <div className="learn-more-step">

                      <div className="learn-more-step-number">
                        03
                      </div>

                      <div>
                        <h3>
                          Rank
                        </h3>

                        <p>
                          Relevant herbs are ranked using weighted
                          Ayurvedic parameters.
                        </p>
                      </div>

                    </div>


                    <div className="learn-more-step">

                      <div className="learn-more-step-number">
                        04
                      </div>

                      <div>
                        <h3>
                          Review
                        </h3>

                        <p>
                          Explore herb profiles, match percentage,
                          references, and scoring details.
                        </p>
                      </div>

                    </div>

                  </div>

                </section>


                {/* Capabilities */}
                <section className="learn-more-section">

                  <p className="learn-more-section-label">
                    CORE CAPABILITIES
                  </p>

                  <h2>
                    What you can do
                  </h2>


                  <div className="learn-more-capabilities">

                    <div className="learn-more-capability">
                      <strong>
                        Simple Search
                      </strong>

                      <span>
                        Search herbs using a clinical problem or description.
                      </span>
                    </div>


                    <div className="learn-more-capability">
                      <strong>
                        Detailed Search
                      </strong>

                      <span>
                        Filter herbs using structured Ayurvedic parameters.
                      </span>
                    </div>


                    <div className="learn-more-capability">
                      <strong>
                        Relevance Ranking
                      </strong>

                      <span>
                        View herbs ranked according to matching criteria.
                      </span>
                    </div>


                    <div className="learn-more-capability">
                      <strong>
                        Herb Comparison
                      </strong>

                      <span>
                        Compare Ayurvedic characteristics across herbs.
                      </span>
                    </div>

                  </div>

                </section>


                {/* Clinical Note */}
                <section className="learn-more-note">

                  <div className="learn-more-note-icon">
                    !
                  </div>

                  <div>

                    <strong>
                      Clinical use note
                    </strong>

                    <p>
                      Dravyaguna is intended to support research and
                      clinical information retrieval. It does not replace
                      professional Ayurvedic judgment or established
                      clinical guidance.
                    </p>

                  </div>

                </section>


              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default LearnMorePage