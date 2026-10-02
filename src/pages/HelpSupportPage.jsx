import { useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/SettingsPage.css"
import "../styles/HelpSupportPage.css"

function HelpSupportPage() {
  const navigate = useNavigate()

  const [openFaq, setOpenFaq] = useState(null)
  const [searchText, setSearchText] = useState("")

  const [activeHelpTopic, setActiveHelpTopic] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)

  const [supportTopic, setSupportTopic] = useState("")
  const [supportMessage, setSupportMessage] = useState("")
  const [supportSubmitted, setSupportSubmitted] = useState(false)

  const closeHelp = () => {
    navigate("/doctor")
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  /* =========================================
     QUICK HELP CONTENT
  ========================================= */

  const helpTopics = {
    search: {
      icon: "🔎",
      title: "Search Guide",
      description:
        "Learn how Simple Search and Detailed Search help you find relevant Ayurvedic herbs.",

      sections: [
        {
          title: "Simple Search",
          text:
            "Describe what you are looking for using natural language. The platform uses your requirement to identify herbs that may be relevant to your search."
        },
        {
          title: "Detailed Search",
          text:
            "Detailed Search allows you to specify Ayurvedic attributes such as Rasa, Guna, Virya, Vipaka, Dosha, Srotas and other properties."
        },
        {
          title: "When should I use it?",
          text:
            "Use Simple Search when you want a quick exploration. Use Detailed Search when you need more control over the Ayurvedic criteria."
        }
      ]
    },

    herbs: {
      icon: "🌿",
      title: "Herb Profiles",
      description:
        "Understand the information available on an Ayurvedic herb profile.",

      sections: [
        {
          title: "Herb information",
          text:
            "Each herb profile provides information that helps you understand the herb and its Ayurvedic properties."
        },
        {
          title: "Ayurvedic attributes",
          text:
            "Depending on the herb, the profile can include properties such as Rasa, Guna, Virya, Vipaka, Prabhava, Dosha, Dhatu, Mala, Srotas and Karma."
        },
        {
          title: "Saving herbs",
          text:
            "Use the save or favorite option on a herb profile to keep an herb easily accessible for later reference."
        }
      ]
    },

    results: {
      icon: "📊",
      title: "Understanding Results",
      description:
        "Learn how to understand ranking, match percentage and herb comparisons.",

      sections: [
        {
          title: "Herb ranking",
          text:
            "Herbs are ranked according to how closely their Ayurvedic properties match the criteria selected in your search."
        },
        {
          title: "Match percentage",
          text:
            "The match percentage represents how closely a herb matches the requirements and attributes specified in your search."
        },
        {
          title: "Compare herbs",
          text:
            "You can select herbs and use the Compare feature to view their properties side by side."
        }
      ]
    },

    billing: {
      icon: "💳",
      title: "Plans & Billing",
      description:
        "Understand the Free, Pro and Max plans available on the platform.",

      sections: [
        {
          title: "Free plan",
          text:
            "The Free plan provides basic herb search, Simple and Detailed Search, herb profile access and the ability to save selected herbs."
        },
        {
          title: "Pro plan",
          text:
            "The Pro plan provides additional capabilities such as advanced search, detailed ranking insights, advanced herb comparisons and an expanded research library."
        },
        {
          title: "Max plan",
          text:
            "The Max plan provides additional capabilities such as higher search limits, extended clinical insights, advanced research tools and priority feature access."
        },
        {
          title: "Payment",
          text:
            "Online payment functionality will be connected to the backend. The current interface allows users to select a plan and proceed through the payment UI."
        }
      ]
    }
  }

  /* =========================================
     FAQ
  ========================================= */

  const faqs = [
    {
      question: "How does Simple Search work?",
      answer:
        "Simple Search allows you to describe your requirement in natural language. Herb Intelligence uses the information provided to identify relevant Ayurvedic herbs."
    },
    {
      question: "What is Detailed Search?",
      answer:
        "Detailed Search allows you to specify Ayurvedic attributes such as Rasa, Guna, Virya, Vipaka, Dosha, Srotas and other properties."
    },
    {
      question: "How does herb ranking work?",
      answer:
        "Herbs are ranked according to how closely their Ayurvedic properties match the criteria selected in your search."
    },
    {
      question: "What does the match percentage mean?",
      answer:
        "The match percentage represents how closely a herb matches the requirements and attributes specified in your search."
    },
    {
      question: "Can I compare multiple herbs?",
      answer:
        "Yes. You can select herbs and use the Compare feature to view their properties side by side."
    },
    {
      question: "How can I save a herb?",
      answer:
        "Use the save or favorite option available on a herb profile to keep the herb easily accessible later."
    },
    {
      question: "What are Pro and Max plans?",
      answer:
        "Pro and Max plans provide additional search, comparison and research capabilities. You can view the available plans from the Upgrade Plan section."
    }
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const search = searchText.toLowerCase().trim()

    return (
      faq.question.toLowerCase().includes(search) ||
      faq.answer.toLowerCase().includes(search)
    )
  })

  /* =========================================
     QUICK HELP HANDLER
  ========================================= */

  const handleHelpTopic = (topic) => {
    setActiveHelpTopic(topic)
    setShowContactForm(false)
    setSearchText("")
  }

  const handleBackToHelp = () => {
    setActiveHelpTopic(null)
    setShowContactForm(false)
    setSupportSubmitted(false)
  }

  /* =========================================
     CONTACT SUPPORT
  ========================================= */

  const handleOpenContact = () => {
    setShowContactForm(true)
    setActiveHelpTopic(null)
    setSupportSubmitted(false)
  }

  const handleSubmitSupport = (event) => {
    event.preventDefault()

    setSupportSubmitted(true)

    setSupportTopic("")
    setSupportMessage("")
  }

  return (
    <div className="settings-page-layout">

      {/* TOP NAVBAR */}
      <DashboardNavbar />

      <div className="settings-page-body">

        {/* SIDEBAR */}
        <Sidebar />

        <main className="settings-page-content">

          <div className="settings-overlay">

            <div className="help-support-modal">

              {/* CLOSE */}
              <button
                type="button"
                className="settings-close-button"
                onClick={closeHelp}
                aria-label="Close help and support"
              >
                ×
              </button>


              {/* =========================================
                  QUICK HELP DETAIL
              ========================================= */}

              {activeHelpTopic ? (

                <div className="help-detail-view">

                  <button
                    type="button"
                    className="help-back-button"
                    onClick={handleBackToHelp}
                  >
                    ← Back to Help
                  </button>

                  <div className="help-detail-header">

                    <div className="help-detail-icon">
                      {helpTopics[activeHelpTopic].icon}
                    </div>

                    <div>

                      <p className="help-label">
                        HELP GUIDE
                      </p>

                      <h1>
                        {helpTopics[activeHelpTopic].title}
                      </h1>

                      <p>
                        {helpTopics[activeHelpTopic].description}
                      </p>

                    </div>

                  </div>


                  <div className="help-detail-content">

                    {helpTopics[activeHelpTopic].sections.map(
                      (section) => (
                        <div
                          className="help-detail-section"
                          key={section.title}
                        >

                          <h2>
                            {section.title}
                          </h2>

                          <p>
                            {section.text}
                          </p>

                        </div>
                      )
                    )}

                  </div>


                  <div className="help-detail-footer">

                    <p>
                      Need more help with this topic?
                    </p>

                    <button
                      type="button"
                      className="help-contact-button"
                      onClick={handleOpenContact}
                    >
                      Contact Support
                      <span>→</span>
                    </button>

                  </div>

                </div>

              ) : showContactForm ? (

                /* =========================================
                   CONTACT SUPPORT VIEW
                ========================================= */

                <div className="help-contact-view">

                  <button
                    type="button"
                    className="help-back-button"
                    onClick={handleBackToHelp}
                  >
                    ← Back to Help
                  </button>


                  {!supportSubmitted ? (

                    <>
                      <div className="help-contact-header">

                        <div className="help-detail-icon">
                          💬
                        </div>

                        <div>

                          <p className="help-label">
                            SUPPORT
                          </p>

                          <h1>
                            Contact Support
                          </h1>

                          <p>
                            Tell us what you need help with and
                            our support feature will handle your request.
                          </p>

                        </div>

                      </div>


                      <form
                        className="help-contact-form"
                        onSubmit={handleSubmitSupport}
                      >

                        <div className="help-form-group">

                          <label htmlFor="support-topic">
                            What do you need help with?
                          </label>

                          <select
                            id="support-topic"
                            value={supportTopic}
                            onChange={(event) =>
                              setSupportTopic(event.target.value)
                            }
                            required
                          >

                            <option value="">
                              Select a topic
                            </option>

                            <option value="search">
                              Search
                            </option>

                            <option value="herb">
                              Herb information
                            </option>

                            <option value="account">
                              Account
                            </option>

                            <option value="billing">
                              Plans & billing
                            </option>

                            <option value="technical">
                              Technical issue
                            </option>

                            <option value="other">
                              Other
                            </option>

                          </select>

                        </div>


                        <div className="help-form-group">

                          <label htmlFor="support-message">
                            Describe your issue
                          </label>

                          <textarea
                            id="support-message"
                            rows="5"
                            placeholder="Describe your question or issue..."
                            value={supportMessage}
                            onChange={(event) =>
                              setSupportMessage(event.target.value)
                            }
                            required
                          />

                        </div>


                        <button
                          type="submit"
                          className="help-submit-button"
                        >
                          Send Support Request
                          <span>→</span>
                        </button>

                      </form>

                    </>

                  ) : (

                    <div className="help-success-message">

                      <div className="help-success-icon">
                        ✓
                      </div>

                      <h2>
                        Support request received
                      </h2>

                      <p>
                        Your support request has been recorded
                        in the current interface.
                      </p>

                      <p className="help-success-note">
                        Actual support requests will be connected
                        to the backend later.
                      </p>

                      <button
                        type="button"
                        className="help-back-home-button"
                        onClick={handleBackToHelp}
                      >
                        Back to Help
                      </button>

                    </div>

                  )}

                </div>

              ) : (

                /* =========================================
                   MAIN HELP PAGE
                ========================================= */

                <>

                  {/* HEADER */}

                  <div className="help-header">

                    <p className="help-label">
                      HELP CENTER
                    </p>

                    <h1>
                      How can we help?
                    </h1>

                    <p>
                      Find answers, learn how to use Herb Intelligence,
                      or get support.
                    </p>

                  </div>


                  {/* SEARCH */}

                  <div className="help-search">

                    <span className="help-search-icon">
                      🔍
                    </span>

                    <input
                      type="text"
                      placeholder="Search help articles..."
                      value={searchText}
                      onChange={(event) =>
                        setSearchText(event.target.value)
                      }
                    />

                    {searchText && (

                      <button
                        type="button"
                        className="help-search-clear"
                        onClick={() => setSearchText("")}
                        aria-label="Clear search"
                      >
                        ×
                      </button>

                    )}

                  </div>


                  {/* QUICK HELP */}

                  {!searchText && (

                    <section className="help-section">

                      <div className="help-section-heading">

                        <h2>
                          Quick help
                        </h2>

                        <p>
                          Get familiar with the main features
                          of the platform.
                        </p>

                      </div>


                      <div className="help-quick-grid">

                        <button
                          type="button"
                          className="help-quick-card"
                          onClick={() =>
                            handleHelpTopic("search")
                          }
                        >

                          <div className="help-card-icon">
                            🔎
                          </div>

                          <div>

                            <h3>
                              Search Guide
                            </h3>

                            <p>
                              Learn how Simple and Detailed
                              Search work.
                            </p>

                          </div>

                          <span className="help-card-arrow">
                            →
                          </span>

                        </button>


                        <button
                          type="button"
                          className="help-quick-card"
                          onClick={() =>
                            handleHelpTopic("herbs")
                          }
                        >

                          <div className="help-card-icon">
                            🌿
                          </div>

                          <div>

                            <h3>
                              Herb Profiles
                            </h3>

                            <p>
                              Understand herb properties
                              and Ayurvedic attributes.
                            </p>

                          </div>

                          <span className="help-card-arrow">
                            →
                          </span>

                        </button>


                        <button
                          type="button"
                          className="help-quick-card"
                          onClick={() =>
                            handleHelpTopic("results")
                          }
                        >

                          <div className="help-card-icon">
                            📊
                          </div>

                          <div>

                            <h3>
                              Understanding Results
                            </h3>

                            <p>
                              Learn about ranking, matching
                              and comparisons.
                            </p>

                          </div>

                          <span className="help-card-arrow">
                            →
                          </span>

                        </button>


                        <button
                          type="button"
                          className="help-quick-card"
                          onClick={() =>
                            handleHelpTopic("billing")
                          }
                        >

                          <div className="help-card-icon">
                            💳
                          </div>

                          <div>

                            <h3>
                              Plans & Billing
                            </h3>

                            <p>
                              Learn about Free, Pro and Max plans.
                            </p>

                          </div>

                          <span className="help-card-arrow">
                            →
                          </span>

                        </button>

                      </div>

                    </section>

                  )}


                  {/* FAQ */}

                  <section className="help-section faq-section">

                    <div className="help-section-heading">

                      <h2>
                        Frequently Asked Questions
                      </h2>

                      <p>
                        Find quick answers to common questions.
                      </p>

                    </div>


                    <div className="faq-list">

                      {filteredFaqs.length > 0 ? (

                        filteredFaqs.map((faq, index) => (

                          <div
                            className={`faq-item ${
                              openFaq === index
                                ? "open"
                                : ""
                            }`}
                            key={faq.question}
                          >

                            <button
                              type="button"
                              className="faq-question"
                              onClick={() =>
                                toggleFaq(index)
                              }
                            >

                              <span>
                                {faq.question}
                              </span>

                              <span className="faq-arrow">
                                {openFaq === index
                                  ? "−"
                                  : "+"}
                              </span>

                            </button>


                            {openFaq === index && (

                              <div className="faq-answer">

                                <p>
                                  {faq.answer}
                                </p>

                              </div>

                            )}

                          </div>

                        ))

                      ) : (

                        <div className="help-no-results">

                          <span>
                            🔍
                          </span>

                          <h3>
                            No help articles found
                          </h3>

                          <p>
                            Try searching with a different keyword.
                          </p>

                        </div>

                      )}

                    </div>

                  </section>


                  {/* CONTACT SUPPORT */}

                  <section className="help-support-card">

                    <div className="help-support-content">

                      <div className="help-support-icon">
                        💬
                      </div>

                      <div>

                        <h2>
                          Still need help?
                        </h2>

                        <p>
                          Our support team can help you with
                          questions about searching, herb
                          information, accounts and plans.
                        </p>

                      </div>

                    </div>


                    <button
                      type="button"
                      className="help-contact-button"
                      onClick={handleOpenContact}
                    >
                      Contact Support
                      <span>→</span>
                    </button>

                  </section>


                  {/* FOOTER */}

                  <div className="help-footer">

                    <span>
                      Herb Intelligence
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      Help & Support
                    </span>

                  </div>

                </>

              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default HelpSupportPage