import os
import json
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def evaluate_answer(answer_key, student_text):

    prompt = f"""
You are a university exam evaluator.

Evaluate the student's answer paper using the answer key.

ANSWER KEY:
{json.dumps(answer_key, indent=2)}

STUDENT ANSWERS:
{student_text}

Rules:
- Give marks strictly according to max_marks
- If diagram required but not visible, give partial marks
- Be fair but strict

Return ONLY JSON:

{{
 "results":[
   {{
     "question":1,
     "marks_awarded":2,
     "max_marks":3,
     "feedback":"Good explanation but diagram incomplete"
   }}
 ]
}}
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    text = response.text.strip()

    if text.startswith("```"):
        text = text.strip("```json").strip("```")

    try:
        return json.loads(text)
    except:
        return {
            "results":[]
        }