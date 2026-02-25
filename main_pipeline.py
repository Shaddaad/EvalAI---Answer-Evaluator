from ocr.gemini_ocr import extract_text   # OCR using Gemini Vision
from evaluation.answer_evaluator import evaluate_answer

print("STEP 1 — Starting full pipeline")

# Question and model answer (teacher provides this)
question = "What is OCR?"

model_answer = """
OCR stands for Optical Character Recognition.
It converts handwritten or printed text from images into machine-readable text.
"""

max_marks = 5

# STEP 2 — Extract text from student's answer sheet
print("STEP 2 — Running OCR on answer sheet...")
student_answer = extract_text("test.png")

print("\nExtracted Answer:\n")
print(student_answer)

# STEP 3 — Evaluate answer
print("\nSTEP 3 — Evaluating answer...")
result = evaluate_answer(question, model_answer, student_answer, max_marks)

print("\n===== FINAL RESULT =====")
print(result)