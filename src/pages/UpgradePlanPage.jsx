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

  const handleContinue = () => {
    if (selectedPlan === "Free") {
      // Free plan → simply close the upgrade page
      navigate("/doctor")
      return
    }

    // Pro / Max → open payment page
    navigate(`/payment?plan=${selectedPlan}`)
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

            <div className="upgrade-modal">

              {/* =========================================
                  TOP RIGHT ACTIONS
                  ========================================= */}
<div className="upgrade-top-actions">

<div className="upgrade-selection-actions">

  <span className="selected-plan-text">
    Selected plan:{" "}
    <strong>{selectedPlan}</strong>
  </span>

  <button
    type="button"
    className="continue-plan-button"
    onClick={handleContinue}
  >
    Continue with {selectedPlan}
    <span>→</span>
  </button>

</div>

</div>

<button
type="button"
className="settings-close-button"
onClick={closeUpgrade}
aria-label="Close upgrade plans"
>
×
</button>


              {/* =========================================
                  HEADER
                  ========================================= */}

              <div className="upgrade-header">

                <p className="upgrade-label">
                  PLANS & PRICING
                </p>

                <h1>
                  Upgrade your plan
                </h1>

                <p>
                  Choose the plan that best fits your clinical
                  research workflow.
                </p>

              </div>


              {/* =========================================
                  PLANS
                  ========================================= */}

              <div className="upgrade-plans">


                {/* =========================================
                    FREE PLAN
                    ========================================= */}

                <div
                  className={`upgrade-plan-card ${
                    selectedPlan === "Free"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handlePlanSelect("Free")
                  }
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
                    onClick={(event) => {
                      event.stopPropagation()
                      handlePlanSelect("Free")
                    }}
                  >
                    Select Free plan
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


                {/* =========================================
                    PRO PLAN
                    ========================================= */}

                <div
                  className={`upgrade-plan-card featured ${
                    selectedPlan === "Pro"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handlePlanSelect("Pro")
                  }
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
                    onClick={(event) => {
                      event.stopPropagation()
                      handlePlanSelect("Pro")
                    }}
                  >
                    Select Pro plan
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


                {/* =========================================
                    MAX PLAN
                    ========================================= */}

                <div
                  className={`upgrade-plan-card ${
                    selectedPlan === "Max"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handlePlanSelect("Max")
                  }
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
                    onClick={(event) => {
                      event.stopPropagation()
                      handlePlanSelect("Max")
                    }}
                  >
                    Select Max plan
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


              {/* =========================================
                  FOOTER
                  ========================================= */}

              <div className="upgrade-footer">
                Plans and subscription features will be connected
                to the backend.
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  )
}

export default UpgradePlanPage