import { useNavigate } from "react-router-dom"

import "../styles/AdminUpgradePlanPage.css"

function AdminUpgradePlanPage() {
  const navigate = useNavigate()

  const closePage = () => {
    navigate("/admin")
  }

  return (
    <div className="admin-upgrade-overlay">

      <div className="admin-upgrade-modal">

        {/* =========================================
            HEADER
           ========================================= */}

        <div className="admin-upgrade-header">

          <div>
            <p className="admin-upgrade-label">
              ADMINISTRATION
            </p>

            <h1>
              Upgrade Plan
            </h1>

            <p className="admin-upgrade-description">
              Choose the plan that best fits your Dravyaguna workspace.
            </p>
          </div>

          <button
            type="button"
            className="admin-upgrade-close-button"
            onClick={closePage}
            aria-label="Close upgrade plan"
          >
            ×
          </button>

        </div>


        {/* =========================================
            PLANS
           ========================================= */}

        <div className="admin-upgrade-plans">


          {/* =========================================
              STARTER
             ========================================= */}

          <div className="admin-upgrade-card">

            <div className="admin-upgrade-card-header">

              <h2>
                Starter
              </h2>

              <p>
                For small teams beginning with digital herb management.
              </p>

            </div>

            <div className="admin-upgrade-price">
              <strong>
                ₹999
              </strong>

              <span>
                / month
              </span>
            </div>

            <div className="admin-upgrade-divider" />

            <p className="admin-upgrade-includes">
              Includes:
            </p>

            <ul className="admin-upgrade-features">

              <li>
                ✓ Herb management
              </li>

              <li>
                ✓ Basic vocabulary management
              </li>

              <li>
                ✓ Basic search
              </li>

              <li>
                ✓ Administrator dashboard
              </li>

              <li>
                ✓ Basic activity tracking
              </li>

            </ul>

            <button
              type="button"
              className="admin-upgrade-secondary-button"
            >
              Choose Starter
            </button>

          </div>


          {/* =========================================
              PROFESSIONAL
             ========================================= */}

          <div className="admin-upgrade-card admin-upgrade-card-featured">

            <div className="admin-upgrade-popular">
              RECOMMENDED
            </div>

            <div className="admin-upgrade-card-header">

              <h2>
                Professional
              </h2>

              <p>
                For teams managing a complete Ayurvedic knowledge workspace.
              </p>

            </div>

            <div className="admin-upgrade-price">
              <strong>
                ₹2,499
              </strong>

              <span>
                / month
              </span>
            </div>

            <div className="admin-upgrade-divider" />

            <p className="admin-upgrade-includes">
              Includes everything in Starter, plus:
            </p>

            <ul className="admin-upgrade-features">

              <li>
                ✓ Advanced herb management
              </li>

              <li>
                ✓ Herb verification workflow
              </li>

              <li>
                ✓ Vocabulary management
              </li>

              <li>
                ✓ Scoring configuration
              </li>

              <li>
                ✓ Search analytics
              </li>

              <li>
                ✓ Advanced activity logs
              </li>

            </ul>

            <button
              type="button"
              className="admin-upgrade-primary-button"
            >
              Choose Professional
            </button>

          </div>


          {/* =========================================
              ENTERPRISE
             ========================================= */}

          <div className="admin-upgrade-card">

            <div className="admin-upgrade-card-header">

              <h2>
                Enterprise
              </h2>

              <p>
                For institutions requiring larger-scale knowledge management.
              </p>

            </div>

            <div className="admin-upgrade-price">

              <strong>
                ₹5,999
              </strong>

              <span>
                / month
              </span>

            </div>

            <div className="admin-upgrade-divider" />

            <p className="admin-upgrade-includes">
              Includes everything in Professional, plus:
            </p>

            <ul className="admin-upgrade-features">

              <li>
                ✓ Multiple administrators
              </li>

              <li>
                ✓ Advanced role management
              </li>

              <li>
                ✓ Full audit logs
              </li>

              <li>
                ✓ Advanced analytics
              </li>

              <li>
                ✓ Priority support
              </li>

              <li>
                ✓ Institutional workspace
              </li>

            </ul>

            <button
              type="button"
              className="admin-upgrade-secondary-button"
            >
              Choose Enterprise
            </button>

          </div>

        </div>


        {/* =========================================
            FOOTER
           ========================================= */}

        <div className="admin-upgrade-footer">

          <p>
            You can change your plan later from the administrator workspace.
          </p>

        </div>

      </div>

    </div>
  )
}

export default AdminUpgradePlanPage