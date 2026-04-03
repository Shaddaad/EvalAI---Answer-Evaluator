function Roadmap() {
  const features = [
    {
      status: "In Progress",
      color: "#3b82f6",
      title: "Export to PDF & CSV",
      desc: "Download complete class evaluation reports directly to your computer."
    },
    {
      status: "Upcoming",
      color: "#f59e0b",
      title: "Plagiarism Detection",
      desc: "Cross-reference student answers to detect heavily duplicated structures across the roster."
    },
    {
      status: "Upcoming",
      color: "#f59e0b",
      title: "Custom AI Tuning",
      desc: "Allow teachers to toggle 'Strict Mode' or 'Lenient Mode' directly from the Evaluation UI."
    },
    {
      status: "Planned",
      color: "#8b5cf6",
      title: "Interactive Charts",
      desc: "A class performance curve visualization natively built right into the View Results dashboard."
    }
  ]

  return (
    <div style={styles.page} className="stagger-children">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Roadmap</h1>
          <p style={styles.subtitle}>A sneak peek at what's coming to EvalAI in the next versions.</p>
        </div>
      </div>

      <div style={styles.timeline}>
        {features.map((f, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <span style={{...styles.badge, color: f.color, background: `${f.color}15`}}>{f.status}</span>
            </div>
            <p style={styles.cardDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: "800px" },
  header: { marginBottom: "40px" },
  title: {
    fontSize: "32px", fontWeight: "700", color: "#171717",
    letterSpacing: "-0.04em", margin: "0 0 8px 0", lineHeight: "1.15",
  },
  subtitle: { fontSize: "15px", color: "#737373", margin: 0, fontWeight: "400" },
  
  timeline: {
    display: "flex", flexDirection: "column", gap: "16px",
    position: "relative",
    paddingLeft: "16px",
    borderLeft: "2px dashed #E5E5E5"
  },
  card: {
    background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px",
    padding: "24px", position: "relative"
  },
  cardHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px"
  },
  cardTitle: {
    fontSize: "16px", fontWeight: "700", color: "#171717", margin: 0
  },
  badge: {
    fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.02em"
  },
  cardDesc: {
    fontSize: "14px", color: "#525252", lineHeight: "1.6", margin: 0
  }
}

export default Roadmap
