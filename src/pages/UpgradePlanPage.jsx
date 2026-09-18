import { useState } from "react"
import { useNavigate } from "react-router-dom"

import DashboardNavbar from "../components/DashboardNavbar"
import Sidebar from "../components/Sidebar"

import "../styles/SettingsPage.css"
import "../styles/UpgradePlanPage.css"

function UpgradePlanPage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("Free")

  const closeUpgrade = () => {
    navigate("/doctor")
  }

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
  }

  return (
    <div className="settings-page-layout">

      {/* Top Navbar */}
      <DashboardNavbar />

      <div className="settings-page-body">

        {/* Sidebar */}
        <Sidebar />

        <main className="settings-page-content">

          {/* Same overlay used by Settings and Language */}
          <div className="settings-overlay">

            {/* Upgrade Modal */}
            <div className="upgrade-modal">

              {/* Close button */}
              <button
                type="button"
                className="settings-close-button"
                onClick={closeUpgrade}
                aria-label="Close upgrade plans"
              >
                ×
              </button>


              {/* Header */}
              <div className="upgrade-header">

                <p className="upgrade-label">
                  PLANS & PRICING
                </p>

                <h1>
                  Upgrade your plan
                </h1>

                <p>
                  Choose the plan that best fits your clinical research workflow.
                </p>

              </div>


              {/* Plans */}
              <div className="upgrade-plans">


                {/* FREE */}
                <div
  className={`upgrade-plan-card ${
    selectedPlan === "Free" ? "selected" : ""
  }`}
  onClick={() => handlePlanSelect("Free")}
>

                  <h2>
                    Free
                  </h2>

                  <p className="upgrade-plan-subtitle">
                    Explore the platform
                  </p>

                  <div className="upgrade-price">
                    ₹0
                  </div>

                  <button
                    type="button"
                    className="upgrade-plan-button secondary"
                    onClick={() =>
                      handlePlanSelect("Free")
                    }
                  >
                    Current plan
                  </button>

                  <div className="upgrade-divider"></div>

                  <ul>

                    <li>
                      <span>✓</span>
                      Basic herb search
                    </li>

                    <li>
                      <span>✓</span>
                      Simple and detailed search
                    </li>

                    <li>
                      <span>✓</span>
                      Herb profile access
                    </li>

                    <li>
                      <span>✓</span>
                      Save selected herbs
                    </li>

                  </ul>

                </div>


                {/* PRO */}
                <div
  className={`upgrade-plan-card featured ${
    selectedPlan === "Pro" ? "selected" : ""
  }`}
  onClick={() => handlePlanSelect("Pro")}
>
                  <div className="upgrade-plan-icon">
                    ✦
                  </div>

                  <h2>
                    Pro
                  </h2>

                  <p className="upgrade-plan-subtitle">
                    For regular clinical use
                  </p>

                  <div className="upgrade-price">
                    ₹499
                    <span>/month</span>
                  </div>

                  <button
                    type="button"
                    className="upgrade-plan-button primary"
                    onClick={() =>
                      handlePlanSelect("Pro")
                    }
                  >
                    Get Pro plan
                  </button>

                  <div className="upgrade-divider"></div>

                  <p className="upgrade-includes">
                    Everything in Free, plus:
                  </p>

                  <ul>

                    <li>
                      <span>✓</span>
                      Advanced search capabilities
                    </li>

                    <li>
                      <span>✓</span>
                      Detailed ranking insights
                    </li>

                    <li>
                      <span>✓</span>
                      Advanced herb comparisons
                    </li>

                    <li>
                      <span>✓</span>
                      Expanded research library
                    </li>

                  </ul>

                </div>


                {/* MAX */}
                <div
  className={`upgrade-plan-card ${
    selectedPlan === "Max" ? "selected" : ""
  }`}
  onClick={() => handlePlanSelect("Max")}
>

                  <h2>
                    Max
                  </h2>

                  <p className="upgrade-plan-subtitle">
                    For advanced clinical research
                  </p>

                  <div className="upgrade-price">
                    ₹999
                    <span>/month</span>
                  </div>

                  <button
                    type="button"
                    className="upgrade-plan-button primary"
                    onClick={() =>
                      handlePlanSelect("Max")
                    }
                  >
                    Get Max plan
                  </button>

                  <div className="upgrade-divider"></div>

                  <p className="upgrade-includes">
                    Everything in Pro, plus:
                  </p>

                  <ul>

                    <li>
                      <span>✓</span>
                      Higher search limits
                    </li>

                    <li>
                      <span>✓</span>
                      Extended clinical insights
                    </li>

                    <li>
                      <span>✓</span>
                      Advanced research tools
                    </li>

                    <li>
                      <span>✓</span>
                      Priority feature access
                    </li>

                  </ul>

                </div>

              </div>


              {/* Footer */}
              <div className="upgrade-footer">
                Plans and subscription features will be connected to the backend.
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default UpgradePlanPage