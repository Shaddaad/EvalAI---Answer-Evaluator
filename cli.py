import sys
from ocr.gemini_ocr import extract_text
from nlp.text_cleaner import clean_text
from evaluation.paper_evaluator import split_answers_by_question, load_questions
from evaluation.answer_evaluator import evaluate_answer


def generate_report(results):
    total = 0
    max_total = 0

    report = "\n===== AI EVALUATION REPORT =====\n\n"

    for r in results:
        report += f"{r['id']} - {r['question']}\n"
        report += f"Marks: {r['marks']} / {r['max_marks']}\n"
        report += f"Reason: {r['reason']}\n\n"

        total += r["marks"]
        max_total += r["max_marks"]

    report += f"FINAL SCORE: {total} / {max_total}\n"

    with open("result.txt", "w") as f:
        f.write(report)

    print(report)


def run_pipeline(image_path):
    print("\nSTEP 1 — OCR")
    raw_text = extract_text(image_path)

    print("STEP 2 — Cleaning")
    cleaned_text = clean_text(raw_text)

    print("STEP 3 — Splitting Answers")
    answers = split_answers_by_question(cleaned_text)

    print("STEP 4 — Loading Questions")
    questions = load_questions()

    print("STEP 5 — Evaluating All Answers")
    results = []

    for q in questions:
        qid = q["id"]
        student_answer = answers.get(qid, "")

        result = evaluate_answer(
            q["question"],
            q["model_answer"],
            student_answer,
            q["max_marks"]
        )

        results.append({
            "id": qid,
            "question": q["question"],
            "marks": result["marks"],
            "max_marks": q["max_marks"],
            "reason": result["reason"]
        })

    generate_report(results)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python cli.py <answer_sheet_image>")
        sys.exit(1)

    run_pipeline(sys.argv[1])