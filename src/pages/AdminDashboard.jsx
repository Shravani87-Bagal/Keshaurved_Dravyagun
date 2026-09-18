import { useNavigate } from "react-router-dom"
import "../styles/AdminDashboard.css"

function AdminDashboard() {
  const navigate = useNavigate()
  return (
    <>
      {/* =========================
          PAGE HEADING
      ========================= */}

      <div className="admin-page-heading">

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Monitor the Ayurvedic knowledge base, verification activity,
          and search performance.
        </p>

      </div>


      {/* =========================
          OVERVIEW STATISTICS
      ========================= */}

      <section className="admin-stats-grid">

        {/* Total Herbs */}

        <div className="admin-stat-card">

          <div className="admin-stat-number">
            350+
          </div>

          <div className="admin-stat-title">
            Total Herbs
          </div>

          <div className="admin-stat-description">
            Structured herb profiles
          </div>

        </div>


        {/* Verified Herbs */}

        <div className="admin-stat-card">

          <div className="admin-stat-number verified">
            245
          </div>

          <div className="admin-stat-title">
            Verified Herbs
          </div>

          <div className="admin-stat-description">
            Ready for clinical search
          </div>

        </div>


        {/* Pending Review */}

        <div className="admin-stat-card">

          <div className="admin-stat-number pending">
            68
          </div>

          <div className="admin-stat-title">
            Pending Review
          </div>

          <div className="admin-stat-description">
            Require verification
          </div>

        </div>


        {/* Draft Herbs */}

        <div className="admin-stat-card">

          <div className="admin-stat-number draft">
            37
          </div>

          <div className="admin-stat-title">
            Draft Herbs
          </div>

          <div className="admin-stat-description">
            Incomplete or unpublished
          </div>

        </div>

      </section>


      {/* =========================
          VERIFICATION + DATA QUALITY
      ========================= */}

      <section className="admin-overview-grid">

        {/* Verification Overview */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <p className="admin-panel-label">
                KNOWLEDGE BASE
              </p>

              <h2>
                Verification Overview
              </h2>

            </div>

            <span className="admin-panel-total">
              350 herbs
            </span>

          </div>


          <div className="verification-list">

            {/* Verified */}

            <div className="verification-item">

              <div className="verification-item-top">

                <span>
                  Verified
                </span>

                <strong>
                  245
                </strong>

              </div>

              <div className="verification-progress">

                <div
                  className="verification-progress-fill verified-fill"
                  style={{ width: "70%" }}
                ></div>

              </div>

              <span className="verification-percentage">
                70%
              </span>

            </div>


            {/* Reviewed */}

            <div className="verification-item">

              <div className="verification-item-top">

                <span>
                  Reviewed
                </span>

                <strong>
                  68
                </strong>

              </div>

              <div className="verification-progress">

                <div
                  className="verification-progress-fill reviewed-fill"
                  style={{ width: "19%" }}
                ></div>

              </div>

              <span className="verification-percentage">
                19%
              </span>

            </div>


            {/* Draft */}

            <div className="verification-item">

              <div className="verification-item-top">

                <span>
                  Draft
                </span>

                <strong>
                  37
                </strong>

              </div>

              <div className="verification-progress">

                <div
                  className="verification-progress-fill draft-fill"
                  style={{ width: "11%" }}
                ></div>

              </div>

              <span className="verification-percentage">
                11%
              </span>

            </div>

          </div>

        </div>


        {/* Data Quality Alerts */}

        <div className="admin-panel">

          <div className="admin-panel-header">

            <div>

              <p className="admin-panel-label">
                DATA QUALITY
              </p>

              <h2>
                Data Quality Alerts
              </h2>

            </div>

            <span className="alert-count">
              4 alerts
            </span>

          </div>


          <div className="quality-alert-list">

            <div className="quality-alert">

              <div className="quality-alert-icon warning">
                !
              </div>

              <div className="quality-alert-content">

                <strong>
                  Herbs pending verification
                </strong>

                <span>
                  68 herb profiles require review.
                </span>

              </div>

              <span className="quality-alert-count">
                68
              </span>

            </div>


            <div className="quality-alert">

              <div className="quality-alert-icon warning">
                !
              </div>

              <div className="quality-alert-content">

                <strong>
                  Missing Ayurvedic parameters
                </strong>

                <span>
                  Some profiles have incomplete attributes.
                </span>

              </div>

              <span className="quality-alert-count">
                12
              </span>

            </div>


            <div className="quality-alert">

              <div className="quality-alert-icon warning">
                !
              </div>

              <div className="quality-alert-content">

                <strong>
                  Vocabulary conflicts
                </strong>

                <span>
                  Terms require standardization.
                </span>

              </div>

              <span className="quality-alert-count">
                7
              </span>

            </div>


            <div className="quality-alert">

              <div className="quality-alert-icon info">
                i
              </div>

              <div className="quality-alert-content">

                <strong>
                  Low-confidence mappings
                </strong>

                <span>
                  Review mappings before verification.
                </span>

              </div>

              <span className="quality-alert-count">
                5
              </span>

            </div>

          </div>


          <button
            type="button"
            className="view-alerts-button"
          >
            View all alerts →
          </button>

        </div>

      </section>


      {/* =========================
          RECENT ACTIVITY
      ========================= */}

      <section className="admin-recent-grid">

        {/* Recent Herb Activity */}

        <div className="admin-panel admin-recent-panel">

          <div className="admin-panel-header">

            <div>

              <p className="admin-panel-label">
                HERB ACTIVITY
              </p>

              <h2>
                Recent Herb Activity
              </h2>

            </div>

            <button
             type="button"
             className="admin-view-all-button"
             onClick={() => navigate("/admin/manage-herbs")}
             >
              View all →
              </button>

          </div>


          <div className="admin-activity-list">

            <div className="admin-activity-item">

              <div className="admin-activity-icon">
                ✦
              </div>

              <div className="admin-activity-content">

                <strong>
                  Ashwagandha
                </strong>

                <span>
                  Herb profile added
                </span>

              </div>

              <span className="admin-activity-status draft-status">
                Draft
              </span>

              <span className="admin-activity-time">
                12 min ago
              </span>

            </div>


            <div className="admin-activity-item">

              <div className="admin-activity-icon">
                ✓
              </div>

              <div className="admin-activity-content">

                <strong>
                  Guduchi
                </strong>

                <span>
                  Profile verified
                </span>

              </div>

              <span className="admin-activity-status verified-status">
                Verified
              </span>

              <span className="admin-activity-time">
                34 min ago
              </span>

            </div>


            <div className="admin-activity-item">

              <div className="admin-activity-icon">
                ◉
              </div>

              <div className="admin-activity-content">

                <strong>
                  Brahmi
                </strong>

                <span>
                  Profile updated
                </span>

              </div>

              <span className="admin-activity-status reviewed-status">
                Reviewed
              </span>

              <span className="admin-activity-time">
                1 hr ago
              </span>

            </div>


            <div className="admin-activity-item">

              <div className="admin-activity-icon">
                ✦
              </div>

              <div className="admin-activity-content">

                <strong>
                  Haritaki
                </strong>

                <span>
                  Herb profile added
                </span>

              </div>

              <span className="admin-activity-status draft-status">
                Draft
              </span>

              <span className="admin-activity-time">
                2 hrs ago
              </span>

            </div>

          </div>

        </div>


        {/* Recent Search Activity */}

        <div className="admin-panel admin-recent-panel">

          <div className="admin-panel-header">

            <div>

              <p className="admin-panel-label">
                SEARCH ACTIVITY
              </p>

              <h2>
                Recent Search Activity
              </h2>

            </div>

            <button
  type="button"
  className="admin-view-all-button"
  onClick={() => navigate("/admin/search-analytics")}
>
  View all →
</button>

          </div>


          <div className="admin-search-activity-list">

            <div className="admin-search-activity-item">

              <div className="admin-search-activity-icon">
                ⌕
              </div>

              <div className="admin-search-activity-content">

                <strong>
                  Vata + Tikta + Laghu
                </strong>

                <span>
                  Detailed Search
                </span>

              </div>

              <div className="admin-search-result">

                <strong>
                  18
                </strong>

                <span>
                  matches
                </span>

              </div>

              <span className="admin-activity-time">
                8 min ago
              </span>

            </div>


            <div className="admin-search-activity-item">

              <div className="admin-search-activity-icon">
                ⌕
              </div>

              <div className="admin-search-activity-content">

                <strong>
                  Digestive disorders
                </strong>

                <span>
                  Simple Search
                </span>

              </div>

              <div className="admin-search-result">

                <strong>
                  24
                </strong>

                <span>
                  matches
                </span>

              </div>

              <span className="admin-activity-time">
                21 min ago
              </span>

            </div>


            <div className="admin-search-activity-item">

              <div className="admin-search-activity-icon">
                ⌕
              </div>

              <div className="admin-search-activity-content">

                <strong>
                  Pranavaha Srotas
                </strong>

                <span>
                  Detailed Search
                </span>

              </div>

              <div className="admin-search-result">

                <strong>
                  11
                </strong>

                <span>
                  matches
                </span>

              </div>

              <span className="admin-activity-time">
                46 min ago
              </span>

            </div>


            <div className="admin-search-activity-item">

              <div className="admin-search-activity-icon">
                ⌕
              </div>

              <div className="admin-search-activity-content">

                <strong>
                  Rasayana herbs
                </strong>

                <span>
                  Simple Search
                </span>

              </div>

              <div className="admin-search-result">

                <strong>
                  32
                </strong>

                <span>
                  matches
                </span>

              </div>

              <span className="admin-activity-time">
                1 hr ago
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <section className="admin-quick-actions-section">

        <div className="admin-panel admin-quick-actions-panel">

          <div className="admin-panel-header">

            <div>

              <h2>
                Quick Actions
              </h2>

            </div>

          </div>


          <div className="admin-quick-actions-grid">

          <button
  type="button"
  className="admin-quick-action primary"
  onClick={() => navigate("/admin/add-herb")}
>
  <span>＋</span>
  <strong>
    Add New Herb
  </strong>
</button>


            <button
  type="button"
  className="admin-quick-action"
  onClick={() => navigate("/admin/manage-herbs")}
>
  <span>♧</span>
  <strong>
    Review Pending Herbs
  </strong>
</button>


<button
  type="button"
  className="admin-quick-action"
  onClick={() => navigate("/admin/vocabulary")}
>
  <span>▣</span>
  <strong>
    Manage Vocabulary
  </strong>
</button>


<button
  type="button"
  className="admin-quick-action"
  onClick={() => navigate("/admin/search-analytics")}
>
  <span>⌁</span>
  <strong>
    View Search Analytics
  </strong>
</button>

          </div>

        </div>

      </section>
    </>
  )
}

export default AdminDashboard