import sys
import os
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from evaluation.key_extractor import extract_answer_key
from evaluation.student_parser import split_student_answers
from evaluation.answer_evaluator import evaluate_answer
from ocr.gemini_ocr import extract_text


# ---------------------------
# KEY CREATION MODE
# ---------------------------
def run_key_extraction(key_image):
    extract_answer_key(key_image)


# ---------------------------
# EVALUATION MODE
# ---------------------------
def run_evaluation(student_image):
    # Step 1: OCR student paper
    student_text = extract_text(student_image)

    # Step 2: Split student answers by question number
    student_answers = split_student_answers(student_text)

    # Step 3: Load generated answer key JSON
    if not os.path.exists("answer_key.json"):
        print("No answer_key.json found. Please create key first.")
        return

    with open("answer_key.json", "r") as f:
        key_data = json.load(f)

    questions = key_data["questions"]

    total_score = 0
    total_max = 0

    print("\n===== AI EVALUATION REPORT =====\n")

    for q in questions:
        qnum = q["question_number"]

        student_answer = student_answers.get(qnum, "No answer provided.")

        result = evaluate_answer(
            q["question"],
            q["model_answer"],
            student_answer,
            q["max_marks"]
        )

        print(f"Q{qnum} - {q['question']}")
        print(f"Student Answer: {student_answer}")
        print(f"Marks: {result['marks']} / {q['max_marks']}")
        print(f"Reason: {result['reason']}\n")

        total_score += result["marks"]
        total_max += q["max_marks"]

    print(f"FINAL SCORE: {total_score} / {total_max}")


# ---------------------------
# ENTRY POINT
# ---------------------------
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage:")
        print("Create key: python cli.py key <key_image>")
        print("Evaluate:   python cli.py eval <student_image>")
        sys.exit()

    mode = sys.argv[1]
    image_path = sys.argv[2]

    if mode == "key":
        run_key_extraction(image_path)
    elif mode == "eval":
        run_evaluation(image_path)
    else:
        print("Invalid mode. Use 'key' or 'eval'.")