import { useNavigate } from "react-router-dom"

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logoGroup}>
          <div style={styles.logoMark}>E</div>
          <span style={styles.logoText}>EvalAI</span>
        </div>
        <div style={styles.navLinks}>
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>Login / Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.badge}>Next-Gen Grading ⚡️</div>
          <h1 style={styles.heroTitle}>Automate handwritten <br/> exam evaluation</h1>
          <p style={styles.heroDesc}>
            EvalAI uses state-of-the-art vision models to read and grade your students' handwritten 
            answer sheets against your own rubrics—saving you hundreds of hours.
          </p>
          <div style={styles.heroActions}>
            <button onClick={() => navigate('/login')} style={styles.primaryBtn}>Try it Now</button>
          </div>
        </div>

        {/* Features Preview */}
        <div style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📸</div>
            <h3 style={styles.featureTitle}>Unmatched OCR</h3>
            <p style={styles.featureDesc}>Our vision engine perfectly captures distorted, low light, and messy handwriting from uploaded PDFs or Images.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🧠</div>
            <h3 style={styles.featureTitle}>Smart Grading</h3>
            <p style={styles.featureDesc}>Compare the answers exactly to your Answer Key logic to give partial or complete marks fairly across the class.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡️</div>
            <h3 style={styles.featureTitle}>Instant Feedback</h3>
            <p style={styles.featureDesc}>Provide your students with detailed, question-by-question reasoning for where they lost or gained marks.</p>
          </div>
        </div>
      </main>

    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000000",
    color: "#FFFFFF",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 48px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoMark: {
    background: "#FFFFFF",
    color: "#000000",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "16px",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.03em",
  },
  loginBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#FFFFFF",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 200ms ease",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "80px 24px",
    textAlign: "center",
  },
  hero: {
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "fadeInUp 0.8s ease-out forwards",
  },
  badge: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#D4D4D4",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "64px",
    fontWeight: "800",
    letterSpacing: "-0.04em",
    lineHeight: "1.05",
    margin: "0 0 24px 0",
    color: "#FFFFFF",
  },
  heroDesc: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#A3A3A3",
    maxWidth: "600px",
    margin: "0 0 40px 0",
  },
  heroActions: {
    display: "flex",
    gap: "16px",
  },
  primaryBtn: {
    background: "#FFFFFF",
    color: "#000000",
    border: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 200ms ease",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    width: "100%",
    maxWidth: "1000px",
    marginTop: "100px",
  },
  featureCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "32px",
    borderRadius: "16px",
    textAlign: "left",
  },
  featureIcon: {
    fontSize: "32px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0 0 12px 0",
  },
  featureDesc: {
    fontSize: "15px",
    color: "#A3A3A3",
    lineHeight: "1.6",
    margin: 0,
  }
}

export default Landing
