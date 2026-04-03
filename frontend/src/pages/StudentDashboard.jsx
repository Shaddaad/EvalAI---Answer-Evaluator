import { useState, useEffect } from "react"
import api from "../services/api"

function StudentDashboard() {
  const [exams, setExams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedExam, setSelectedExam] = useState(null)
  const [activeModal, setActiveModal] = useState(null)

  useEffect(() => {
    loadMyResults()
  }, [])

  const loadMyResults = async () => {
    try {
      const response = await api.get('/student/my-results')
      setExams(response.data.exams || [])
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewResult = (exam) => {
    setSelectedExam(exam)
    setActiveModal('viewResult')
  }

  return (
    <div style={styles.page} className="stagger-children">
      
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Results</h1>
          <p style={styles.subtitle}>View your evaluated exam sheets and feedback.</p>
        </div>
      </div>

      {isLoading ? (
        <div style={styles.loading}>Loading your results...</div>
      ) : exams.length === 0 ? (
        <div style={styles.emptyState}>No supervised exams evaluated yet.</div>
      ) : (
        <div style={styles.grid}>
          {exams.map(exam => (
            <div key={exam._id} style={styles.card}>
               <div style={styles.cardTop}>
                 <span style={styles.classBadge}>{exam.subject || "General"}</span>
                 <span style={styles.dateText}>{exam.date}</span>
               </div>
               <h3 style={styles.examTitle}>{exam.exam_name}</h3>
               
               <div style={styles.scoreRow}>
                 <div>
                   <div style={styles.scoreLabel}>Total Score</div>
                   <div style={styles.scoreValue}>
                     {exam.my_result.total_score} <span style={{fontSize: '14px', color: '#A3A3A3'}}>/ {exam.my_result.total_max}</span>
                   </div>
                 </div>
                 <button onClick={() => handleViewResult(exam)} style={styles.viewBtn}>View Details →</button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Results View Modal */}
      {activeModal === 'viewResult' && selectedExam && (
        <div style={styles.overlay}>
          <div style={styles.modalFull}>
            
            <div style={styles.modalHeaderFixed}>
              <div>
                <h2 style={styles.modalTitle}>{selectedExam.exam_name}</h2>
                <div style={styles.modalSub}>Detailed Evaluation Report</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={styles.scorePill}>
                  <span style={styles.scoreNum}>{selectedExam.my_result.total_score}</span>
                  <span style={styles.scoreSlash}>/</span>
                  <span style={styles.scoreMax}>{selectedExam.my_result.total_max}</span>
                </div>
                <button onClick={() => setActiveModal(null)} style={styles.closeBtn}>✕ Close</button>
              </div>
            </div>

            <div style={styles.modalBodyScroll}>
              <div style={styles.questionsGrid}>
                {selectedExam.my_result.evaluation.results && selectedExam.my_result.evaluation.results.map((ev, j) => {
                  const pct = ev.max_marks > 0 ? (ev.marks_awarded / ev.max_marks) * 100 : 0
                  const barColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'
                  return (
                    <div key={j} style={styles.questionCard}>
                      <div style={styles.questionTop}>
                        <div style={styles.questionBadge}>Q{ev.question}</div>
                        <div style={styles.questionMarks}>
                          <span style={{fontWeight: '700', color: '#171717', fontSize: '16px'}}>{ev.marks_awarded}</span>
                          <span style={{color: '#A3A3A3', fontWeight: '500'}}>/{ev.max_marks}</span>
                        </div>
                      </div>
                      
                      <div style={styles.progressBarBg}>
                        <div style={{...styles.progressBarFill, width: `${pct}%`, background: barColor}}></div>
                      </div>

                      <div style={styles.qaBlock}>
                        <div style={styles.qaLabel}>Question:</div>
                        <div style={styles.qText}>{ev.question_text || `Question ${ev.question} not digitized`}</div>
                      </div>

                      <div style={styles.qaBlock}>
                        <div style={styles.qaLabel}>Your Answer:</div>
                        <div style={styles.aText}>{ev.student_answer || "No text extracted for your answer."}</div>
                      </div>

                      <div style={styles.feedbackBlock}>
                         <div style={styles.feedbackLabel}>Evaluation Feedback:</div>
                         <div style={styles.feedbackText}>{ev.feedback || 'No feedback provided'}</div>
                      </div>

                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

const styles = {
  page: { maxWidth: "1000px" },
  header: { marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
  title: { fontSize: "32px", fontWeight: "700", color: "#171717", letterSpacing: "-0.04em", margin: "0 0 8px 0", lineHeight: "1.15" },
  subtitle: { fontSize: "15px", color: "#737373", margin: 0, fontWeight: "400" },
  
  loading: { padding: "40px 0", color: "#737373", fontSize: "14px" },
  emptyState: { padding: "48px", background: "#FFFFFF", borderRadius: "14px", border: "1px dashed #E5E5E5", textAlign: "center", color: "#737373", fontSize: "14px" },
  
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" },
  card: { background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "14px", padding: "24px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  classBadge: { background: "#F5F5F5", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#525252" },
  dateText: { fontSize: "12px", color: "#A3A3A3", fontWeight: "500" },
  examTitle: { fontSize: "18px", fontWeight: "700", color: "#171717", margin: "0 0 24px 0", letterSpacing: "-0.02em" },
  
  scoreRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #F5F5F5", paddingTop: "20px" },
  scoreLabel: { fontSize: "12px", color: "#A3A3A3", textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: "4px" },
  scoreValue: { fontSize: "28px", fontWeight: "800", color: "#171717", lineHeight: "1" },
  viewBtn: { padding: "8px 16px", borderRadius: "8px", background: "#000000", color: "#FFFFFF", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer" },

  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "24px" },
  modalFull: { background: "#FFFFFF", width: "100%", maxWidth: "800px", height: "90vh", borderRadius: "20px", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 48px rgba(0,0,0,0.2)" },
  
  modalHeaderFixed: { padding: "24px 32px", borderBottom: "1px solid #E5E5E5", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFFFF", zIndex: 10 },
  modalTitle: { fontSize: "24px", fontWeight: "700", color: "#171717", margin: "0 0 6px 0", letterSpacing: "-0.03em" },
  modalSub: { fontSize: "14px", color: "#737373" },
  scorePill: { background: "#FAFAFA", padding: "8px 16px", borderRadius: "9999px", border: "1px solid #E5E5E5", display: "flex", alignItems: "baseline", gap: "2px" },
  scoreNum: { fontSize: "18px", fontWeight: "800", color: "#171717" },
  scoreSlash: { color: "#D4D4D4", margin: "0 4px" },
  scoreMax: { fontSize: "14px", fontWeight: "600", color: "#A3A3A3" },
  closeBtn: { background: "#F5F5F5", border: "none", width: "80px", height: "36px", borderRadius: "8px", color: "#404040", fontSize: "13px", fontWeight: "600", cursor: "pointer" },

  modalBodyScroll: { padding: "32px", overflowY: "auto", flex: 1, background: "#FAFAFA" },
  
  questionsGrid: { display: "flex", flexDirection: "column", gap: "16px" },
  questionCard: { padding: "24px", background: "#FFFFFF", border: "1px solid #EBEBEB", borderRadius: "14px" },
  questionTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  questionBadge: { padding: "4px 10px", background: "#F5F5F5", borderRadius: "6px", fontSize: "13px", fontWeight: "700", color: "#404040" },
  questionMarks: { display: "flex", alignItems: "baseline" },
  
  progressBarBg: { width: "100%", height: "6px", background: "#F5F5F5", borderRadius: "3px", overflow: "hidden", marginBottom: "20px" },
  progressBarFill: { height: "100%", borderRadius: "3px", transition: "width 0.5s ease" },

  qaBlock: { marginBottom: "20px" },
  qaLabel: { fontSize: "12px", fontWeight: "600", color: "#737373", textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: "8px" },
  qText: { fontSize: "15px", color: "#171717", lineHeight: "1.6", fontWeight: "500" },
  aText: { fontSize: "15px", color: "#404040", lineHeight: "1.6", background: "#FAFAFA", padding: "12px", borderRadius: "8px", border: "1px dashed #E5E5E5" },

  feedbackBlock: { background: "#F0F9FF", border: "1px solid #BAE6FD", padding: "16px", borderRadius: "10px" },
  feedbackLabel: { fontSize: "12px", fontWeight: "700", color: "#0369A1", textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: "6px" },
  feedbackText: { fontSize: "14px", color: "#0C4A6E", lineHeight: "1.5" }
}

export default StudentDashboard
