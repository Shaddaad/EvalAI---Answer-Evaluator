import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {

    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {

      const response = await axios.post(
        "http://localhost:5050/login",
        {
          email: email,
          password: password
        }
      )

      console.log(response.data)

      // save token and role
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("role", response.data.role)

      // redirect based on role
      if (response.data.role === "admin") {
        navigate("/admin-dashboard")
      } else if (response.data.role === "student") {
        navigate("/student-dashboard")
      } else {
        navigate("/dashboard")
      }

    }
    catch(error) {

      setError("Invalid credentials. Please try again.")

    }
    finally {
      setIsLoading(false)
    }

  }

  return (

    <div style={styles.wrapper}>

      {/* Left Panel — Branding */}
      <div style={styles.brandPanel}>
        <div style={styles.brandContent}>
          <div style={styles.brandLogo}>
            <div style={styles.brandMark}>
              <span style={styles.brandIcon}>E</span>
            </div>
          </div>
          <h1 style={styles.brandTitle}>EvalAI</h1>
          <p style={styles.brandTagline}>
            Intelligent answer evaluation
            <br />powered by artificial intelligence.
          </p>
          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <span style={styles.featureDot}></span>
              <span style={styles.featureText}>OCR-based text extraction</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureDot}></span>
              <span style={styles.featureText}>AI-powered answer grading</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.featureDot}></span>
              <span style={styles.featureText}>Detailed evaluation reports</span>
            </div>
          </div>
        </div>
        <div style={styles.brandFooter}>
          <span style={styles.brandCopy}>© 2026 EvalAI — All rights reserved</span>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={styles.formPanel}>
        <div style={styles.formContainer}>

          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign in</h2>
            <p style={styles.formSubtitle}>Enter your credentials to access the platform</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>!</span>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="text"
                placeholder="name@example.com"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.submitBtn} disabled={isLoading}>
              {isLoading ? (
                <span style={styles.spinner}></span>
              ) : (
                "Sign in"
              )}
            </button>

          </form>

          <div style={styles.formDivider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>Secure authentication</span>
            <div style={styles.dividerLine}></div>
          </div>

        </div>
      </div>

    </div>

  )

}

const styles = {

  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#FFFFFF",
  },

  /* Brand Panel */
  brandPanel: {
    width: "45%",
    background: "#000000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "48px",
    position: "relative",
    overflow: "hidden",
  },

  brandContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "420px",
  },

  brandLogo: {
    marginBottom: "40px",
  },

  brandMark: {
    width: "48px",
    height: "48px",
    background: "#FFFFFF",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  brandIcon: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#000000",
    letterSpacing: "-0.04em",
  },

  brandTitle: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: "-0.05em",
    lineHeight: "1.1",
    margin: "0 0 20px 0",
  },

  brandTagline: {
    fontSize: "17px",
    color: "rgba(255,255,255,0.5)",
    lineHeight: "1.6",
    fontWeight: "400",
    margin: "0 0 48px 0",
    letterSpacing: "-0.01em",
  },

  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  featureDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.3)",
    flexShrink: 0,
  },

  featureText: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.45)",
    fontWeight: "400",
    letterSpacing: "-0.01em",
  },

  brandFooter: {
    paddingTop: "32px",
  },

  brandCopy: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.2)",
    fontWeight: "400",
  },

  /* Form Panel */
  formPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    background: "#FAFAFA",
  },

  formContainer: {
    width: "100%",
    maxWidth: "380px",
  },

  formHeader: {
    marginBottom: "32px",
  },

  formTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#171717",
    letterSpacing: "-0.04em",
    margin: "0 0 8px 0",
  },

  formSubtitle: {
    fontSize: "14px",
    color: "#737373",
    margin: 0,
    fontWeight: "400",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "#FEF2F2",
    border: "1px solid #FEE2E2",
    borderRadius: "10px",
    marginBottom: "24px",
  },

  errorIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#171717",
    color: "#FFFFFF",
    fontSize: "11px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  errorText: {
    fontSize: "13px",
    color: "#171717",
    fontWeight: "450",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#404040",
    letterSpacing: "-0.01em",
  },

  input: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid #E5E5E5",
    background: "#FFFFFF",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    color: "#171717",
    outline: "none",
    transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
    letterSpacing: "-0.01em",
  },

  submitBtn: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    background: "#000000",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
    letterSpacing: "-0.01em",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "44px",
  },

  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#FFFFFF",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },

  formDivider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "32px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#E5E5E5",
  },

  dividerText: {
    fontSize: "11px",
    color: "#A3A3A3",
    fontWeight: "400",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },

}

export default Login