function ReferenceLibrary() {
    const references = [
      {
        title: "Dravyaguna Vigyan",
        description: "Classical Ayurvedic principles of medicinal herbs and their properties.",
        type: "Classical Text",
      },
      {
        title: "Rasa, Guna, Virya & Vipaka",
        description: "Reference guide for the fundamental pharmacological attributes of herbs.",
        type: "Clinical Reference",
      },
      {
        title: "Ayurvedic Therapeutic Indications",
        description: "Structured references for herbs, diseases, doshas, and therapeutic actions.",
        type: "Clinical Guide",
      },
    ]
  
    return (
      <section className="reference-library">
  
        <div className="reference-library-header">
  
          <div>
            <p className="reference-label">
              CLINICAL KNOWLEDGE
            </p>
  
            <h2>
              Clinical library
            </h2>
  
            <span>
              Access curated Ayurvedic references for clinical research.
            </span>
          </div>
  
          <button
            className="library-view-button"
            type="button"
          >
            View library →
          </button>
  
        </div>
  
  
        <div className="reference-library-grid">
  
          {references.map((reference) => (
  
            <div
              className="reference-card"
              key={reference.title}
            >
  
              <div className="reference-card-icon">
                ◫
              </div>
  
              <div className="reference-card-content">
  
                <span className="reference-type">
                  {reference.type}
                </span>
  
                <h3>
                  {reference.title}
                </h3>
  
                <p>
                  {reference.description}
                </p>
  
              </div>
  
              <button
                className="reference-arrow"
                type="button"
              >
                ›
              </button>
  
            </div>
  
          ))}
  
        </div>
  
      </section>
    )
  }
  
  export default ReferenceLibrary