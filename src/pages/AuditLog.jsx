import { useEffect, useMemo, useState } from "react"
import "../styles/AuditLog.css"


/* =========================================
   HELPERS
   ========================================= */

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


function getDateOnly(dateValue) {
  if (!dateValue) {
    return ""
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toISOString().split("T")[0]
}


function normalizeAuditEntry(entry, index) {
  return {
    id:
      entry.id ||
      `AUDIT-${Date.now()}-${index}`,

    timestamp:
      entry.timestamp ||
      entry.createdAt ||
      entry.date ||
      null,

    user:
      entry.user ||
      entry.userName ||
      entry.name ||
      "Unknown User",

    role:
      entry.role ||
      "—",

    action:
      entry.action ||
      "Unknown Action",

    module:
      entry.module ||
      "—",

    item:
      entry.item ||
      entry.itemName ||
      "—",

    previous:
      entry.previous ??
      entry.previousValue ??
      "—",

    newValue:
      entry.newValue ??
      entry.new ??
      "—",
  }
}


/* =========================================
   COMPONENT
   ========================================= */

function AuditLog() {

  /* =========================================
     AUDIT DATA
     ========================================= */

  const [auditEntries, setAuditEntries] =
    useState(() => {

      const savedLogs =
        localStorage.getItem(
          "dravyaguna_audit_logs"
        )

      if (!savedLogs) {
        return []
      }

      try {
        const parsedLogs = JSON.parse(savedLogs)

        if (!Array.isArray(parsedLogs)) {
          return []
        }

        return parsedLogs.map(
          normalizeAuditEntry
        )
      } catch {
        return []
      }
    })


  /* =========================================
     FILTER STATES
     ========================================= */

  const [selectedUser, setSelectedUser] =
    useState("all-users")

  const [selectedAction, setSelectedAction] =
    useState("all-actions")

  const [selectedModule, setSelectedModule] =
    useState("all-modules")

  const [searchTerm, setSearchTerm] =
    useState("")

  const [startDate, setStartDate] =
    useState("")

  const [endDate, setEndDate] =
    useState("")


  /* =========================================
     APPLIED FILTER STATES
     ========================================= */

  const [appliedFilters, setAppliedFilters] =
    useState({
      user: "all-users",
      action: "all-actions",
      module: "all-modules",
      search: "",
      startDate: "",
      endDate: "",
    })


  /* =========================================
     PAGINATION
     ========================================= */

  const [currentPage, setCurrentPage] =
    useState(1)

  const entriesPerPage = 7


  /* =========================================
     VIEW DETAILS
     ========================================= */

  const [selectedEntry, setSelectedEntry] =
    useState(null)


  /* =========================================
     SAVE NORMALIZED AUDIT LOGS
     ========================================= */

  useEffect(() => {

    localStorage.setItem(
      "dravyaguna_audit_logs",
      JSON.stringify(auditEntries)
    )

  }, [auditEntries])


  /* =========================================
     LISTEN FOR AUDIT LOG UPDATES
     ========================================= */

  useEffect(() => {

    const handleStorageChange = (event) => {

      if (
        event.key !==
        "dravyaguna_audit_logs"
      ) {
        return
      }

      if (!event.newValue) {
        setAuditEntries([])
        return
      }

      try {

        const parsedLogs =
          JSON.parse(event.newValue)

        if (Array.isArray(parsedLogs)) {

          setAuditEntries(
            parsedLogs.map(
              normalizeAuditEntry
            )
          )

        }

      } catch {
        setAuditEntries([])
      }
    }


    window.addEventListener(
      "storage",
      handleStorageChange
    )


    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      )

    }

  }, [])


  /* =========================================
     DYNAMIC FILTER OPTIONS
     ========================================= */

  const userOptions = useMemo(() => {

    const users = auditEntries
      .map((entry) => entry.user)
      .filter(Boolean)

    return [
      ...new Set(users),
    ].sort()

  }, [auditEntries])


  const actionOptions = useMemo(() => {

    const actions = auditEntries
      .map((entry) => entry.action)
      .filter(Boolean)

    return [
      ...new Set(actions),
    ].sort()

  }, [auditEntries])


  const moduleOptions = useMemo(() => {

    const modules = auditEntries
      .map((entry) => entry.module)
      .filter(Boolean)

    return [
      ...new Set(modules),
    ].sort()

  }, [auditEntries])


  /* =========================================
     APPLY FILTERS
     ========================================= */

  const handleApplyFilters = () => {

    setAppliedFilters({
      user: selectedUser,
      action: selectedAction,
      module: selectedModule,
      search: searchTerm
        .toLowerCase()
        .trim(),
      startDate,
      endDate,
    })

    setCurrentPage(1)
  }


  /* =========================================
     CLEAR FILTERS
     ========================================= */

  const handleClearFilters = () => {

    setSelectedUser("all-users")
    setSelectedAction("all-actions")
    setSelectedModule("all-modules")
    setSearchTerm("")
    setStartDate("")
    setEndDate("")

    setAppliedFilters({
      user: "all-users",
      action: "all-actions",
      module: "all-modules",
      search: "",
      startDate: "",
      endDate: "",
    })

    setCurrentPage(1)
  }


  /* =========================================
     ENTER KEY SEARCH
     ========================================= */

  const handleSearchKeyDown = (event) => {

    if (event.key === "Enter") {
      handleApplyFilters()
    }

  }


  /* =========================================
     FILTER AUDIT ENTRIES
     ========================================= */

  const filteredEntries = useMemo(() => {

    return auditEntries.filter((entry) => {

      /* USER */

      if (
        appliedFilters.user !==
          "all-users" &&
        entry.user !==
          appliedFilters.user
      ) {
        return false
      }


      /* ACTION */

      if (
        appliedFilters.action !==
          "all-actions" &&
        entry.action !==
          appliedFilters.action
      ) {
        return false
      }


      /* MODULE */

      if (
        appliedFilters.module !==
          "all-modules" &&
        entry.module !==
          appliedFilters.module
      ) {
        return false
      }


      /* SEARCH */

      if (appliedFilters.search) {

        const searchText =
          appliedFilters.search

        const searchableText = [
          entry.user,
          entry.role,
          entry.action,
          entry.module,
          entry.item,
          entry.previous,
          entry.newValue,
        ]
          .join(" ")
          .toLowerCase()

        if (
          !searchableText.includes(
            searchText
          )
        ) {
          return false
        }

      }


      /* START DATE */

      if (
        appliedFilters.startDate
      ) {

        const entryDate =
          getDateOnly(
            entry.timestamp
          )

        if (
          !entryDate ||
          entryDate <
            appliedFilters.startDate
        ) {
          return false
        }

      }


      /* END DATE */

      if (
        appliedFilters.endDate
      ) {

        const entryDate =
          getDateOnly(
            entry.timestamp
          )

        if (
          !entryDate ||
          entryDate >
            appliedFilters.endDate
        ) {
          return false
        }

      }


      return true

    })

  }, [
    auditEntries,
    appliedFilters,
  ])


  /* =========================================
     SORT NEWEST FIRST
     ========================================= */

  const sortedEntries = useMemo(() => {

    return [...filteredEntries].sort(
      (a, b) => {

        const dateA =
          new Date(
            a.timestamp || 0
          ).getTime()

        const dateB =
          new Date(
            b.timestamp || 0
          ).getTime()

        return dateB - dateA

      }
    )

  }, [filteredEntries])


  /* =========================================
     PAGINATION DATA
     ========================================= */

  const totalEntries =
    sortedEntries.length

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalEntries /
          entriesPerPage
      )
    )


  const startIndex =
    (currentPage - 1) *
    entriesPerPage


  const paginatedEntries =
    sortedEntries.slice(
      startIndex,
      startIndex +
        entriesPerPage
    )


  /* =========================================
     KEEP PAGE VALID
     ========================================= */

  useEffect(() => {

    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(totalPages)
    }

  }, [
    currentPage,
    totalPages,
  ])


  /* =========================================
     PAGINATION
     ========================================= */

  const handlePageChange = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return
    }

    setCurrentPage(page)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })

  }


  /* =========================================
     PAGE BUTTONS
     ========================================= */

  const pageNumbers = useMemo(() => {

    if (totalPages <= 5) {

      return Array.from(
        {
          length: totalPages,
        },
        (_, index) =>
          index + 1
      )

    }

    if (currentPage <= 3) {

      return [
        1,
        2,
        3,
        4,
        "...",
        totalPages,
      ]

    }

    if (
      currentPage >=
      totalPages - 2
    ) {

      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]

    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ]

  }, [
    currentPage,
    totalPages,
  ])


  /* =========================================
     ACTION CLASS
     ========================================= */

  const getActionClass = (action) => {

    const normalized =
      action
        ?.toLowerCase()
        .trim()

    if (
      normalized.includes(
        "deactiv"
      ) ||
      normalized.includes(
        "delete"
      ) ||
      normalized.includes(
        "removed"
      )
    ) {
      return "danger"
    }

    if (
      normalized.includes(
        "verify"
      )
    ) {
      return "verified"
    }

    if (
      normalized.includes(
        "add"
      ) ||
      normalized.includes(
        "create"
      )
    ) {
      return "added"
    }

    return ""

  }


  /* =========================================
     RENDER
     ========================================= */

  return (

    <div className="audit-log-page">


      {/* =========================================
          PAGE HEADER
         ========================================= */}

      <div className="audit-log-header">

        <div>

          <h1>
            Audit Log
          </h1>

          <p>
            Track who changed what and when
            across the entire knowledge base.
          </p>

        </div>

      </div>


      {/* =========================================
          FILTER SECTION
         ========================================= */}

      <section className="audit-log-filter-card">

        <div className="audit-log-filter-row">


          {/* USER */}

          <select
            value={selectedUser}
            onChange={(event) =>
              setSelectedUser(
                event.target.value
              )
            }
          >

            <option value="all-users">
              All Users
            </option>

            {userOptions.map(
              (user) => (

                <option
                  key={user}
                  value={user}
                >
                  {user}
                </option>

              )
            )}

          </select>


          {/* ACTION */}

          <select
            value={selectedAction}
            onChange={(event) =>
              setSelectedAction(
                event.target.value
              )
            }
          >

            <option value="all-actions">
              All Actions
            </option>

            {actionOptions.map(
              (action) => (

                <option
                  key={action}
                  value={action}
                >
                  {action}
                </option>

              )
            )}

          </select>


          {/* MODULE */}

          <select
            value={selectedModule}
            onChange={(event) =>
              setSelectedModule(
                event.target.value
              )
            }
          >

            <option value="all-modules">
              All Modules
            </option>

            {moduleOptions.map(
              (module) => (

                <option
                  key={module}
                  value={module}
                >
                  {module}
                </option>

              )
            )}

          </select>


          {/* SEARCH */}

          <div className="audit-log-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search herb or item..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              onKeyDown={
                handleSearchKeyDown
              }
            />

          </div>

        </div>


        {/* DATE FILTER */}

        <div className="audit-log-date-row">


          <div className="audit-log-date-field">

            <input
              type="date"
              aria-label="Start date"
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value
                )
              }
            />

          </div>


          <span className="audit-log-date-separator">
            to
          </span>


          <div className="audit-log-date-field">

            <input
              type="date"
              aria-label="End date"
              value={endDate}
              onChange={(event) =>
                setEndDate(
                  event.target.value
                )
              }
            />

          </div>


          {/* APPLY */}

          <button
            type="button"
            className="audit-log-apply-button"
            onClick={
              handleApplyFilters
            }
          >
            <span>▽</span>
            Apply
          </button>


          {/* CLEAR */}

          <button
            type="button"
            className="audit-log-clear-button"
            onClick={
              handleClearFilters
            }
          >
            Clear
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

                <th>
                  TIMESTAMP
                </th>

                <th>
                  USER
                </th>

                <th>
                  ROLE
                </th>

                <th>
                  ACTION
                </th>

                <th>
                  MODULE
                </th>

                <th>
                  ITEM
                </th>

                <th>
                  PREVIOUS VALUE
                </th>

                <th>
                  NEW VALUE
                </th>

                <th>
                  ACTIONS
                </th>

              </tr>

            </thead>


            <tbody>

              {paginatedEntries.length >
              0 ? (

                paginatedEntries.map(
                  (entry) => (

                    <tr
                      key={entry.id}
                    >

                      {/* TIMESTAMP */}

                      <td>

                        <span className="audit-timestamp">

                          {formatDateTime(
                            entry.timestamp
                          )}

                        </span>

                      </td>


                      {/* USER */}

                      <td>

                        <strong className="audit-user">

                          {entry.user}

                        </strong>

                      </td>


                      {/* ROLE */}

                      <td>

                        <span className="audit-role">

                          {entry.role}

                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        <span
                          className={`audit-action ${getActionClass(
                            entry.action
                          )}`}
                        >

                          {entry.action}

                        </span>

                      </td>


                      {/* MODULE */}

                      <td>

                        <span className="audit-module">

                          {entry.module}

                        </span>

                      </td>


                      {/* ITEM */}

                      <td>

                        <strong className="audit-item">

                          {entry.item}

                        </strong>

                      </td>


                      {/* PREVIOUS */}

                      <td>

                        <span className="audit-value previous-value">

                          {entry.previous}

                        </span>

                      </td>


                      {/* NEW */}

                      <td>

                        <span className="audit-value new-value">

                          {entry.newValue}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="audit-actions">


                          {/* VIEW */}

                          <button
                            type="button"
                            title="View details"
                            onClick={() =>
                              setSelectedEntry(
                                entry
                              )
                            }
                          >
                            ◉
                          </button>


                          {/* ROLLBACK */}

                          <button
                            type="button"
                            className="rollback-button"
                            onClick={() =>
                              window.alert(
                                "Rollback will be connected to the original module data after the corresponding module supports audit restoration."
                              )
                            }
                          >
                            Rollback
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="no-audit-results"
                  >

                    No audit entries found
                    for the selected filters.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =========================================
            TABLE FOOTER
           ========================================= */}

        <div className="audit-log-footer">

          <span>

            {totalEntries === 0
              ? "Showing 0 audit entries"
              : `Showing ${
                  startIndex + 1
                }–${Math.min(
                  startIndex +
                    entriesPerPage,
                  totalEntries
                )} of ${
                  totalEntries
                } audit ${
                  totalEntries === 1
                    ? "entry"
                    : "entries"
                }`}

          </span>


          {totalEntries > 0 && (

            <div className="audit-pagination">


              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
              >
                ‹
              </button>


              {/* PAGE NUMBERS */}

              {pageNumbers.map(
                (page, index) => {

                  if (
                    page === "..."
                  ) {

                    return (
                      <span
                        key={`ellipsis-${index}`}
                      >
                        ...
                      </span>
                    )

                  }

                  return (

                    <button
                      key={page}
                      type="button"
                      className={
                        currentPage ===
                        page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handlePageChange(
                          page
                        )
                      }
                    >
                      {page}
                    </button>

                  )

                }
              )}


              {/* NEXT */}

              <button
                type="button"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
              >
                ›
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =========================================
          VIEW DETAILS MODAL
         ========================================= */}

      {selectedEntry && (

        <div
          className="user-view-overlay"
          onClick={() =>
            setSelectedEntry(null)
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
                  ✓
                </div>

                <h2>
                  Audit Details
                </h2>

                <p>
                  {selectedEntry.action}
                </p>

              </div>


              <button
                type="button"
                className="user-view-close"
                onClick={() =>
                  setSelectedEntry(null)
                }
              >
                ×
              </button>

            </div>


            <div className="user-view-details">


              <div className="user-view-detail">

                <span>
                  Timestamp
                </span>

                <strong>
                  {formatDateTime(
                    selectedEntry.timestamp
                  )}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  User
                </span>

                <strong>
                  {selectedEntry.user}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Role
                </span>

                <strong>
                  {selectedEntry.role}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Action
                </span>

                <strong>
                  {selectedEntry.action}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Module
                </span>

                <strong>
                  {selectedEntry.module}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Item
                </span>

                <strong>
                  {selectedEntry.item}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  Previous Value
                </span>

                <strong>
                  {selectedEntry.previous}
                </strong>

              </div>


              <div className="user-view-detail">

                <span>
                  New Value
                </span>

                <strong>
                  {selectedEntry.newValue}
                </strong>

              </div>

            </div>


            <div className="user-view-footer">

              <button
                type="button"
                onClick={() =>
                  setSelectedEntry(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}


export default AuditLog