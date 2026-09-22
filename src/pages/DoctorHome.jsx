import DashboardNavbar from "../components/DashboardNavbar"
import "../styles/DoctorHome.css"
import Sidebar from "../components/Sidebar"
import DashboardWelcome from "../components/DashboardWelcome"
import SearchModeCard from "../components/SearchModeCard"
import RecentSearches from "../components/RecentSearches"
import RecentlyViewed from "../components/RecentlyViewed"
import SavedFavorites from "../components/SavedFavorites"
import SearchInsights from "../components/SearchInsights"

function DoctorHome() {
  return (
    <div className="doctor-layout">

      {/* Top Navbar */}
      <DashboardNavbar />

      {/* Dashboard Body */}
      <div className="dashboard-body">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="main-content">

          <DashboardWelcome />

          {/* Search / Research */}
          <section className="search-modes">

            <div className="section-heading">
              <p>CHOOSE YOUR SEARCH</p>

              <h2>How would you like to explore?</h2>
            </div>

            <div className="search-mode-container">

              <SearchModeCard
                icon="✦"
                title="Simple Search"
                description="Describe the patient's problem in plain language."
                mode="simple"
              />

              <SearchModeCard
                icon="☷"
                title="Detailed Search"
                description="Filter by classical Ayurvedic parameters."
                mode="detailed"
              />

            </div>

          </section>

          {/* Dashboard Overview */}
          <section className="dashboard-overview">

            <RecentSearches />

            <RecentlyViewed />
            

          </section>
          <section className="dashboard-insights">
          <SavedFavorites />
          <SearchInsights />
          </section>

        </main>

      </div>

    </div>
  )
}

export default DoctorHome