import { NavLink, useLocation } from "react-router-dom"

function Sidebar(){

  const location = useLocation()
  const role = localStorage.getItem("role")

  const adminItems = [
    { path: "/admin-dashboard", label: "Dashboard", icon: "◈" },
    { path: "/admin-teachers", label: "Teachers", icon: "⬡" },
    { path: "/admin-classes", label: "Classes", icon: "⬒" },
    { path: "/admin-students", label: "Students", icon: "◉" },
  ]

  const teacherItems = [
    { path: "/dashboard", label: "Dashboard", icon: "◈" },
    { path: "/exams", label: "Exams", icon: "＋" },
    { path: "/support", label: "Support", icon: "✉️" },
    { path: "/roadmap", label: "Roadmap", icon: "✨" },
  ]

  const studentItems = [
    { path: "/student-dashboard", label: "My Results", icon: "◉" },
  ]

  const navItems = role === "admin" ? adminItems : role === "student" ? studentItems : teacherItems
  const panelLabel = role === "admin" ? "Admin Panel" : role === "student" ? "Student Panel" : "Teacher Panel"

  return(

    <div style={styles.sidebar}>

      <div style={styles.logoSection}>
        <div style={styles.logoMark}>
          <span style={styles.logoIcon}>E</span>
        </div>
        <div>
          <h2 style={styles.logoText}>EvalAI</h2>
          <span style={styles.logoSub}>{panelLabel}</span>
        </div>
      </div>

      <div style={styles.divider}></div>

      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              style={{
                ...styles.link,
                ...(isActive ? styles.linkActive : {})
              }}
              to={item.path}
            >
              <span style={{
                ...styles.linkIcon,
                ...(isActive ? styles.linkIconActive : {})
              }}>{item.icon}</span>
              <span style={styles.linkLabel}>{item.label}</span>
              {isActive && <div style={styles.activeIndicator}></div>}
            </NavLink>
          )
        })}
      </nav>

      <div style={styles.bottomSection}>
        <div style={styles.divider}></div>
        <div style={styles.versionBadge}>
          <span style={styles.versionDot}></span>
          <span style={styles.versionText}>v1.0 — Production</span>
        </div>
      </div>

    </div>

  )

}

const styles = {

  sidebar:{
    width: "260px",
    height: "100vh",
    background: "#000000",
    color: "white",
    padding: "0",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 100,
    borderRight: "1px solid rgba(255,255,255,0.06)",
  },

  logoSection: {
    padding: "28px 24px 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  logoMark: {
    width: "36px",
    height: "36px",
    background: "#FFFFFF",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logoIcon: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#000000",
    letterSpacing: "-0.04em",
  },

  logoText: {
    fontSize: "17px",
    fontWeight: "700",
    letterSpacing: "-0.03em",
    margin: 0,
    color: "#FFFFFF",
    lineHeight: "1.2",
  },

  logoSub: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
    fontWeight: "400",
    letterSpacing: "0.02em",
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "4px 20px 12px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "4px 12px",
    flex: 1,
  },

  link: {
    color: "rgba(255,255,255,0.5)",
    textDecoration: "none",
    fontSize: "13.5px",
    fontWeight: "450",
    padding: "10px 12px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
    position: "relative",
    letterSpacing: "-0.01em",
  },

  linkActive: {
    color: "#FFFFFF",
    background: "rgba(255,255,255,0.08)",
    fontWeight: "550",
  },

  linkIcon: {
    fontSize: "14px",
    width: "20px",
    textAlign: "center",
    opacity: 0.5,
  },

  linkIconActive: {
    opacity: 1,
  },

  linkLabel: {
    flex: 1,
  },

  activeIndicator: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#FFFFFF",
  },

  bottomSection: {
    padding: "12px 0 20px",
  },

  versionBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 24px",
  },

  versionDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.3)",
  },

  versionText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.25)",
    fontWeight: "400",
    letterSpacing: "0.01em",
  }

}

export default Sidebar