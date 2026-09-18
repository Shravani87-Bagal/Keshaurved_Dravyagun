import { Link } from "react-router-dom";
function LandingPage() {
    return (
      <div className="landing-page">
  
        {/* Navbar */}
        <header className="landing-navbar">
  
          <div className="landing-brand">
            <div className="landing-brand-icon">⌁</div>
  
            <span>Herb Intelligence</span>
          </div>
  
          <nav className="landing-nav-links">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>
  
          <div className="landing-auth-buttons">
          <Link to="/auth" className="login-button">
                  Log In
         </Link>
  
            <Link to="/auth" className="signup-button">
               Sign Up
            </Link>
          </div>
  
        </header>
  
  
        {/* Hero Section */}
        <main>
  
          <section className="landing-hero">
  
            <div className="hero-badge">
              <span>●</span>
              CLINICAL DECISION SUPPORT · AYURVEDA
            </div>
  
            <h1>
              Ayurvedic Herb
              <br />
              <em>Intelligence Engine</em>
            </h1>
  
            <p className="landing-hero-description">
              Structured Ayurvedic knowledge and intelligent relevance ranking
              to support evidence-informed herb selection and clinical
              exploration.
            </p>
  
            <div className="hero-buttons">
  
            <Link to="/auth?mode=signup" className="primary-hero-button">
               Get Started
             </Link>
  
             <a href="#about" className="secondary-hero-button">
               Explore the Platform
              </a>
  
            </div>
  
          </section>


{/* About Us Section */}
<section className="landing-about" id="about">

  <div className="about-section-label">
    ABOUT THE PLATFORM
  </div>

  <div className="about-section-content">

    <div className="about-section-heading">
      <h2>
        Bringing structure to
        <br />
        <em>Ayurvedic knowledge.</em>
      </h2>
    </div>

    <div className="about-section-text">

      <p>
        The Ayurvedic Herb Intelligence Engine is a structured knowledge
        platform designed to make Ayurvedic herb information easier to
        explore, compare, and interpret.
      </p>

      <p>
        It organizes classical Ayurvedic attributes such as Rasa, Guna,
        Virya, Vipaka, Dosha, Dhatu, Srotas, Karma, and indications into
        a searchable digital framework.
      </p>

      <p>
        By combining structured Ayurvedic knowledge with relevance-based
        ranking, the platform helps clinicians and researchers move from
        broad herb discovery toward more focused and transparent
        exploration.
      </p>

    </div>

  </div>


  <div className="about-highlights">

    <div className="about-highlight-card">

      <span className="highlight-number">01</span>

      <div>
        <h3>Structured Knowledge</h3>
        <p>
          Ayurvedic herb information organized through defined
          classical attributes.
        </p>
      </div>

    </div>


    <div className="about-highlight-card">

      <span className="highlight-number">02</span>

      <div>
        <h3>Intelligent Retrieval</h3>
        <p>
          Search and ranking designed to identify herbs according
          to multiple relevant parameters.
        </p>
      </div>

    </div>


    <div className="about-highlight-card">

      <span className="highlight-number">03</span>

      <div>
        <h3>Transparent Results</h3>
        <p>
          Relevance scores help users understand how closely
          a herb matches their search criteria.
        </p>
      </div>

    </div>

  </div>

</section>

{/* Features Section */}
<section className="landing-features" id="features">

  <div className="features-header">

    <div className="features-label">
      PLATFORM CAPABILITIES
    </div>

    <h2>
      Designed for <em>focused exploration.</em>
    </h2>

  </div>

  <div className="features-grid">

    {/* Feature 01 */}
    <div className="feature-card">
      <div className="feature-number">01</div>

      <div className="feature-icon">⌕</div>

      <h3>Simple & Detailed Search</h3>

      <p>
        Search herbs using natural queries or specific Ayurvedic
        parameters such as Rasa, Guna, Virya, Dosha, and Karma.
      </p>
    </div>


    {/* Feature 02 */}
    <div className="feature-card">
      <div className="feature-number">02</div>

      <div className="feature-icon">%</div>

      <h3>Weighted Relevance Ranking</h3>

      <p>
        Combine multiple parameters and rank herbs according
        to their relevance to the selected criteria.
      </p>
    </div>


    {/* Feature 03 */}
    <div className="feature-card">
      <div className="feature-number">03</div>

      <div className="feature-icon">◈</div>

      <h3>Structured Ayurvedic Knowledge</h3>

      <p>
        Explore classical Ayurvedic attributes through a
        consistent and searchable knowledge structure.
      </p>
    </div>


    {/* Feature 04 */}
    <div className="feature-card">
      <div className="feature-number">04</div>

      <div className="feature-icon">✓</div>

      <h3>Transparent Results</h3>

      <p>
        Relevance percentages and attribute matching make
        search results easier to understand.
      </p>
    </div>

  </div>

</section>

{/* Statistics Section */}
<section className="landing-stats">

  <div className="stats-container">

    <div className="stat-item">
      <span className="stat-number">350+</span>
      <span className="stat-label">Ayurvedic Herbs</span>
    </div>

    <div className="stat-item">
      <span className="stat-number">10+</span>
      <span className="stat-label">Classical Parameters</span>
    </div>

    <div className="stat-item">
      <span className="stat-number">Multi</span>
      <span className="stat-label">Parameter Search</span>
    </div>

    <div className="stat-item">
      <span className="stat-number">100%</span>
      <span className="stat-label">Transparent Ranking</span>
    </div>

  </div>

</section>

{/* Contact Section */}
<section className="landing-contact" id="contact">

  <div className="contact-content">

    <div className="contact-label">
      CONTACT
    </div>

    <p className="contact-text">
      Questions or feedback?{" "}
      <a href="mailto:support@herbintelligence.app">
        support@herbintelligence.app
      </a>
    </p>

  </div>

</section>

{/* Footer */}
<footer className="landing-footer">

  <div className="footer-main">

    {/* Brand */}
    <div className="footer-brand">
      <div className="footer-brand-icon">
        ◒
      </div>

      <span>Herb Intelligence</span>
    </div>


    {/* Footer Links */}
    <nav className="footer-links">

      <a href="#about">About</a>
      <a href="#features">Features</a>
      <a href="#contact">Contact</a>
      <a href="#privacy">Privacy</a>
      <a href="#terms">Terms</a>

    </nav>


    {/* Footer Information */}
    <div className="footer-info">

      <span>For clinical use only · v1.0.0</span>

      <span>© 2026 Herb Intelligence Engine</span>

    </div>

  </div>


  {/* Disclaimer */}
  <div className="footer-disclaimer">

    This platform is intended for qualified Ayurvedic physicians and
    licensed healthcare professionals only. Not for self-medication.

  </div>

</footer>
  
        </main>
  
      </div>
    )
  }
  
  export default LandingPage