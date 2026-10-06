import { useEffect, useState } from "react"
import { users as initialUsers } from "../data/users"
import "../styles/UserRoleManagement.css"


function formatDate(dateValue) {
  if (!dateValue) {
    return "—"
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}


function formatDateTime(dateValue) {
  if (!dateValue) {
    return "—"
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return (
    <>
      {date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
      <br />
      {date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </>
  )
}


function UserRoleManagement() {

  /* =========================================
     USER DATA
     ========================================= */

  const [userList, setUserList] = useState(() => {

    const savedUsers = localStorage.getItem(
      "dravyaguna_users"
    )

    if (savedUsers) {
      try {
        return JSON.parse(savedUsers)
      } catch {
        return initialUsers
      }
    }

    return initialUsers
  })


  /* =========================================
     MODAL STATES
     ========================================= */

  const [selectedUser, setSelectedUser] =
    useState(null)

  const [editingUser, setEditingUser] =
    useState(null)

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  })


  /* =========================================
     SEARCH
     ========================================= */

  const [searchTerm, setSearchTerm] =
    useState("")


  /* =========================================
     DEACTIVATE USER
     ========================================= */

  const handleDeactivate = (userId) => {

    const user = userList.find(
      (user) => user.id === userId
    )

    if (!user) {
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${user.name}?`
    )

    if (!confirmed) {
      return
    }

    setUserList((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: "Inactive",
            }
          : user
      )
    )
  }


  /* =========================================
     ACTIVATE USER
     ========================================= */

  const handleActivate = (userId) => {

    const user = userList.find(
      (user) => user.id === userId
    )

    if (!user) {
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to activate ${user.name}?`
    )

    if (!confirmed) {
      return
    }

    setUserList((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: "Active",
            }
          : user
      )
    )
  }


  /* =========================================
     ROLE PERMISSION RULES
     
     This is the central permission configuration.
     
     true  = role has permission
     false = role does not have permission
     ========================================= */

  const permissionRules = {

    "Admin": {
      "Search herbs": true,
      "View herb details": true,
      "Add herbs": true,
      "Edit herbs": true,
      "Review herbs": true,
      "Verify herbs": true,
      "Manage vocabulary": true,
      "Change scoring weights": true,
      "View analytics": true,
      "Manage users": true,
      "View audit log": true,
    },

    "Ayurvedic Reviewer": {
      "Search herbs": true,
      "View herb details": true,
      "Add herbs": true,
      "Edit herbs": true,
      "Review herbs": true,
      "Verify herbs": false,
      "Manage vocabulary": false,
      "Change scoring weights": false,
      "View analytics": true,
      "Manage users": false,
      "View audit log": true,
    },

    "Doctor": {
      "Search herbs": true,
      "View herb details": true,
      "Add herbs": false,
      "Edit herbs": false,
      "Review herbs": false,
      "Verify herbs": false,
      "Manage vocabulary": false,
      "Change scoring weights": false,
      "View analytics": false,
      "Manage users": false,
      "View audit log": false,
    },

  }


  /* =========================================
     PERMISSION LIST
     
     The table rows are generated from this list.
     ========================================= */

  const permissionList = [
    {
      permission: "Search herbs",
    },
    {
      permission: "View herb details",
    },
    {
      permission: "Add herbs",
    },
    {
      permission: "Edit herbs",
    },
    {
      permission: "Review herbs",
    },
    {
      permission: "Verify herbs",
      restricted: true,
    },
    {
      permission: "Manage vocabulary",
    },
    {
      permission: "Change scoring weights",
    },
    {
      permission: "View analytics",
    },
    {
      permission: "Manage users",
    },
    {
      permission: "View audit log",
    },
  ]


  /* =========================================
     DYNAMIC ROLES
     
     Roles are collected from the actual
     users currently present in userList.
     
     This means if a new role is added to
     the users data, it can appear automatically.
     ========================================= */

  const roles = [
    ...new Set(
      userList
        .map((user) => user.role)
        .filter(Boolean)
    ),
  ]


  /* =========================================
     ROLE ORDER
     
     Keeps the normal order:
     Admin → Ayurvedic Reviewer → Doctor
     
     Any other newly-created roles are added
     after these.
     ========================================= */

  const preferredRoleOrder = [
    "Admin",
    "Ayurvedic Reviewer",
    "Doctor",
  ]


  const orderedRoles = [
    ...preferredRoleOrder.filter(
      (role) => roles.includes(role)
    ),

    ...roles.filter(
      (role) => !preferredRoleOrder.includes(role)
    ),
  ]


  /* =========================================
     GET PERMISSION FOR ROLE
     ========================================= */

  const hasPermission = (
    role,
    permission
  ) => {

    return (
      permissionRules[role]?.[permission] === true
    )
  }


  /* =========================================
     SAVE USERS TO LOCAL STORAGE
     ========================================= */

  useEffect(() => {

    localStorage.setItem(
      "dravyaguna_users",
      JSON.stringify(userList)
    )

  }, [userList])


  /* =========================================
     DYNAMIC STATISTICS
     ========================================= */

  const totalUsers =
    userList.length

  const doctorCount =
    userList.filter(
      (user) => user.role === "Doctor"
    ).length

  const reviewerCount =
    userList.filter(
      (user) => user.role === "Ayurvedic Reviewer"
    ).length

  const adminCount =
    userList.filter(
      (user) => user.role === "Admin"
    ).length

  const pendingCount =
    userList.filter(
      (user) => user.status === "Pending"
    ).length


  /* =========================================
     FILTER USERS
     ========================================= */

  const filteredUsers =
    userList.filter((user) => {

      const search =
        searchTerm.toLowerCase().trim()

      if (!search) {
        return true
      }

      return (
        user.name
          ?.toLowerCase()
          .includes(search) ||

        user.email
          ?.toLowerCase()
          .includes(search) ||

        user.role
          ?.toLowerCase()
          .includes(search) ||

        user.status
          ?.toLowerCase()
          .includes(search)
      )
    })


  /* =========================================
     OPEN EDIT USER
     ========================================= */

  function handleEditUser(user) {

    setEditingUser(user)

    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
  }


  /* =========================================
     SAVE EDITED USER
     ========================================= */

  function handleSaveEdit() {

    setUserList((currentUsers) =>
      currentUsers.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: editForm.name,
              email: editForm.email,
              role: editForm.role,
              status: editForm.status,

              initials: editForm.name
                .split(" ")
                .filter(Boolean)
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
            }
          : user
      )
    )

    setEditingUser(null)
  }


  return (

    <div className="user-role-page">


      {/* =========================================
          PAGE HEADER
         ========================================= */}

      <div className="user-role-header">

        <div>

          <h1>
            User & Role Management
          </h1>

          <p>
            Manage users, roles, account status,
            and system permissions.
          </p>

        </div>

      </div>


      {/* =========================================
          STATISTICS
         ========================================= */}

      <section className="user-role-stats">

        <div className="user-role-stat-card">
          <strong>{totalUsers}</strong>
          <span>Total Users</span>
        </div>

        <div className="user-role-stat-card">
          <strong>{doctorCount}</strong>
          <span>Doctors</span>
        </div>

        <div className="user-role-stat-card">
          <strong>{reviewerCount}</strong>
          <span>Reviewers</span>
        </div>

        <div className="user-role-stat-card">
          <strong>{adminCount}</strong>
          <span>Administrators</span>
        </div>

        <div className="user-role-stat-card">
          <strong>{pendingCount}</strong>
          <span>Pending Accounts</span>
        </div>

      </section>


      {/* =========================================
          ALL USERS
         ========================================= */}

      <section className="user-role-panel">

        <div className="user-role-panel-header">

          <h2>
            All Users
          </h2>

          <div className="user-role-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
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

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => (

                  <tr key={user.id}>

                    {/* NAME */}

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


                    {/* EMAIL */}

                    <td>

                      <span className="user-email">
                        {user.email}
                      </span>

                    </td>


                    {/* ROLE */}

                    <td>

                      <span
                        className={`user-role-badge ${
                          user.role === "Admin"
                            ? "admin"
                            : user.role ===
                              "Ayurvedic Reviewer"
                            ? "reviewer"
                            : "doctor"
                        }`}
                      >
                        {user.role}
                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`user-status-badge ${
                          user.status?.toLowerCase()
                        }`}
                      >
                        {user.status}
                      </span>

                    </td>


                    {/* LAST ACTIVE */}

                    <td>

                      <span className="user-table-date">

                        {formatDateTime(
                          user.lastActive
                        )}

                      </span>

                    </td>


                    {/* CREATED */}

                    <td>

                      <span className="user-table-date">

                        {formatDate(
                          user.createdAt
                        )}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="user-actions">

                        {/* VIEW */}

                        <button
                          type="button"
                          title="View user"
                          onClick={() =>
                            setSelectedUser(user)
                          }
                        >
                          ◉
                        </button>


                        {/* EDIT */}

                        <button
                          type="button"
                          title="Edit user"
                          onClick={() =>
                            handleEditUser(user)
                          }
                        >
                          ✎
                        </button>


                        {/* ACTIVATE / DEACTIVATE */}

                        {user.status === "Inactive" ? (

                          <button
                            type="button"
                            className="activate-button"
                            onClick={() =>
                              handleActivate(user.id)
                            }
                          >
                            Activate
                          </button>

                        ) : (

                          <button
                            type="button"
                            className="deactivate-button"
                            onClick={() =>
                              handleDeactivate(user.id)
                            }
                          >
                            Deactivate
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="no-users-found"
                  >
                    No users found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =========================================
          DYNAMIC ROLE PERMISSIONS MATRIX
         ========================================= */}

      <section className="user-role-panel permissions-panel">

        <div className="permissions-header">

          <h2>
            Role Permissions Matrix
          </h2>

          <p>
            Defines what each role can access
            and perform within Dravyaguna.
          </p>

        </div>


        <div className="permissions-table-wrapper">

          <table className="permissions-table">

            <thead>

              <tr>

                <th>
                  PERMISSION
                </th>

                {orderedRoles.map((role) => (

                  <th key={role}>
                    {role.toUpperCase()}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody>

              {permissionList.map((item) => (

                <tr
                  key={item.permission}
                  className={
                    item.restricted
                      ? "restricted-row"
                      : ""
                  }
                >

                  {/* PERMISSION NAME */}

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


                  {/* DYNAMIC ROLE COLUMNS */}

                  {orderedRoles.map((role) => (

                    <td key={`${role}-${item.permission}`}>

                      {hasPermission(
                        role,
                        item.permission
                      ) ? (

                        <span className="permission-check">
                          ✓
                        </span>

                      ) : (

                        <span className="permission-dash">
                          —
                        </span>

                      )}

                    </td>

                  ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* =========================================
          VIEW USER MODAL
         ========================================= */}

      {selectedUser && (

        <div
          className="user-view-overlay"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="user-view-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="user-view-header">

              <div>

                <div className="user-view-avatar">
                  {selectedUser.initials}
                </div>

                <h2>
                  {selectedUser.name}
                </h2>

                <p>
                  {selectedUser.email}
                </p>

              </div>


              <button
                type="button"
                className="user-view-close"
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                ×
              </button>

            </div>


            <div className="user-view-details">

              <div className="user-view-detail">

                <span>
                  User ID
                </span>

                <strong>
                  {selectedUser.id}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Role
                </span>

                <strong>
                  {selectedUser.role}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Status
                </span>

                <strong
                  className={`user-view-status ${
                    selectedUser.status?.toLowerCase()
                  }`}
                >
                  {selectedUser.status}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Created
                </span>

                <strong>
                  {formatDate(
                    selectedUser.createdAt
                  )}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Last Active
                </span>

                <strong>
                  {formatDateTime(
                    selectedUser.lastActive
                  )}
                </strong>

              </div>

            </div>


            <div className="user-view-footer">

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =========================================
          EDIT USER MODAL
         ========================================= */}

      {editingUser && (

        <div
          className="user-view-overlay"
          onClick={() =>
            setEditingUser(null)
          }
        >

          <div
            className="user-view-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="user-view-header">

              <div>

                <div className="user-view-avatar">
                  {editingUser.initials}
                </div>

                <h2>
                  Edit User
                </h2>

                <p>
                  Update user information
                </p>

              </div>


              <button
                type="button"
                className="user-view-close"
                onClick={() =>
                  setEditingUser(null)
                }
              >
                ×
              </button>

            </div>


            {/* EDIT FORM */}

            <div className="user-edit-form">

              {/* NAME */}

              <div className="user-edit-field">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      name: event.target.value,
                    })
                  }
                />

              </div>


              {/* EMAIL */}

              <div className="user-edit-field">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      email: event.target.value,
                    })
                  }
                />

              </div>


              {/* ROLE */}

              <div className="user-edit-field">

                <label>
                  Role
                </label>

                <select
                  value={editForm.role}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      role: event.target.value,
                    })
                  }
                >

                  <option value="Admin">
                    Admin
                  </option>

                  <option value="Ayurvedic Reviewer">
                    Ayurvedic Reviewer
                  </option>

                  <option value="Doctor">
                    Doctor
                  </option>

                </select>

              </div>


              {/* STATUS */}

              <div className="user-edit-field">

                <label>
                  Status
                </label>

                <select
                  value={editForm.status}
                  onChange={(event) =>
                    setEditForm({
                      ...editForm,
                      status: event.target.value,
                    })
                  }
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                </select>

              </div>

            </div>


            {/* EDIT FOOTER */}

            <div className="user-view-footer">

              <button
                type="button"
                onClick={() =>
                  setEditingUser(null)
                }
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}


export default UserRoleManagement