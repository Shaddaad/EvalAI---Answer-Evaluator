import { useState, useEffect } from "react"
import api from "../services/api"

function Exams(){

  const [exams, setExams] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])

  // UI state
  const [activeModal, setActiveModal] = useState(null)
  const [selectedExam, setSelectedExam] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  
  // Create Form State
  const [examName,setExamName] = useState("")
  const [className,setClassName] = useState("")
  const [maxMarks,setMaxMarks] = useState("")
  const [date,setDate] = useState("")
  const [valuationType,setValuationType] = useState("moderate")
  const [subjectName, setSubjectName] = useState("")

  // Upload Key State
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // Upload Sheets State — per-student
  const [classStudents, setClassStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [uploadedStudents, setUploadedStudents] = useState([])

  // Eval State
  const [evaluationType,setEvaluationType] = useState("moderate")
  const [evalResult, setEvalResult] = useState(null)

  // View Results State — per-student pagination
  const [savedResults, setSavedResults] = useState([])
  const [hasLoadedResults, setHasLoadedResults] = useState(false)
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)

  // Edit Marks State
  const [editMode, setEditMode] = useState(false)
  const [editedMarks, setEditedMarks] = useState({})

  // Evaluation Loading State
  const [isEvaluating, setIsEvaluating] = useState(false)


  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [resExams, resClasses, resSubjects] = await Promise.all([
        api.get("/teacher/exams"),
        api.get("/teacher/classes"),
        api.get("/teacher/subjects")
      ])
      setExams(resExams.data.exams || [])
      setClasses(resClasses.data.classes || [])
      setSubjects(resSubjects.data.subjects || [])
    } catch(e) {
      console.log("Error loading exams data", e)
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post("/teacher/create-exam", {
        exam_name: examName,
        class: className,
        subject: subjectName,
        max_marks: parseInt(maxMarks),
        date: date,
        valuation_type: valuationType
      })
      setSuccessMsg("Exam created successfully")
      loadData()
      setTimeout(() => {
        setSuccessMsg("")
        setActiveModal(null)
      }, 1500)
    } catch(error) {
      alert("Error creating exam")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadKey = async () => {
    if (!file || !selectedExam) return
    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      await api.post(`/teacher/upload-answer-key/${selectedExam._id}`, formData)
      alert("Answer key uploaded and extracted successfully!")
      loadData()
      setActiveModal(null)
      setFile(null)
    } catch(error) {
      alert("Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Open upload sheets modal — load students for the exam's class
  const openUploadSheetsModal = async (exam) => {
    setSelectedExam(exam)
    setActiveModal('uploadSheets')
    setFile(null)
    setSelectedStudentId("")
    setClassStudents([])
    setUploadedStudents([])

    // Fetch students for class
    try {
      const res = await api.get(`/teacher/class-students/${encodeURIComponent(exam.class)}`)
      setClassStudents(res.data.students || [])
    } catch(e) {
      console.log("Error loading class students", e)
    }

    // Fetch already uploaded students
    try {
      const res = await api.get(`/teacher/exam-sheets/${exam._id}`)
      setUploadedStudents(res.data.uploaded_students || [])
    } catch(e) {
      console.log("Error loading uploaded sheets", e)
    }
  }

  const handleUploadSheets = async () => {
    if (!file || !selectedExam || !selectedStudentId) return
    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("student_id", selectedStudentId)

    try {
      await api.post(`/teacher/upload-answer-sheet/${selectedExam._id}`, formData)
      setFile(null)
      setSelectedStudentId("")

      // Refresh uploaded list
      const res = await api.get(`/teacher/exam-sheets/${selectedExam._id}`)
      setUploadedStudents(res.data.uploaded_students || [])
      setSuccessMsg("Sheet uploaded successfully!")
      setTimeout(() => setSuccessMsg(""), 2000)
    } catch(error) {
      alert("Upload failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRunEval = async () => {
    if (!selectedExam) return
    setIsEvaluating(true)
    setEvalResult(null)

    try {
      const response = await api.post(`/teacher/run-evaluation/${selectedExam._id}`, {
        evaluation_type: evaluationType
      })
      setEvalResult(response.data)
      setActiveModal('results')
    } catch(error) {
      alert("Evaluation failed")
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleViewResults = async (exam) => {
    setSelectedExam(exam)
    setActiveModal('viewResults')
    setHasLoadedResults(false)
    setCurrentStudentIndex(0)
    setEditMode(false)
    setEditedMarks({})
    setIsLoading(true)
    try {
      const response = await api.get(`/teacher/results/${exam._id}`)
      setSavedResults(response.data.results || [])
      setHasLoadedResults(true)
    } catch(error) {
      alert("Failed to load results")
      setActiveModal(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveMarks = async () => {
    if (!selectedExam || !currentResult) return
    setIsLoading(true)

    const updatedQuestions = currentResult.evaluation.results.map((q, idx) => {
      const markValue = editedMarks[idx] !== undefined ? editedMarks[idx] : q.marks_awarded;
      // Ensure we don't exceed max marks (though input handles it, this is safe)
      const numMark = Math.min(Math.max(Number(markValue), 0), q.max_marks)
      return { ...q, marks_awarded: numMark };
    });

    try {
      const response = await api.post(`/teacher/update-marks/${selectedExam._id}`, {
        student_id: currentResult.student_id,
        updated_questions: updatedQuestions
      })
      setSavedResults(response.data.results)
      setEditMode(false)
    } catch(error) {
      alert("Failed to update marks")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteExam = async (examId, examName) => {
    if (!confirm(`Are you sure you want to delete ${examName}? This action cannot be undone.`)) return
    
    try {
      await api.delete(`/teacher/exam/${examId}`)
      loadData()
    } catch (error) {
      alert("Failed to delete exam")
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  // Common UI configs
  const evalTypesList = [
    { value: "liberal", label: "Liberal", desc: "Lenient grading" },
    { value: "moderate", label: "Moderate", desc: "Balanced evaluation" },
    { value: "strict", label: "Strict", desc: "Rigorous assessment" },
  ]

  // Get current student result for paginated view
  const currentResult = savedResults.length > 0 ? savedResults[currentStudentIndex] : null


  return(
    <div style={styles.page} className="animate-fade-in-up">

      <div style={styles.header}>
        <div style={styles.headerTitle}>
           <div style={styles.headerIcon}>＋</div>
           <div>
             <h2 style={styles.title}>Exams Management</h2>
             <p style={styles.subtitle}>Create exams, map keys, and evaluate answers seamlessly</p>
           </div>
        </div>
        <button onClick={() => { setSuccessMsg(""); setActiveModal('create') }} style={styles.submitBtn}>
           + Create New Exam
        </button>
      </div>

      {/* Main Table View */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.tableTitle}>All Your Exams</h3>
          <span style={styles.tableBadge}>{exams.length} exam{exams.length !== 1 ? 's' : ''}</span>
        </div>

        {exams.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>—</div>
            <div style={styles.emptyTitle}>No exams yet</div>
            <div style={styles.emptyDesc}>Click the create button above to start your first exam setup.</div>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                   <th style={styles.th}>Exam Name</th>
                   <th style={styles.th}>Class & Subject</th>
                   <th style={styles.th}>Details</th>
                   <th style={styles.th}>Answer Key</th>
                   <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((ex) => (
                   <tr key={ex._id} style={styles.tr}>
                     <td style={styles.td}>
                       <div style={{fontWeight: '600', color: '#171717'}}>{ex.exam_name}</div>
                       <div style={{fontSize: '11px', color: '#737373', marginTop: '4px'}}>{ex.date}</div>
                     </td>
                     <td style={styles.tdMuted}>
                       <span style={styles.classBadge}>{ex.class}</span> <br/>
                       <span style={{fontSize: '12px', marginTop: '6px', display: 'inline-block'}}>{ex.subject || '—'}</span>
                     </td>
                     <td style={styles.tdMuted}>
                       Max: {ex.max_marks} marks<br/>
                       Type: {ex.valuation_type}
                     </td>
                     <td style={styles.td}>
                       {ex.answer_key ? (
                          <span style={styles.successBadge}>✓ Uploaded</span>
                       ) : (
                          <span style={styles.pendingBadge}>Pending</span>
                       )}
                     </td>
                     <td style={{...styles.td, textAlign: 'right'}}>
                       <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center'}}>
                          <button onClick={() => { setSelectedExam(ex); setActiveModal('upload'); setFile(null) }} style={styles.actionBtn}>
                            Upload Key
                          </button>
                          <button onClick={() => openUploadSheetsModal(ex)} style={styles.actionBtn}>
                            Upload Sheets
                          </button>
                          <button 
                             onClick={() => { setSelectedExam(ex); setActiveModal('evaluate'); setEvaluationType(ex.valuation_type || "moderate") }} 
                             style={styles.actionBtnPrimary}
                             disabled={!ex.answer_key}
                             title={!ex.answer_key ? "Upload an answer key first" : ""}
                          >
                            Run Evaluation
                          </button>
                          <button 
                             onClick={() => handleViewResults(ex)} 
                             style={styles.actionBtn}
                          >
                            View Results
                          </button>
                          <button 
                             onClick={() => handleDeleteExam(ex._id, ex.exam_name)} 
                             style={styles.actionBtnDanger}
                          >
                             ✕
                          </button>
                       </div>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {activeModal === 'create' && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
               <h3 style={styles.modalTitle}>Create New Exam</h3>
               <button onClick={() => setActiveModal(null)} style={styles.closeBtn}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              {successMsg && (
                <div style={styles.successBox}>
                  <span style={styles.successDot}></span><span style={styles.successText}>{successMsg}</span>
                </div>
              )}
              <form onSubmit={handleCreateSubmit} style={styles.form}>
                <div style={styles.fieldRow}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Exam Name</label>
                    <input placeholder="e.g. Finals" value={examName} onChange={e=>setExamName(e.target.value)} style={styles.input} required />
                  </div>
                </div>
                <div style={styles.fieldRow}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Class</label>
                    <select value={className} onChange={e=>setClassName(e.target.value)} style={styles.input} required>
                      <option value="">Select a class</option>
                      {classes.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Subject</label>
                    <select value={subjectName} onChange={e=>setSubjectName(e.target.value)} style={styles.input} required>
                      <option value="">Select a subject</option>
                      {subjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={styles.fieldRow}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Max Marks</label>
                    <input type="number" placeholder="100" value={maxMarks} onChange={e=>setMaxMarks(e.target.value)} style={styles.input} required />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Date</label>
                    <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={styles.input} required />
                  </div>
                </div>
                <div style={styles.fieldRow}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Valuation Type</label>
                    <select value={valuationType} onChange={e=>setValuationType(e.target.value)} style={styles.input} required>
                       {evalTypesList.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </select>
                  </div>
                </div>
                <div style={styles.actions}>
                  <button type="submit" style={styles.submitBtn} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Exam"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD KEY MODAL */}
      {activeModal === 'upload' && selectedExam && (
        <div style={styles.modalOverlay}>
           <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                 <h3 style={styles.modalTitle}>Upload Answer Key for {selectedExam.exam_name}</h3>
                 <button onClick={() => setActiveModal(null)} style={styles.closeBtn}>✕</button>
              </div>
              <div style={styles.modalBody}>
                <div
                  style={{...styles.dropZone, ...(dragActive ? styles.dropZoneActive : {}), ...(file ? styles.dropZoneHasFile : {})}}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                >
                  <div style={styles.dropIcon}>{file ? "✓" : "↑"}</div>
                  <div style={styles.dropTitle}>{file ? file.name : "Drop your file here"}</div>
                  <div style={styles.dropDesc}>{file ? `${(file.size / 1024).toFixed(1)} KB` : "or click to browse"}</div>
                  <input type="file" onChange={(e)=>setFile(e.target.files[0])} style={styles.fileInput} />
                </div>
                <div style={styles.actions}>
                  <button onClick={handleUploadKey} style={styles.submitBtn} disabled={isLoading || !file}>
                    {isLoading ? "Uploading..." : "Confirm Upload"}
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* UPLOAD SHEETS MODAL — Per-Student */}
      {activeModal === 'uploadSheets' && selectedExam && (
        <div style={styles.modalOverlay}>
           <div style={{...styles.modalContent, maxWidth: '600px'}}>
              <div style={styles.modalHeader}>
                 <h3 style={styles.modalTitle}>Upload Student Sheets — {selectedExam.exam_name}</h3>
                 <button onClick={() => setActiveModal(null)} style={styles.closeBtn}>✕</button>
              </div>
              <div style={styles.modalBody}>

                {successMsg && (
                  <div style={styles.successBox}>
                    <span style={styles.successDot}></span>
                    <span style={styles.successText}>{successMsg}</span>
                  </div>
                )}

                {/* Student selector */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Select Student</label>
                  <select 
                    value={selectedStudentId} 
                    onChange={e => setSelectedStudentId(e.target.value)} 
                    style={styles.input}
                  >
                    <option value="">Choose a student…</option>
                    {classStudents.map(s => {
                      const alreadyUploaded = uploadedStudents.some(u => u.student_id === s._id)
                      return (
                        <option key={s._id} value={s._id}>
                          {s.name} {alreadyUploaded ? '  ✓ (uploaded)' : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Drop zone */}
                <div style={{marginTop: '16px'}}>
                  <div
                    style={{...styles.dropZone, ...(dragActive ? styles.dropZoneActive : {}), ...(file ? styles.dropZoneHasFile : {})}}
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  >
                    <div style={styles.dropIcon}>{file ? "✓" : "↑"}</div>
                    <div style={styles.dropTitle}>{file ? file.name : "Drop student's PDF here"}</div>
                    <div style={styles.dropDesc}>{file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF answer sheet — or click to browse"}</div>
                    <input type="file" accept=".pdf" onChange={(e)=>setFile(e.target.files[0])} style={styles.fileInput} />
                  </div>
                </div>

                <div style={styles.actions}>
                  <button 
                    onClick={handleUploadSheets} 
                    style={styles.submitBtn} 
                    disabled={isLoading || !file || !selectedStudentId}
                  >
                    {isLoading ? "Uploading..." : "Upload Sheet"}
                  </button>
                </div>

                {/* Already uploaded students list */}
                {uploadedStudents.length > 0 && (
                  <div style={styles.uploadedSection}>
                    <div style={styles.uploadedTitle}>Uploaded Sheets</div>
                    <div style={styles.uploadedList}>
                      {uploadedStudents.map((u, i) => (
                        <div key={i} style={styles.uploadedItem}>
                          <div style={styles.uploadedAvatar}>
                            {u.student_name ? u.student_name.charAt(0).toUpperCase() : "?"}
                          </div>
                          <div style={{flex: 1}}>
                            <div style={styles.uploadedName}>{u.student_name}</div>
                            <div style={styles.uploadedMeta}>{u.page_count} page{u.page_count !== 1 ? 's' : ''}</div>
                          </div>
                          <span style={styles.uploadedCheck}>✓</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{...styles.infoCard, marginTop: '16px'}}>
                  <span style={styles.infoIcon}>i</span>
                  <div>
                    <div style={styles.infoTitle}>Per-Student Upload</div>
                    <div style={styles.infoDesc}>Select a student, upload their PDF. Repeat for each student. Re-uploading replaces the previous sheet.</div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* RUN EVALUATION MODAL */}
      {activeModal === 'evaluate' && selectedExam && (
        <div style={styles.modalOverlay}>
           <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                 <h3 style={styles.modalTitle}>Evaluate: {selectedExam.exam_name}</h3>
                 <button onClick={() => setActiveModal(null)} style={styles.closeBtn}>✕</button>
              </div>
              <div style={styles.modalBody}>
                <label style={styles.label}>Select Evaluation Mode</label>
                <div style={styles.typeGrid}>
                  {evalTypesList.map((type) => (
                    <div key={type.value} onClick={() => setEvaluationType(type.value)}
                         style={{...styles.typeCard, ...(evaluationType === type.value ? styles.typeCardActive : {})}}>
                      <div style={styles.typeRadio}>
                        {evaluationType === type.value && <div style={styles.typeRadioDot}></div>}
                      </div>
                      <div>
                         <div style={{...styles.typeLabel, ...(evaluationType === type.value ? styles.typeLabelActive : {})}}>{type.label}</div>
                         <div style={styles.typeDesc}>{type.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.actions}>
                  <button onClick={handleRunEval} style={styles.submitBtn} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Run Evaluation Engine"}
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* PROCESSING EVALUATION OVERLAY */}
      {isEvaluating && (
        <div style={styles.evalOverlay}>
          <div style={styles.evalBox}>
            <div style={styles.evalSpinner}></div>
            <h3 style={styles.evalTitle}>Evaluating Answer Sheets</h3>
            <p style={styles.evalSubtitle}>
              The AI is currently processing handwriting, cross-referencing keys, and generating feedback. 
              <br/>Please wait, this may take a few minutes depending on the class size...
            </p>
            <div style={styles.evalProgressWrapper}>
               <div style={styles.evalProgressBar}></div>
            </div>
            <div style={styles.evalStatus}>Running AI inference engine...</div>
          </div>
        </div>
      )}

      {/* RESULTS DISPLAY — after running eval */}
      {activeModal === 'results' && evalResult && (
        <div style={styles.modalOverlay}>
           <div style={{...styles.modalContent, maxWidth: '860px', width: '92%'}}>
              <div style={styles.modalHeader}>
                 <h3 style={styles.modalTitle}>Evaluation Complete — {evalResult.students_evaluated} student{evalResult.students_evaluated !== 1 ? 's' : ''}</h3>
                 <button onClick={() => { setActiveModal(null); setEvalResult(null) }} style={styles.closeBtn}>✕</button>
              </div>
              <div style={{...styles.modalBody, maxHeight: '600px', overflow: 'auto'}}>
                 <div style={styles.resultGrid}>
                    {evalResult.results && evalResult.results.map((r, i) => (
                      <div key={i} style={styles.resultSummaryCard}>
                        <div style={styles.resultSummaryLeft}>
                          <div style={styles.resultAvatar}>{r.student_name ? r.student_name.charAt(0).toUpperCase() : '?'}</div>
                          <div>
                            <div style={styles.resultStudentName}>{r.student_name || 'Unknown'}</div>
                            <div style={styles.resultMeta}>{r.page_count || 0} pages evaluated</div>
                          </div>
                        </div>
                        <div style={styles.resultScoreBadge}>
                          {r.error ? <span style={{color: '#ef4444'}}>Error</span> : r.score}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* VIEW SAVED RESULTS — Per-Student Paginated */}
      {activeModal === 'viewResults' && selectedExam && (
        <div style={styles.modalOverlay}>
           <div style={{...styles.modalContent, maxWidth: '920px', width: '94%'}}>
              <div style={styles.modalHeader}>
                 <h3 style={styles.modalTitle}>Results: {selectedExam.exam_name}</h3>
                 <button onClick={() => { setActiveModal(null); setSavedResults([]) }} style={styles.closeBtn}>✕</button>
              </div>
              <div style={{...styles.modalBody, padding: 0, maxHeight: '650px', overflow: 'hidden'}}>
                 {isLoading && !hasLoadedResults ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>Loading scores...</div>
                 ) : savedResults.length === 0 ? (
                    <div style={{...styles.emptyState, padding: '48px'}}>
                      <div style={styles.emptyIcon}>—</div>
                      <div style={styles.emptyTitle}>No results found</div>
                      <div style={styles.emptyDesc}>No evaluation data is available for this exam yet.</div>
                    </div>
                 ) : (
                    <div style={styles.resultsLayout}>

                      {/* Sidebar — Student List */}
                      <div style={styles.resultsSidebar}>
                        <div style={styles.sidebarTitle}>Students</div>
                        {savedResults.map((r, i) => (
                          <div 
                            key={i} 
                            onClick={() => { setCurrentStudentIndex(i); setEditMode(false); setEditedMarks({}); }}
                            style={{
                              ...styles.sidebarItem,
                              ...(currentStudentIndex === i ? styles.sidebarItemActive : {})
                            }}
                          >
                            <div style={{
                              ...styles.sidebarAvatar,
                              ...(currentStudentIndex === i ? styles.sidebarAvatarActive : {})
                            }}>
                              {r.student_name ? r.student_name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div style={{flex: 1, minWidth: 0}}>
                              <div style={styles.sidebarName}>{r.student_name || 'Unknown'}</div>
                              <div style={styles.sidebarScore}>
                                {r.error ? 'Error' : r.score}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Main content — Current student's detailed results */}
                      <div style={styles.resultsMain}>
                        {currentResult && (
                          <>
                            {/* Student header */}
                            <div style={styles.studentHeader}>
                              <div style={styles.studentHeaderLeft}>
                                <div style={styles.studentHeaderAvatar}>
                                  {currentResult.student_name ? currentResult.student_name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                  <div style={styles.studentHeaderName}>{currentResult.student_name}</div>
                                  <div style={styles.studentHeaderMeta}>
                                    {currentResult.page_count || 0} pages • Student {currentStudentIndex + 1} of {savedResults.length}
                                  </div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {!currentResult.error && (
                                  <button 
                                    onClick={editMode ? handleSaveMarks : () => setEditMode(true)}
                                    style={editMode ? styles.activeEditBtn : styles.editBtn}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? "Saving..." : (editMode ? "Save Marks" : "Edit Marks")}
                                  </button>
                                )}
                                <div style={styles.scorePill}>
                                  {currentResult.error ? (
                                    <span style={{color: '#ef4444'}}>Error</span>
                                  ) : (
                                    <>
                                      <span style={styles.scoreNum}>{currentResult.total_score ?? '—'}</span>
                                      <span style={styles.scoreSlash}>/</span>
                                      <span style={styles.scoreMax}>{currentResult.total_max ?? '—'}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Navigation */}
                            <div style={styles.navRow}>
                              <button 
                                onClick={() => { setCurrentStudentIndex(Math.max(0, currentStudentIndex - 1)); setEditMode(false); setEditedMarks({}); }}
                                disabled={currentStudentIndex === 0}
                                style={{...styles.navBtn, opacity: currentStudentIndex === 0 ? 0.4 : 1}}
                              >
                                ← Previous
                              </button>
                              <button 
                                onClick={() => { setCurrentStudentIndex(Math.min(savedResults.length - 1, currentStudentIndex + 1)); setEditMode(false); setEditedMarks({}); }}
                                disabled={currentStudentIndex === savedResults.length - 1}
                                style={{...styles.navBtn, opacity: currentStudentIndex === savedResults.length - 1 ? 0.4 : 1}}
                              >
                                Next →
                              </button>
                            </div>

                            {/* Error display */}
                            {currentResult.error && (
                              <div style={styles.errorCard}>
                                <strong>Evaluation Error:</strong> {currentResult.error}
                              </div>
                            )}

                            {/* Question-by-question results */}
                            {currentResult.evaluation && currentResult.evaluation.results && (
                              <div style={styles.questionsGrid}>
                                {currentResult.evaluation.results.map((ev, j) => {
                                  const currentMark = editedMarks[j] !== undefined ? editedMarks[j] : ev.marks_awarded;
                                  const pct = ev.max_marks > 0 ? (currentMark / ev.max_marks) * 100 : 0
                                  const barColor = pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'
                                  return (
                                    <div key={j} style={styles.questionCard}>
                                      <div style={styles.questionTop}>
                                        <div style={styles.questionBadge}>Q{ev.question}</div>
                                        <div style={styles.questionMarks}>
                                          {editMode ? (
                                            <input
                                              type="number"
                                              min="0"
                                              max={ev.max_marks}
                                              value={currentMark}
                                              onChange={(e) => setEditedMarks({ ...editedMarks, [j]: e.target.value })}
                                              style={styles.editMarkInput}
                                            />
                                          ) : (
                                            <span style={{fontWeight: '700', color: '#171717', fontSize: '16px'}}>{ev.marks_awarded}</span>
                                          )}
                                          <span style={{color: '#A3A3A3', fontWeight: '500'}}>/{ev.max_marks}</span>
                                        </div>
                                      </div>

                                      {/* Question Text */}
                                      {ev.question_text && (
                                        <div style={styles.questionTextSection}>
                                          <div style={styles.sectionLabel}>Question</div>
                                          <div style={styles.questionTextContent}>{ev.question_text}</div>
                                        </div>
                                      )}

                                      {/* Student's Answer */}
                                      <div style={styles.studentAnswerSection}>
                                        <div style={styles.sectionLabel}>Student's Answer</div>
                                        <div style={styles.studentAnswerContent}>{ev.student_answer || 'No answer detected'}</div>
                                      </div>

                                      {/* Marks bar */}
                                      <div style={styles.progressBar}>
                                        <div style={{...styles.progressFill, width: `${pct}%`, background: barColor}}></div>
                                      </div>

                                      {/* Reason / Feedback */}
                                      <div style={styles.feedbackSection}>
                                        <div style={styles.sectionLabel}>Reason for Marks</div>
                                        <div style={styles.feedbackText}>{ev.feedback || 'No feedback provided'}</div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  )
}

const styles = {
  page: { maxWidth: "1000px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" },
  headerTitle: { display: "flex", alignItems: "center", gap: "16px" },
  headerIcon: { width: "44px", height: "44px", borderRadius: "12px", background: "#171717", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "600", flexShrink: 0 },
  title: { fontSize: "24px", fontWeight: "700", color: "#171717", letterSpacing: "-0.03em", margin: "0 0 4px 0" },
  subtitle: { fontSize: "14px", color: "#737373", margin: 0, fontWeight: "400" },

  tableCard: { background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", overflow: "hidden" },
  tableHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #E5E5E5" },
  tableTitle: { fontSize: "16px", fontWeight: "600", color: "#171717", letterSpacing: "-0.02em", margin: 0 },
  tableBadge: { fontSize: "12px", fontWeight: "500", color: "#737373", background: "#F5F5F5", padding: "4px 10px", borderRadius: "9999px", border: "1px solid #EBEBEB" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 24px", fontSize: "11px", fontWeight: "600", color: "#737373", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid #F5F5F5", background: "#FAFAFA" },
  tr: { borderBottom: "1px solid #F5F5F5", transition: "background 150ms ease" },
  td: { padding: "16px 24px", fontSize: "14px", color: "#171717", verticalAlign: "middle" },
  tdMuted: { padding: "16px 24px", fontSize: "13px", color: "#737373" },
  classBadge: { fontSize: "12px", fontWeight: "600", color: "#171717", background: "#F5F5F5", padding: "4px 10px", borderRadius: "6px" },
  successBadge: { fontSize: "12px", fontWeight: "600", color: "#166534", background: "#dcfce7", padding: "4px 10px", borderRadius: "6px" },
  pendingBadge: { fontSize: "12px", fontWeight: "600", color: "#9ca3af", background: "#f3f4f6", padding: "4px 10px", borderRadius: "6px" },

  actionBtn: { padding: "6px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", color: "#171717", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  actionBtnPrimary: { padding: "7px 14px", borderRadius: "8px", border: "none", background: "#171717", color: "#FFFFFF", fontSize: "12px", fontWeight: "600", cursor: "pointer", opacity: 1 },
  actionBtnDanger: { padding: "6px 10px", borderRadius: "8px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#ef4444", fontSize: "12px", fontWeight: "600", cursor: "pointer" },

  emptyState: { padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  emptyIcon: { width: "48px", height: "48px", borderRadius: "12px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#D4D4D4", marginBottom: "16px" },
  emptyTitle: { fontSize: "15px", fontWeight: "600", color: "#404040", marginBottom: "4px" },
  emptyDesc: { fontSize: "13px", color: "#A3A3A3" },

  /* MODALS */
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" },
  modalContent: { background: "#FFFFFF", width: "500px", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", overflow: "hidden", animation: "fade-in-up 200ms ease" },
  modalHeader: { padding: "20px 24px", borderBottom: "1px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { margin: 0, fontSize: "16px", fontWeight: "600", color: "#171717" },
  closeBtn: { background: "transparent", border: "none", fontSize: "18px", color: "#737373", cursor: "pointer" },
  modalBody: { padding: "24px" },

  successBox: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", marginBottom: "16px" },
  successDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 },
  successText: { fontSize: "13px", color: "#166534", fontWeight: "500" },

  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldRow: { display: "flex", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  label: { fontSize: "13px", fontWeight: "500", color: "#404040", letterSpacing: "-0.01em" },
  input: { padding: "11px 14px", borderRadius: "10px", border: "1px solid #E5E5E5", background: "#FAFAFA", fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "#171717", width: "100%", boxSizing: "border-box" },

  actions: { display: "flex", justifyContent: "flex-end", paddingTop: "12px" },
  submitBtn: { padding: "11px 24px", borderRadius: "10px", border: "none", background: "#000000", color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer" },

  /* DRAG N DROP */
  dropZone: { border: "2px dashed #E5E5E5", borderRadius: "14px", padding: "40px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", background: "#FAFAFA" },
  dropZoneActive: { borderColor: "#171717", background: "#F5F5F5" },
  dropZoneHasFile: { borderColor: "#171717", borderStyle: "solid" },
  dropIcon: { width: "44px", height: "44px", borderRadius: "12px", background: "#171717", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "12px" },
  dropTitle: { fontSize: "14px", fontWeight: "600", color: "#171717", marginBottom: "4px" },
  dropDesc: { fontSize: "12px", color: "#A3A3A3" },
  fileInput: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" },

  /* EVAL TYPES GRID */
  typeGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginBottom: "20px", marginTop: "8px" },
  typeCard: { padding: "14px 16px", borderRadius: "12px", border: "1px solid #E5E5E5", background: "#FAFAFA", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "10px" },
  typeCardActive: { borderColor: "#171717", background: "#FFFFFF", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  typeRadio: { width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #D4D4D4", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" },
  typeRadioDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#171717" },
  typeLabel: { fontSize: "14px", fontWeight: "600", color: "#525252", marginBottom: "2px" },
  typeLabelActive: { color: "#171717" },
  typeDesc: { fontSize: "12px", color: "#A3A3A3" },

  infoCard: { display: "flex", gap: "12px", padding: "14px 16px", background: "#FAFAFA", border: "1px solid #EBEBEB", borderRadius: "10px", marginTop: "16px" },
  infoIcon: { width: "20px", height: "20px", borderRadius: "50%", background: "#E5E5E5", color: "#525252", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontStyle: "italic" },
  infoTitle: { fontSize: "13px", fontWeight: "600", color: "#404040", marginBottom: "2px" },
  infoDesc: { fontSize: "12px", color: "#737373", lineHeight: "1.5" },

  /* UPLOADED STUDENTS LIST */
  uploadedSection: { marginTop: "20px", borderTop: "1px solid #E5E5E5", paddingTop: "16px" },
  uploadedTitle: { fontSize: "13px", fontWeight: "600", color: "#404040", marginBottom: "10px", letterSpacing: "-0.01em" },
  uploadedList: { display: "flex", flexDirection: "column", gap: "8px" },
  uploadedItem: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "#F9FAFB", border: "1px solid #E5E5E5", borderRadius: "10px" },
  uploadedAvatar: { width: "32px", height: "32px", borderRadius: "8px", background: "#171717", color: "#FFFFFF", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  uploadedName: { fontSize: "13px", fontWeight: "600", color: "#171717" },
  uploadedMeta: { fontSize: "11px", color: "#737373", marginTop: "1px" },
  uploadedCheck: { fontSize: "14px", color: "#22c55e", fontWeight: "700" },

  /* RESULTS DISPLAY */
  resultGrid: { display: "flex", flexDirection: "column", gap: "10px" },
  resultSummaryCard: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "#FAFAFA", border: "1px solid #EBEBEB", borderRadius: "12px" },
  resultSummaryLeft: { display: "flex", alignItems: "center", gap: "12px" },
  resultAvatar: { width: "36px", height: "36px", borderRadius: "9px", background: "#171717", color: "#FFFFFF", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  resultStudentName: { fontSize: "14px", fontWeight: "600", color: "#171717" },
  resultMeta: { fontSize: "12px", color: "#737373", marginTop: "2px" },
  resultScoreBadge: { fontSize: "16px", fontWeight: "700", color: "#171717", background: "#FFFFFF", padding: "6px 14px", borderRadius: "8px", border: "1px solid #E5E5E5" },

  /* VIEW RESULTS — Paginated Layout */
  resultsLayout: { display: "flex", height: "600px" },
  
  resultsSidebar: { width: "220px", borderRight: "1px solid #E5E5E5", padding: "16px 0", overflowY: "auto", background: "#FAFAFA", flexShrink: 0 },
  sidebarTitle: { fontSize: "11px", fontWeight: "600", color: "#737373", textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 16px", marginBottom: "10px" },
  sidebarItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", cursor: "pointer", transition: "all 150ms ease", borderLeft: "3px solid transparent" },
  sidebarItemActive: { background: "#FFFFFF", borderLeftColor: "#171717" },
  sidebarAvatar: { width: "28px", height: "28px", borderRadius: "7px", background: "#E5E5E5", color: "#525252", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sidebarAvatarActive: { background: "#171717", color: "#FFFFFF" },
  sidebarName: { fontSize: "13px", fontWeight: "600", color: "#171717", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  sidebarScore: { fontSize: "11px", color: "#737373", marginTop: "1px" },

  resultsMain: { flex: 1, padding: "24px", overflowY: "auto" },

  studentHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" },
  studentHeaderLeft: { display: "flex", alignItems: "center", gap: "14px" },
  studentHeaderAvatar: { width: "44px", height: "44px", borderRadius: "12px", background: "#171717", color: "#FFFFFF", fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  studentHeaderName: { fontSize: "20px", fontWeight: "700", color: "#171717", letterSpacing: "-0.02em" },
  studentHeaderMeta: { fontSize: "13px", color: "#737373", marginTop: "2px" },

  scorePill: { display: "flex", alignItems: "baseline", gap: "2px", background: "#F5F5F5", padding: "10px 18px", borderRadius: "12px", border: "1px solid #E5E5E5" },
  scoreNum: { fontSize: "24px", fontWeight: "800", color: "#171717", letterSpacing: "-0.02em" },
  scoreSlash: { fontSize: "16px", fontWeight: "500", color: "#A3A3A3", margin: "0 2px" },
  scoreMax: { fontSize: "16px", fontWeight: "600", color: "#737373" },

  navRow: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  navBtn: { padding: "7px 16px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", color: "#404040", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif" },

  errorCard: { padding: "14px 18px", borderRadius: "10px", border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", fontSize: "13px", marginBottom: "16px" },
  
  editBtn: { padding: "8px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", color: "#171717", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 150ms ease" },
  activeEditBtn: { padding: "8px 14px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 150ms ease", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.25)" },
  editMarkInput: { width: "44px", padding: "4px 8px", fontSize: "15px", fontWeight: "700", textAlign: "center", border: "2px solid #3b82f6", borderRadius: "6px", color: "#171717", outline: "none" },

  questionsGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  questionCard: { padding: "18px", background: "#FAFAFA", border: "1px solid #EBEBEB", borderRadius: "14px" },
  questionTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" },
  questionBadge: { fontSize: "13px", fontWeight: "700", color: "#FFFFFF", background: "#171717", padding: "4px 12px", borderRadius: "6px" },
  questionMarks: { display: "flex", alignItems: "baseline", gap: "2px" },

  progressBar: { height: "6px", background: "#E5E5E5", borderRadius: "3px", overflow: "hidden", marginBottom: "14px", marginTop: "14px" },
  progressFill: { height: "100%", borderRadius: "3px", transition: "width 500ms ease" },

  sectionLabel: { fontSize: "11px", fontWeight: "600", color: "#737373", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" },
  
  questionTextSection: { marginBottom: "10px", padding: "12px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" },
  questionTextContent: { fontSize: "13px", color: "#334155", lineHeight: "1.6", fontWeight: "500" },

  studentAnswerSection: { marginBottom: "10px", padding: "12px 14px", background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "8px" },
  studentAnswerContent: { fontSize: "13px", color: "#525252", lineHeight: "1.6" },

  feedbackSection: { marginTop: "10px" },
  feedbackText: { fontSize: "13px", color: "#404040", lineHeight: "1.6" },

  evalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" },
  evalBox: { background: "#FFFFFF", padding: "48px 40px", borderRadius: "24px", maxWidth: "500px", width: "90%", textAlign: "center", boxShadow: "0 24px 48px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center" },
  evalSpinner: { width: "48px", height: "48px", borderRadius: "50%", border: "4px solid #E5E5E5", borderTopColor: "#000000", animation: "spin 1s linear infinite", marginBottom: "32px" },
  evalTitle: { fontSize: "24px", fontWeight: "700", color: "#171717", margin: "0 0 12px 0", letterSpacing: "-0.03em" },
  evalSubtitle: { fontSize: "14px", color: "#737373", lineHeight: "1.6", margin: "0 0 32px 0" },
  evalProgressWrapper: { width: "100%", height: "8px", background: "#F5F5F5", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" },
  evalProgressBar: { height: "100%", width: "100%", background: "linear-gradient(90deg, #171717, #525252, #171717)", backgroundSize: "200% 100%", borderRadius: "4px", animation: "shimmer 2s infinite linear" },
  evalStatus: { fontSize: "12px", fontWeight: "600", color: "#A3A3A3", letterSpacing: "0.02em", textTransform: "uppercase" },
}

export default Exams
