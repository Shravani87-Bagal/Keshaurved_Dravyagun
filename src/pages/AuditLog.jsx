import "../styles/AuditLog.css"

function AuditLog() {

  const auditEntries = [
    {
      timestamp: "10 Sep 2026, 11:15 AM",
      user: "Dr. Anand Sharma",
      role: "Admin",
      action: "Verified",
      module: "Herb",
      item: "Ashwagandha",
      previous: "Reviewed",
      newValue: "Verified"
    },
    {
      timestamp: "10 Sep 2026, 10:42 AM",
      user: "Dr. Priya Patel",
      role: "Reviewer",
      action: "Updated",
      module: "Herb",
      item: "Guduchi",
      previous: "Status: Draft",
      newValue: "Status: Reviewed"
    },
    {
      timestamp: "10 Sep 2026, 09:28 AM",
      user: "Dr. Ramesh Mehta",
      role: "Reviewer",
      action: "Added reference",
      module: "Herb",
      item: "Haritaki",
      previous: "—",
      newValue: "Charaka Samhita"
    },
    {
      timestamp: "09 Sep 2026, 04:11 AM",
      user: "Dr. Anand Sharma",
      role: "Admin",
      action: "Updated weight",
      module: "Scoring",
      item: "Rasa",
      previous: "18",
      newValue: "20"
    },
    {
      timestamp: "09 Sep 2026, 02:55 AM",
      user: "Dr. Priya Patel",
      role: "Reviewer",
      action: "Added term",
      module: "Vocabulary",
      item: "Deepana",
      previous: "—",
      newValue: "New term added"
    },
    {
      timestamp: "08 Sep 2026, 03:44 AM",
      user: "Dr. Anand Sharma",
      role: "Admin",
      action: "Deactivated user",
      module: "Users",
      item: "Dr. Arun Nair",
      previous: "Active",
      newValue: "Inactive"
    },
    {
      timestamp: "08 Sep 2026, 11:22 AM",
      user: "Dr. Ramesh Mehta",
      role: "Reviewer",
      action: "Edited Karma",
      module: "Herb",
      item: "Shatavari",
      previous: "Balya, Rasayana...",
      newValue: "Balya, Rasayana..."
    }
  ]

  return (
    <div className="audit-log-page">

      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <div className="audit-log-header">

        <div>
          <h1>Audit Log</h1>

          <p>
            Track who changed what and when across the entire knowledge base.
          </p>
        </div>

      </div>


      {/* =========================================
          FILTER SECTION
          ========================================= */}

      <section className="audit-log-filter-card">

        <div className="audit-log-filter-row">

          <select defaultValue="all-users">
            <option value="all-users">All Users</option>
            <option value="anand">Dr. Anand Sharma</option>
            <option value="priya">Dr. Priya Patel</option>
            <option value="ramesh">Dr. Ramesh Mehta</option>
          </select>

          <select defaultValue="all-actions">
            <option value="all-actions">All Actions</option>
            <option value="added">Added</option>
            <option value="updated">Updated</option>
            <option value="verified">Verified</option>
            <option value="deactivated">Deactivated</option>
          </select>

          <select defaultValue="all-modules">
            <option value="all-modules">All Modules</option>
            <option value="herb">Herb</option>
            <option value="scoring">Scoring</option>
            <option value="vocabulary">Vocabulary</option>
            <option value="users">Users</option>
          </select>

          <div className="audit-log-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search herb or item..."
            />

          </div>

        </div>


        <div className="audit-log-date-row">

        <div className="audit-log-date-field">
  <input
    type="date"
    aria-label="Start date"
  />
</div>

<span className="audit-log-date-separator">
  to
</span>

<div className="audit-log-date-field">
  <input
    type="date"
    aria-label="End date"
  />
</div>

          <button
            type="button"
            className="audit-log-apply-button"
          >
            <span>▽</span>
            Apply
          </button>

        </div>

      </section>


      {/* =========================================
          AUDIT TABLE
          ========================================= */}

      <section className="audit-log-table-card">

        <div className="audit-log-table-wrapper">

          <table className="audit-log-table">

            <thead>

              <tr>
                <th>TIMESTAMP</th>
                <th>USER</th>
                <th>ROLE</th>
                <th>ACTION</th>
                <th>MODULE</th>
                <th>ITEM</th>
                <th>PREVIOUS VALUE</th>
                <th>NEW VALUE</th>
                <th>ACTIONS</th>
              </tr>

            </thead>


            <tbody>

              {auditEntries.map((entry, index) => (

                <tr key={index}>

                  <td>
                    <span className="audit-timestamp">
                      {entry.timestamp}
                    </span>
                  </td>

                  <td>
                    <strong className="audit-user">
                      {entry.user}
                    </strong>
                  </td>

                  <td>
                    <span className="audit-role">
                      {entry.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`audit-action ${
                        entry.action.includes("Deactivated")
                          ? "danger"
                          : ""
                      }`}
                    >
                      {entry.action}
                    </span>
                  </td>

                  <td>
                    <span className="audit-module">
                      {entry.module}
                    </span>
                  </td>

                  <td>
                    <strong className="audit-item">
                      {entry.item}
                    </strong>
                  </td>

                  <td>
                    <span className="audit-value previous-value">
                      {entry.previous}
                    </span>
                  </td>

                  <td>
                    <span className="audit-value new-value">
                      {entry.newValue}
                    </span>
                  </td>

                  <td>

                    <div className="audit-actions">

                      <button
                        type="button"
                        title="View details"
                      >
                        ◉
                      </button>

                      <button
                        type="button"
                        className="rollback-button"
                      >
                        Rollback
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* =========================================
            TABLE FOOTER
            ========================================= */}

        <div className="audit-log-footer">

          <span>
            Showing 7 of 1,284 audit entries
          </span>

          <div className="audit-pagination">

            <button
              type="button"
              className="active"
            >
              1
            </button>

            <button type="button">
              2
            </button>

            <button type="button">
              3
            </button>

            <span>...</span>

            <button type="button">
              183
            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default AuditLog