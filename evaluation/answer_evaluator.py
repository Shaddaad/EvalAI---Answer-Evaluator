import os
import json
import re
import google.genai as genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def evaluate_answer(question, model_answer, student_answer, max_marks):
    prompt = f"""
You are an exam evaluator.

Question:
{question}

Model Answer:
{model_answer}

Student Answer:
{student_answer}

Give marks out of {max_marks}.
Return STRICT JSON: 
{{
 "marks": number,
 "reason": "short explanation"
}}
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    text = response.text.strip()
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text).strip()

    return json.loads(text)