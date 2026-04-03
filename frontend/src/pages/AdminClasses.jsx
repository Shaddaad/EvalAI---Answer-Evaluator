import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function AdminClasses(){

  const navigate = useNavigate()

  const [className, setClassName] = useState("")
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [t, c] = await Promise.all([
        api.get("/admin/teachers"),
        api.get("/admin/classes"),
      ])
      setTeachers(t.data.teachers)
      setClasses(c.data.classes)
    } catch(e) {
      console.log("Error loading data")
    }
  }

  const handleCreateClass = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess("")

    try {
      await api.post("/admin/create-class", {
        name: className
      })
      setSuccess("Class created successfully")
      setClassName("")
      loadData()
    } catch(error) {
      alert("Error creating class")
    } finally {
      setIsLoading(false)
    }
  }

  return(

    <div style={styles.page} className="animate-fade-in-up">

      <div style={styles.header}>
        <div style={styles.headerIcon}>⬒</div>
        <div>
          <h2 style={styles.title}>Classes</h2>
          <p style={styles.subtitle}>Create classes and assign teachers to manage them</p>
        </div>
      </div>

      {/* Create Class Form */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Create New Class</h3>

        {success && (
          <div style={styles.successBox}>
            <span style={styles.successDot}></span>
            <span style={styles.successText}>{success}</span>
          </div>
        )}

        <form onSubmit={handleCreateClass} style={styles.form}>
          <div style={styles.fieldRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="class-name">Class Name</label>
              <input id="class-name" placeholder="e.g. CS6B" value={className}
                onChange={(e)=>setClassName(e.target.value)} style={styles.input} required />
            </div>
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.submitBtn} disabled={isLoading || !className}>
              {isLoading ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>

      {/* Classes List */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>All Classes</h3>
          <span style={styles.tableBadge}>{classes.length} class{classes.length !== 1 ? 'es' : ''}</span>
        </div>

        {classes.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>—</div>
            <div style={styles.emptyTitle}>No classes yet</div>
            <div style={styles.emptyDesc}>Create your first class above.</div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                   <th style={styles.th}>#</th>
                   <th style={styles.th}>Class Name</th>
                   <th style={styles.th}>Teacher</th>
                   <th style={styles.th}>Students</th>
                   <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c, i) => (
                   <tr key={c._id || i} style={styles.tr}
                     onClick={() => navigate(`/admin-class/${c._id}`)}
                     title="Click to view students"
                   >
                     <td style={styles.tdIndex}>{String(i + 1).padStart(2, '0')}</td>
                     <td style={styles.td}>
                       <span style={styles.classBadge}>{c.name}</span>
                     </td>
                     <td style={styles.tdMuted}>{c.teacher_name || c.teacher_id || '—'}</td>
                     <td style={styles.td}>
                       <span style={styles.countBadge}>{c.student_count ?? (c.students ? c.students.length : 0)}</span>
                     </td>
                     <td style={styles.tdAction}>View →</td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

const styles = {
  page: { maxWidth: "800px" },
  header: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" },
  headerIcon: { width: "44px", height: "44px", borderRadius: "12px", background: "#171717", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "600", flexShrink: 0 },
  title: { fontSize: "24px", fontWeight: "700", color: "#171717", letterSpacing: "-0.03em", margin: "0 0 4px 0" },
  subtitle: { fontSize: "14px", color: "#737373", margin: 0, fontWeight: "400" },

  card: { background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "32px", marginBottom: "20px" },
  cardTitle: { fontSize: "16px", fontWeight: "600", color: "#171717", letterSpacing: "-0.02em", margin: "0 0 20px 0" },

  successBox: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#F5F5F5", border: "1px solid #E5E5E5", borderRadius: "10px", marginBottom: "20px" },
  successDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#171717", flexShrink: 0 },
  successText: { fontSize: "13px", color: "#171717", fontWeight: "500" },

  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldRow: { display: "flex", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  label: { fontSize: "13px", fontWeight: "500", color: "#404040", letterSpacing: "-0.01em" },
  input: { padding: "11px 14px", borderRadius: "10px", border: "1px solid #E5E5E5", background: "#FAFAFA", fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "#171717", outline: "none", letterSpacing: "-0.01em", width: "100%", boxSizing: "border-box" },

  actions: { display: "flex", justifyContent: "flex-end", paddingTop: "8px" },
  submitBtn: { padding: "11px 28px", borderRadius: "10px", border: "none", background: "#000000", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.01em" },

  tableCard: { background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" },
  tableHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #E5E5E5" },
  tableTitle: { fontSize: "16px", fontWeight: "600", color: "#171717", letterSpacing: "-0.02em", margin: 0 },
  tableBadge: { fontSize: "12px", fontWeight: "500", color: "#737373", background: "#F5F5F5", padding: "4px 10px", borderRadius: "9999px", border: "1px solid #EBEBEB" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 24px", fontSize: "11px", fontWeight: "600", color: "#737373", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid #F5F5F5", background: "#FAFAFA" },
  tr: { borderBottom: "1px solid #F5F5F5", cursor: "pointer", transition: "background 150ms ease" },
  tdIndex: { padding: "14px 24px", fontSize: "12px", fontWeight: "500", color: "#A3A3A3", width: "48px" },
  td: { padding: "14px 24px", fontSize: "14px", color: "#171717" },
  tdMuted: { padding: "14px 24px", fontSize: "13px", color: "#737373" },
  classBadge: { fontSize: "13px", fontWeight: "600", color: "#171717", background: "#F5F5F5", padding: "4px 12px", borderRadius: "6px", border: "1px solid #E5E5E5" },
  countBadge: { fontSize: "13px", fontWeight: "600", color: "#171717", background: "#F5F5F5", padding: "3px 10px", borderRadius: "6px", border: "1px solid #E5E5E5" },
  tdAction: { padding: "14px 24px", fontSize: "12px", color: "#A3A3A3", textAlign: "right", fontWeight: "500", letterSpacing: "0.02em" },

  emptyState: { padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  emptyIcon: { width: "48px", height: "48px", borderRadius: "12px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#D4D4D4", marginBottom: "16px" },
  emptyTitle: { fontSize: "15px", fontWeight: "600", color: "#404040", marginBottom: "4px" },
  emptyDesc: { fontSize: "13px", color: "#A3A3A3" },
}

export default AdminClasses
