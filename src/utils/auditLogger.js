export function addAuditLog({
    action,
    module,
    item,
    previous,
    newValue,
  }) {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("herbUser")
      )
  
      const auditLogs = JSON.parse(
        localStorage.getItem("dravyaguna_audit_logs") || "[]"
      )
  
      const newLog = {
        id: `AUD-${Date.now()}`,
  
        timestamp: new Date().toISOString(),
  
        user:
          currentUser?.name ||
          currentUser?.fullName ||
          "Unknown User",
  
        role:
          currentUser?.role ||
          "Unknown",
  
        action,
        module,
        item,
  
        previous:
          previous ?? "—",
  
        newValue:
          newValue ?? "—",
      }
  
      const updatedLogs = [
        newLog,
        ...auditLogs,
      ]
  
      localStorage.setItem(
        "dravyaguna_audit_logs",
        JSON.stringify(updatedLogs)
      )
  
      console.log(
        "Audit log added:",
        newLog
      )
  
    } catch (error) {
      console.error(
        "Failed to create audit log:",
        error
      )
    }
  }