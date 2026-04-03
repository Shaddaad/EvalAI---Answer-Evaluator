import { useState, useEffect } from "react"
import api from "../services/api"

function AdminTeachers(){

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [subject, setSubject] = useState("")
  const [teachers, setTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      const res = await api.get("/admin/teachers")
      setTeachers(res.data.teachers)
    } catch(e) {
      console.log("Error loading teachers")
    }
  }

  const handleCreateTeacher = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess("")

    try {
      await api.post("/admin/create-teacher", {
        name: name,
        email: email,
        password: password,
        subject: subject
      })
      setSuccess("Teacher created successfully")
      setName("")
      setEmail("")
      setPassword("")
      setSubject("")
      loadTeachers()
    } catch(error) {
      alert("Error creating teacher")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTeacher = async (teacherId) => {
    if (!confirm("Are you sure you want to remove this teacher?")) return
    try {
      await api.delete(`/admin/teacher/${teacherId}`)
      loadTeachers()
    } catch(error) {
      alert("Error removing teacher")
    }
  }

  return(

    <div style={styles.page} className="animate-fade-in-up">

      <div style={styles.header}>
        <div style={styles.headerIcon}>⬡</div>
        <div>
          <h2 style={styles.title}>Teachers</h2>
          <p style={styles.subtitle}>Create teacher accounts and manage their credentials</p>
        </div>
      </div>

      {/* Create Teacher Form */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add New Teacher</h3>

        {success && (
          <div style={styles.successBox}>
            <span style={styles.successDot}></span>
            <span style={styles.successText}>{success}</span>
          </div>
        )}

        <form onSubmit={handleCreateTeacher} style={styles.form}>
          <div style={styles.fieldRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="teacher-name">Full Name</label>
              <input id="teacher-name" placeholder="e.g. Dr. Sreekumar K" value={name}
                onChange={(e)=>setName(e.target.value)} style={styles.input} required />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="teacher-subject">Subject</label>
              <input id="teacher-subject" placeholder="e.g. Computer Science" value={subject}
                onChange={(e)=>setSubject(e.target.value)} style={styles.input} required />
            </div>
          </div>

          <div style={styles.fieldRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="teacher-email">Username / Email</label>
              <input id="teacher-email" placeholder="e.g. sreekumar@college.com" value={email}
                onChange={(e)=>setEmail(e.target.value)} style={styles.input} required />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="teacher-password">Password</label>
              <input id="teacher-password" type="password" placeholder="Set a password" value={password}
                onChange={(e)=>setPassword(e.target.value)} style={styles.input} required />
            </div>
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.submitBtn} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Teacher"}
            </button>
          </div>
        </form>
      </div>

      {/* Teachers List */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>All Teachers</h3>
          <span style={styles.tableBadge}>{teachers.length} teacher{teachers.length !== 1 ? 's' : ''}</span>
        </div>

        {teachers.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>—</div>
            <div style={styles.emptyTitle}>No teachers yet</div>
            <div style={styles.emptyDesc}>Create your first teacher above.</div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Subject</th>
                  <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t, i) => (
                  <tr key={t._id || i} style={styles.tr}>
                    <td style={styles.tdIndex}>{String(i + 1).padStart(2, '0')}</td>
                    <td style={styles.td}>
                      <div style={styles.nameRow}>
                        <div style={styles.avatar}>{t.name ? t.name.charAt(0).toUpperCase() : '?'}</div>
                        <span style={styles.nameText}>{t.name}</span>
                      </div>
                    </td>
                    <td style={styles.tdMuted}>{t.email}</td>
                    <td style={styles.td}>
                      <span style={styles.subjectBadge}>{t.subject || '—'}</span>
                    </td>
                    <td style={{...styles.td, textAlign: 'right'}}>
                      <button onClick={() => handleDeleteTeacher(t._id)} style={styles.deleteBtn}>Remove</button>
                    </td>
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

  headerIcon: {
    width: "44px", height: "44px", borderRadius: "12px", background: "#171717",
    color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: "600", flexShrink: 0,
  },

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
  input: {
    padding: "11px 14px", borderRadius: "10px", border: "1px solid #E5E5E5",
    background: "#FAFAFA", fontSize: "14px", fontFamily: "'Inter', sans-serif",
    color: "#171717", outline: "none", letterSpacing: "-0.01em", width: "100%", boxSizing: "border-box",
  },

  actions: { display: "flex", justifyContent: "flex-end", paddingTop: "8px" },
  submitBtn: {
    padding: "11px 28px", borderRadius: "10px", border: "none", background: "#000000",
    color: "#FFFFFF", fontSize: "14px", fontWeight: "600", cursor: "pointer",
    fontFamily: "'Inter', sans-serif", letterSpacing: "-0.01em",
  },

  tableCard: { background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" },
  tableHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #E5E5E5" },
  tableTitle: { fontSize: "16px", fontWeight: "600", color: "#171717", letterSpacing: "-0.02em", margin: 0 },
  tableBadge: { fontSize: "12px", fontWeight: "500", color: "#737373", background: "#F5F5F5", padding: "4px 10px", borderRadius: "9999px", border: "1px solid #EBEBEB" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 24px", fontSize: "11px", fontWeight: "600", color: "#737373", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid #F5F5F5", background: "#FAFAFA" },
  tr: { borderBottom: "1px solid #F5F5F5" },
  tdIndex: { padding: "14px 24px", fontSize: "12px", fontWeight: "500", color: "#A3A3A3", width: "48px" },
  td: { padding: "14px 24px", fontSize: "14px", color: "#171717" },
  tdMuted: { padding: "14px 24px", fontSize: "13px", color: "#737373" },

  nameRow: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "28px", height: "28px", borderRadius: "7px", background: "#171717", color: "#FFFFFF", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" },
  nameText: { fontWeight: "500", letterSpacing: "-0.01em" },

  subjectBadge: { fontSize: "12px", fontWeight: "500", color: "#525252", background: "#F5F5F5", padding: "4px 10px", borderRadius: "9999px", border: "1px solid #EBEBEB" },

  emptyState: { padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  emptyIcon: { width: "48px", height: "48px", borderRadius: "12px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#D4D4D4", marginBottom: "16px" },
  emptyTitle: { fontSize: "15px", fontWeight: "600", color: "#404040", marginBottom: "4px" },
  emptyDesc: { fontSize: "13px", color: "#A3A3A3" },

  deleteBtn: {
    padding: "6px 14px", borderRadius: "8px", border: "1px solid #E5E5E5",
    background: "#FFFFFF", color: "#DC2626", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.01em",
    transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
}

export default AdminTeachers
