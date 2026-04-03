import { useNavigate } from "react-router-dom"

function Navbar(){

  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const panelTitle = role === "admin" ? "Admin Panel" : "Teacher Panel"
  const avatarLetter = role === "admin" ? "A" : "T"

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login")
  }

  return(
    <div style={styles.navbar}>
      <div style={styles.left}>
        <h3 style={styles.title}>{panelTitle}</h3>
        <span style={styles.badge}>Active</span>
      </div>

      <div style={styles.right}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>{avatarLetter}</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span style={styles.logoutIcon}>↗</span>
          Logout
        </button>
      </div>
    </div>
  )
}

const styles = {

  navbar: {
    height: "64px",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    borderBottom: "1px solid #E5E5E5",
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    backgroundColor: "rgba(255,255,255,0.85)",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  title: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#171717",
    letterSpacing: "-0.02em",
    margin: 0,
  },

  badge: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#525252",
    background: "#F5F5F5",
    padding: "3px 10px",
    borderRadius: "9999px",
    border: "1px solid #E5E5E5",
    letterSpacing: "0.01em",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#171717",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#FFFFFF",
  },

  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 16px",
    borderRadius: "8px",
    border: "1px solid #E5E5E5",
    background: "#FFFFFF",
    color: "#525252",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
    letterSpacing: "-0.01em",
  },

  logoutIcon: {
    fontSize: "12px",
  },

}

export default Navbar