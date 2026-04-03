import { useState, useEffect } from "react"
import api from "../services/api"

function AdminDashboard(){

  const [teacherCount, setTeacherCount] = useState(0)
  const [classCount, setClassCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)

  useEffect(() => {
    loadCounts()
  }, [])

  const loadCounts = async () => {
    try {
      const [t, c, s] = await Promise.all([
        api.get("/admin/teachers"),
        api.get("/admin/classes"),
        api.get("/admin/students"),
      ])
      setTeacherCount(t.data.teachers.length)
      setClassCount(c.data.classes.length)
      setStudentCount(s.data.students.length)
    } catch(e) {
      console.log("Error loading counts")
    }
  }

  const stats = [
    { label: "Teachers", value: teacherCount, icon: "⬡", desc: "Registered teachers", link: "/admin-teachers" },
    { label: "Classes", value: classCount, icon: "⬒", desc: "Active classes", link: "/admin-classes" },
    { label: "Students", value: studentCount, icon: "◉", desc: "Enrolled students", link: "/admin-students" },
  ]

  const actions = [
    { label: "Add Teacher", desc: "Register a new teacher with credentials", icon: "⬡", link: "/admin-teachers" },
    { label: "Create Class", desc: "Set up a new class and assign a teacher", icon: "⬒", link: "/admin-classes" },
    { label: "Add Student", desc: "Enroll a student into a class", icon: "◉", link: "/admin-students" },
  ]

  return(

    <div style={styles.page} className="stagger-children">

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage teachers, classes, and students across the platform.</p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat, i) => (
          <a key={i} href={stat.link} style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statDesc}>{stat.desc}</div>
          </a>
        ))}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionsGrid}>
          {actions.map((action, i) => (
            <a key={i} href={action.link} style={styles.actionCard}>
              <div style={styles.actionIcon}>{action.icon}</div>
              <div>
                <div style={styles.actionLabel}>{action.label}</div>
                <div style={styles.actionDesc}>{action.desc}</div>
              </div>
              <span style={styles.actionArrow}>→</span>
            </a>
          ))}
        </div>
      </div>

    </div>

  )

}

const styles = {

  page: { maxWidth: "960px" },

  header: { marginBottom: "32px" },

  title: {
    fontSize: "32px", fontWeight: "700", color: "#171717",
    letterSpacing: "-0.04em", margin: "0 0 8px 0", lineHeight: "1.15",
  },

  subtitle: {
    fontSize: "15px", color: "#737373", margin: 0, fontWeight: "400",
  },

  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px", marginBottom: "40px",
  },

  statCard: {
    background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "14px",
    padding: "24px", textDecoration: "none",
    transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
  },

  statTop: {
    display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px",
  },

  statIcon: { fontSize: "14px", color: "#A3A3A3" },

  statLabel: {
    fontSize: "12px", color: "#737373", fontWeight: "500",
    letterSpacing: "0.01em", textTransform: "uppercase",
  },

  statValue: {
    fontSize: "36px", fontWeight: "700", color: "#171717",
    letterSpacing: "-0.04em", lineHeight: "1", marginBottom: "8px",
  },

  statDesc: { fontSize: "12px", color: "#A3A3A3", fontWeight: "400" },

  section: { marginBottom: "40px" },

  sectionTitle: {
    fontSize: "16px", fontWeight: "600", color: "#171717",
    letterSpacing: "-0.02em", margin: "0 0 16px 0",
  },

  actionsGrid: { display: "flex", flexDirection: "column", gap: "10px" },

  actionCard: {
    background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "14px",
    padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px",
    textDecoration: "none", transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    cursor: "pointer",
  },

  actionIcon: {
    width: "40px", height: "40px", borderRadius: "10px", background: "#F5F5F5",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", color: "#404040", flexShrink: 0,
  },

  actionLabel: {
    fontSize: "14px", fontWeight: "600", color: "#171717",
    letterSpacing: "-0.01em", marginBottom: "2px",
  },

  actionDesc: { fontSize: "12px", color: "#A3A3A3", fontWeight: "400" },

  actionArrow: { fontSize: "16px", color: "#D4D4D4", marginLeft: "auto" },
}

export default AdminDashboard
