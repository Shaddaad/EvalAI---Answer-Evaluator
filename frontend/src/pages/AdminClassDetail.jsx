import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"

function AdminClassDetail() {
  const { classId } = useParams()
  const navigate = useNavigate()
  const [cls, setCls] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadClass()
  }, [classId])

  const loadClass = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await api.get(`/admin/class/${classId}`)
      setCls(res.data.class)
    } catch (e) {
      setError("Failed to load class details.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.page} className="animate-fade-in-up">

      {/* Back button */}
      <button style={styles.backBtn} onClick={() => navigate("/admin-classes")}>
        ← Back to Classes
      </button>

      {isLoading ? (
        <div style={styles.loadingBox}>
          <div style={styles.loadingDot} />
          <span style={styles.loadingText}>Loading class…</span>
        </div>
      ) : error ? (
        <div style={styles.errorBox}>{error}</div>
      ) : cls ? (
        <>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerIcon}>⬒</div>
            <div>
              <h2 style={styles.title}>{cls.name}</h2>
              <p style={styles.subtitle}>
                Teacher: <strong>{cls.teacher_name || "—"}</strong>
                &nbsp;·&nbsp;
                {cls.students.length} student{cls.students.length !== 1 ? "s" : ""} enrolled
              </p>
            </div>
          </div>

          {/* Students Table */}
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h3 style={styles.tableTitle}>Enrolled Students</h3>
              <span style={styles.tableBadge}>
                {cls.students.length} student{cls.students.length !== 1 ? "s" : ""}
              </span>
            </div>

            {cls.students.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>◎</div>
                <div style={styles.emptyTitle}>No students enrolled</div>
                <div style={styles.emptyDesc}>
                  Use the Students page to add students to this class.
                </div>
              </div>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students.map((s, i) => (
                      <tr key={s._id || i} style={styles.tr}>
                        <td style={styles.tdIndex}>{String(i + 1).padStart(2, "0")}</td>
                        <td style={styles.td}>
                          <div style={styles.nameRow}>
                            <div style={styles.avatar}>
                              {s.name ? s.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <span style={styles.nameText}>{s.name || "—"}</span>
                          </div>
                        </td>
                        <td style={styles.tdMuted}>{s.email || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

const styles = {
  page: { maxWidth: "800px" },

  backBtn: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "8px 16px", borderRadius: "10px", border: "1px solid #E5E5E5",
    background: "#FFFFFF", color: "#404040", fontSize: "13px", fontWeight: "500",
    cursor: "pointer", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.01em",
    marginBottom: "24px", transition: "all 150ms ease",
  },

  loadingBox: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "32px 0", color: "#737373",
  },
  loadingDot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: "#171717", animation: "pulse 1s infinite",
  },
  loadingText: { fontSize: "14px", color: "#737373" },

  errorBox: {
    padding: "16px 20px", borderRadius: "12px",
    border: "1px solid #FCA5A5", background: "#FEF2F2",
    color: "#DC2626", fontSize: "14px",
  },

  header: {
    display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px",
  },
  headerIcon: {
    width: "44px", height: "44px", borderRadius: "12px",
    background: "#171717", color: "#FFFFFF",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: "600", flexShrink: 0,
  },
  title: {
    fontSize: "24px", fontWeight: "700", color: "#171717",
    letterSpacing: "-0.03em", margin: "0 0 4px 0",
  },
  subtitle: { fontSize: "14px", color: "#737373", margin: 0, fontWeight: "400" },

  tableCard: {
    background: "#FFFFFF", border: "1px solid #E5E5E5",
    borderRadius: "16px", overflow: "hidden",
  },
  tableHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 24px", borderBottom: "1px solid #E5E5E5",
  },
  tableTitle: {
    fontSize: "16px", fontWeight: "600", color: "#171717",
    letterSpacing: "-0.02em", margin: 0,
  },
  tableBadge: {
    fontSize: "12px", fontWeight: "500", color: "#737373",
    background: "#F5F5F5", padding: "4px 10px",
    borderRadius: "9999px", border: "1px solid #EBEBEB",
  },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 24px", fontSize: "11px", fontWeight: "600",
    color: "#737373", textTransform: "uppercase", letterSpacing: "0.06em",
    textAlign: "left", borderBottom: "1px solid #F5F5F5", background: "#FAFAFA",
  },
  tr: { borderBottom: "1px solid #F5F5F5" },
  tdIndex: {
    padding: "14px 24px", fontSize: "12px",
    fontWeight: "500", color: "#A3A3A3", width: "48px",
  },
  td: { padding: "14px 24px", fontSize: "14px", color: "#171717" },
  tdMuted: { padding: "14px 24px", fontSize: "13px", color: "#737373" },
  nameRow: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: {
    width: "28px", height: "28px", borderRadius: "7px",
    background: "#171717", color: "#FFFFFF",
    fontSize: "12px", fontWeight: "600",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  nameText: { fontWeight: "500", letterSpacing: "-0.01em" },

  emptyState: {
    padding: "48px 24px", display: "flex",
    flexDirection: "column", alignItems: "center", textAlign: "center",
  },
  emptyIcon: {
    width: "48px", height: "48px", borderRadius: "12px",
    background: "#F5F5F5", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "20px", color: "#D4D4D4", marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "15px", fontWeight: "600", color: "#404040", marginBottom: "4px",
  },
  emptyDesc: { fontSize: "13px", color: "#A3A3A3" },
}

export default AdminClassDetail
