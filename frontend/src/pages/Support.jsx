function Support() {
  return (
    <div style={styles.page} className="stagger-children">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Support & Contact</h1>
          <p style={styles.subtitle}>Need help navigating the AI grader? We're here for you.</p>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.icon}>✉️</div>
          <h3 style={styles.cardTitle}>Email Support</h3>
          <p style={styles.cardDesc}>Reach out to our technical team directly for API key issues or bug reports.</p>
          <a href="mailto:support@evalai.com" style={styles.link}>support@evalai.com</a>
        </div>
        
        <div style={styles.card}>
          <div style={styles.icon}>📚</div>
          <h3 style={styles.cardTitle}>Documentation</h3>
          <p style={styles.cardDesc}>Learn how to perfectly format your Answer Keys and scan Student Papers.</p>
          <a href="#" style={styles.link}>View Docs →</a>
        </div>
      </div>

      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqList}>
          <div style={styles.faqItem}>
            <div style={styles.question}>Why did the AI give partial marks when it was wrong?</div>
            <div style={styles.answer}>The evaluation model assesses methodology and logic. If the student's core idea matched parts of your rubric, it rewards partial points. You can always override this in the Results view.</div>
          </div>
          <div style={styles.faqItem}>
            <div style={styles.question}>My "Run Evaluation" failed with an API Key error.</div>
            <div style={styles.answer}>The system relies on Google's Gemini Vision API. If your trial key expires, you will need the administrator to inject a new one directly into the backend server environment.</div>
          </div>
        </div>
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
  
  grid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "48px"
  },
  card: {
    background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "14px",
    padding: "32px", display: "flex", flexDirection: "column", alignItems: "flex-start"
  },
  icon: { fontSize: "32px", marginBottom: "16px" },
  cardTitle: { fontSize: "18px", fontWeight: "700", color: "#171717", margin: "0 0 8px 0" },
  cardDesc: { fontSize: "14px", color: "#737373", lineHeight: "1.6", margin: "0 0 16px 0" },
  link: { color: "#171717", fontWeight: "600", textDecoration: "none", fontSize: "14px", borderBottom: "1px solid #171717" },

  faqSection: { marginTop: "24px" },
  faqTitle: { fontSize: "20px", fontWeight: "700", color: "#171717", margin: "0 0 24px 0", letterSpacing: "-0.02em" },
  faqList: { display: "flex", flexDirection: "column", gap: "16px" },
  faqItem: { background: "#FFFFFF", padding: "20px 24px", borderRadius: "12px", border: "1px solid #E5E5E5" },
  question: { fontSize: "15px", fontWeight: "600", color: "#171717", marginBottom: "8px" },
  answer: { fontSize: "14px", color: "#525252", lineHeight: "1.6" },
}

export default Support
