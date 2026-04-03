import { useState } from "react"
import api from "../services/api"

function EvaluationDetails({question}){

  const [marks,setMarks] = useState(question.marks)
  const [isLoading, setIsLoading] = useState(false)
  const [updated, setUpdated] = useState(false)

  const updateMarks = async () => {

    setIsLoading(true)
    setUpdated(false)

    await api.post(
      "/teacher/update-mark",
      {
        exam_id: question.exam_id,
        student_id: question.student_id,
        question_number: question.question,
        new_marks: marks
      }
    )

    setUpdated(true)
    setIsLoading(false)

  }

  return(

    <div style={styles.card}>

      <div style={styles.cardHeader}>
        <div style={styles.qBadge}>Q{question.question}</div>
        <div style={styles.marksBadge}>{marks} marks</div>
      </div>

      <div style={styles.answerBlock}>
        <div style={styles.answerSection}>
          <span style={styles.answerLabel}>Student Answer</span>
          <p style={styles.answerText}>
            {question.student_answer}
          </p>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.answerSection}>
          <span style={styles.answerLabel}>Model Answer</span>
          <p style={styles.answerText}>
            {question.model_answer}
          </p>
        </div>
      </div>

      <div style={styles.updateRow}>
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel} htmlFor={`eval-marks-${question.question}`}>Marks</label>
          <input
            id={`eval-marks-${question.question}`}
            value={marks}
            onChange={(e)=>setMarks(e.target.value)}
            style={styles.marksInput}
            type="number"
          />
        </div>
        <button onClick={updateMarks} style={styles.updateBtn} disabled={isLoading}>
          {isLoading ? "Saving..." : updated ? "✓ Saved" : "Update"}
        </button>
      </div>

    </div>

  )

}

const styles = {

  card: {
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "12px",
    transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },

  qBadge: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#FFFFFF",
    background: "#171717",
    padding: "4px 12px",
    borderRadius: "6px",
    letterSpacing: "-0.01em",
    fontFamily: "'Inter', sans-serif",
  },

  marksBadge: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#525252",
    background: "#F5F5F5",
    padding: "4px 10px",
    borderRadius: "9999px",
    border: "1px solid #E5E5E5",
  },

  answerBlock: {
    background: "#FAFAFA",
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "16px",
  },

  answerSection: {
    padding: "8px 0",
  },

  answerLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#737373",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    display: "block",
    marginBottom: "6px",
  },

  answerText: {
    fontSize: "14px",
    color: "#171717",
    lineHeight: "1.6",
    margin: 0,
    fontWeight: "400",
  },

  divider: {
    height: "1px",
    background: "#EBEBEB",
    margin: "8px 0",
  },

  updateRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  inputLabel: {
    fontSize: "11px",
    fontWeight: "500",
    color: "#737373",
  },

  marksInput: {
    width: "80px",
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #E5E5E5",
    background: "#FFFFFF",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    color: "#171717",
    outline: "none",
    fontWeight: "600",
    textAlign: "center",
  },

  updateBtn: {
    padding: "9px 20px",
    borderRadius: "8px",
    border: "1px solid #E5E5E5",
    background: "#FFFFFF",
    color: "#171717",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
  },

}

export default EvaluationDetails