import json
import google.genai as genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def split_answers_by_question(full_text):
    """
    Ask Gemini to split the OCR text into answers per question.
    """

    prompt = f"""
The following text is a student's full answer sheet.

Split the answers per question.

Return JSON in this format:
{{
 "Q1": "answer text",
 "Q2": "answer text"
}}

Answer sheet:
{full_text}
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    text = response.text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


def load_questions():
    with open("question_bank.json") as f:
        return json.load(f)["questions"]