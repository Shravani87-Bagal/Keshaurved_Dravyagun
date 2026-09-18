import "../styles/UserRoleManagement.css"

function UserRoleManagement() {

  const users = [
    {
      initials: "DA",
      name: "Dr. Anand Sharma",
      email: "anand@dravya.guna.in",
      role: "Admin",
      status: "Active",
      lastActive: "Today,\n10:42 AM",
      created: "01 Jan\n2025"
    },
    {
      initials: "DP",
      name: "Dr. Priya Patel",
      email: "priya@dravyaguna.in",
      role: "Ayurvedic Reviewer",
      status: "Active",
      lastActive: "Today,\n09:15 AM",
      created: "15 Mar\n2025"
    },
    {
      initials: "DR",
      name: "Dr. Ramesh Mehta",
      email: "ramesh@dravyaguna.in",
      role: "Ayurvedic Reviewer",
      status: "Active",
      lastActive: "Yesterday",
      created: "20 Apr\n2025"
    },
    {
      initials: "DS",
      name: "Dr. Sunita Joshi",
      email: "sunita@dravyaguna.in",
      role: "Doctor",
      status: "Active",
      lastActive: "07 Sep\n2026",
      created: "01 Jun\n2025"
    },
    {
      initials: "DK",
      name: "Dr. Kavita Rao",
      email: "kavita@dravyaguna.in",
      role: "Doctor",
      status: "Active",
      lastActive: "05 Sep\n2026",
      created: "15 Jul\n2025"
    },
    {
      initials: "DA",
      name: "Dr. Arun Nair",
      email: "arun@dravyaguna.in",
      role: "Doctor",
      status: "Inactive",
      lastActive: "01 Aug\n2026",
      created: "10 Aug\n2025"
    },
    {
      initials: "DM",
      name: "Dr. Meena Rao",
      email: "meena@dravyaguna.in",
      role: "Doctor",
      status: "Pending",
      lastActive: "—",
      created: "07 Sep\n2026"
    }
  ]

  const permissions = [
    {
      permission: "Search herbs",
      admin: true,
      reviewer: true,
      doctor: true
    },
    {
      permission: "View herb details",
      admin: true,
      reviewer: true,
      doctor: true
    },
    {
      permission: "Add herbs",
      admin: true,
      reviewer: true,
      doctor: false
    },
    {
      permission: "Edit herbs",
      admin: true,
      reviewer: true,
      doctor: false
    },
    {
      permission: "Review herbs",
      admin: true,
      reviewer: true,
      doctor: false
    },
    {
      permission: "Verify herbs",
      admin: true,
      reviewer: false,
      doctor: false,
      restricted: true
    },
    {
      permission: "Manage vocabulary",
      admin: true,
      reviewer: false,
      doctor: false
    },
    {
      permission: "Change scoring weights",
      admin: true,
      reviewer: false,
      doctor: false
    },
    {
      permission: "View analytics",
      admin: true,
      reviewer: true,
      doctor: false
    },
    {
      permission: "Manage users",
      admin: true,
      reviewer: false,
      doctor: false
    },
    {
      permission: "View audit log",
      admin: true,
      reviewer: true,
      doctor: false
    }
  ]

  return (
    <div className="user-role-page">

      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <div className="user-role-header">

        <div>
          <h1>User & Role Management</h1>

          <p>
            Manage users, roles, account status, and system permissions.
          </p>
        </div>

        <button
          type="button"
          className="user-role-add-button"
        >
          <span>＋</span>
          Add User
        </button>

      </div>


      {/* =========================================
          STATISTICS
          ========================================= */}

      <section className="user-role-stats">

        <div className="user-role-stat-card">
          <strong>7</strong>
          <span>Total Users</span>
        </div>

        <div className="user-role-stat-card">
          <strong>4</strong>
          <span>Doctors</span>
        </div>

        <div className="user-role-stat-card">
          <strong>2</strong>
          <span>Reviewers</span>
        </div>

        <div className="user-role-stat-card">
          <strong>1</strong>
          <span>Administrators</span>
        </div>

        <div className="user-role-stat-card">
          <strong>1</strong>
          <span>Pending Accounts</span>
        </div>

      </section>


      {/* =========================================
          ALL USERS
          ========================================= */}

      <section className="user-role-panel">

        <div className="user-role-panel-header">

          <h2>All Users</h2>

          <div className="user-role-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search users..."
            />

          </div>

        </div>


        <div className="user-role-table-wrapper">

          <table className="user-role-table">

            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>LAST ACTIVE</th>
                <th>CREATED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.email}>

                  <td>

                    <div className="user-name-cell">

                      <div className="user-avatar-small">
                        {user.initials}
                      </div>

                      <strong>
                        {user.name}
                      </strong>

                    </div>

                  </td>

                  <td>
                    <span className="user-email">
                      {user.email}
                    </span>
                  </td>

                  <td>

                    <span
                      className={`user-role-badge ${
                        user.role === "Admin"
                          ? "admin"
                          : user.role === "Ayurvedic Reviewer"
                            ? "reviewer"
                            : "doctor"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`user-status-badge ${
                        user.status.toLowerCase()
                      }`}
                    >
                      {user.status}
                    </span>

                  </td>

                  <td>
                    <span className="user-table-date">
                      {user.lastActive.split("\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < user.lastActive.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                  </td>

                  <td>
                    <span className="user-table-date">
                      {user.created.split("\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < user.created.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </span>
                  </td>

                  <td>

                    <div className="user-actions">

                      <button
                        type="button"
                        title="View user"
                      >
                        ◉
                      </button>

                      <button
                        type="button"
                        title="Edit user"
                      >
                        ✎
                      </button>

                      <button
                        type="button"
                        className="deactivate-button"
                      >
                        Deactivate
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* =========================================
          ROLE PERMISSIONS MATRIX
          ========================================= */}

      <section className="user-role-panel permissions-panel">

        <div className="permissions-header">

          <h2>
            Role Permissions Matrix
          </h2>

          <p>
            Defines what each role can access and perform within Dravyaguna.
          </p>

        </div>


        <div className="permissions-table-wrapper">

          <table className="permissions-table">

            <thead>

              <tr>
                <th>PERMISSION</th>
                <th>ADMIN</th>
                <th>AYURVEDIC REVIEWER</th>
                <th>DOCTOR</th>
              </tr>

            </thead>

            <tbody>

              {permissions.map((item) => (

                <tr
                  key={item.permission}
                  className={item.restricted ? "restricted-row" : ""}
                >

                  <td>

                    <span>
                      {item.permission}
                    </span>

                    {item.restricted && (
                      <small className="restricted-badge">
                        Restricted
                      </small>
                    )}

                  </td>

                  <td>
                    {item.admin ? (
                      <span className="permission-check">✓</span>
                    ) : (
                      <span className="permission-dash">—</span>
                    )}
                  </td>

                  <td>
                    {item.reviewer ? (
                      <span className="permission-check">✓</span>
                    ) : (
                      <span className="permission-dash">—</span>
                    )}
                  </td>

                  <td>
                    {item.doctor ? (
                      <span className="permission-check">✓</span>
                    ) : (
                      <span className="permission-dash">—</span>
                    )}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  )
}

export default UserRoleManagement