import { useState, useEffect } from "react"
import api from "../services/api"

function Dashboard(){

  const [examStats, setExamStats] = useState({ total: 0, evaluated: 0, pending: 0 })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await api.get('/teacher/exams')
      const exams = res.data.exams || []
      
      const total = exams.length
      const evaluated = exams.filter(e => e.results && e.results.length > 0).length
      const pending = total - evaluated

      setExamStats({ total, evaluated, pending })
    } catch(e) {
      console.log(e)
    }
  }

  const stats = [
    { label: "Total Exams", value: examStats.total, icon: "◈", desc: "Exams created" },
    { label: "Evaluated", value: examStats.evaluated, icon: "◉", desc: "Completed evaluations" },
    { label: "Pending", value: examStats.pending, icon: "⬒", desc: "Awaiting grading" },
    { label: "Accuracy", value: "98%", icon: "▶", desc: "AI confidence score" },
  ]

  return(

    <div style={styles.page} className="stagger-children">

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome back. Here's an overview of your evaluation activity.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statDesc}>{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <a href="/create-exam" style={styles.actionCard}>
            <div style={styles.actionIcon}>＋</div>
            <div>
              <div style={styles.actionLabel}>Create Exam</div>
              <div style={styles.actionDesc}>Set up a new examination</div>
            </div>
            <span style={styles.actionArrow}>→</span>
          </a>
          <a href="/upload-key" style={styles.actionCard}>
            <div style={styles.actionIcon}>⬡</div>
            <div>
              <div style={styles.actionLabel}>Upload Answer Key</div>
              <div style={styles.actionDesc}>Upload model answer sheet</div>
            </div>
            <span style={styles.actionArrow}>→</span>
          </a>
          <a href="/upload-sheets" style={styles.actionCard}>
            <div style={styles.actionIcon}>⬒</div>
            <div>
              <div style={styles.actionLabel}>Upload Sheets</div>
              <div style={styles.actionDesc}>Upload student answer papers</div>
            </div>
            <span style={styles.actionArrow}>→</span>
          </a>
          <a href="/run-evaluation" style={styles.actionCard}>
            <div style={styles.actionIcon}>▶</div>
            <div>
              <div style={styles.actionLabel}>Run Evaluation</div>
              <div style={styles.actionDesc}>Start AI grading process</div>
            </div>
            <span style={styles.actionArrow}>→</span>
          </a>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Evaluation Pipeline</h3>
        <div style={styles.pipelineCard}>
          <div style={styles.pipelineSteps}>
            {["Upload Key", "Upload Sheets", "Run AI Evaluation", "View Results"].map((step, i) => (
              <div key={i} style={styles.pipelineStep}>
                <div style={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</div>
                <div style={styles.stepLabel}>{step}</div>
                {i < 3 && <div style={styles.stepConnector}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>

  )

}

const styles = {

  page: {
    maxWidth: "960px",
  },

  header: {
    marginBottom: "32px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#171717",
    letterSpacing: "-0.04em",
    margin: "0 0 8px 0",
    lineHeight: "1.15",
  },

  subtitle: {
    fontSize: "15px",
    color: "#737373",
    margin: 0,
    fontWeight: "400",
    letterSpacing: "-0.01em",
  },

  /* Stats */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "40px",
  },

  statCard: {
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "14px",
    padding: "24px",
    transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },

  statIcon: {
    fontSize: "14px",
    color: "#A3A3A3",
  },

  statLabel: {
    fontSize: "12px",
    color: "#737373",
    fontWeight: "500",
    letterSpacing: "0.01em",
    textTransform: "uppercase",
  },

  statValue: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#171717",
    letterSpacing: "-0.04em",
    lineHeight: "1",
    marginBottom: "8px",
  },

  statDesc: {
    fontSize: "12px",
    color: "#A3A3A3",
    fontWeight: "400",
  },

  /* Section */
  section: {
    marginBottom: "40px",
  },

  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#171717",
    letterSpacing: "-0.02em",
    margin: "0 0 16px 0",
  },

  /* Actions */
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },

  actionCard: {
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "14px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    textDecoration: "none",
    transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    cursor: "pointer",
  },

  actionIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#F5F5F5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#404040",
    flexShrink: 0,
  },

  actionLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#171717",
    letterSpacing: "-0.01em",
    marginBottom: "2px",
  },

  actionDesc: {
    fontSize: "12px",
    color: "#A3A3A3",
    fontWeight: "400",
  },

  actionArrow: {
    fontSize: "16px",
    color: "#D4D4D4",
    marginLeft: "auto",
  },

  /* Pipeline */
  pipelineCard: {
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "14px",
    padding: "32px",
  },

  pipelineSteps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pipelineStep: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },

  stepNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "#171717",
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontFamily: "'Inter', sans-serif",
  },

  stepLabel: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#404040",
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
  },

  stepConnector: {
    flex: 1,
    height: "1px",
    background: "#E5E5E5",
    margin: "0 16px",
    minWidth: "20px",
  },

}

export default Dashboard