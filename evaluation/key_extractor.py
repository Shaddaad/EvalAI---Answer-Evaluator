import json
import os
from ocr.gemini_ocr import extract_text
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_answer_key(image_path, output_file="answer_key.json"):
    print("Extracting handwritten answer key...")

    # Step 1: OCR
    raw_text = extract_text(image_path)

    # Step 2: Ask Gemini to structure it
    prompt = f"""
    Convert the following answer key into structured JSON.
    Format strictly like this:

    {{
        "questions": [
            {{
                "question_number": int,
                "question": "...",
                "model_answer": "...",
                "max_marks": int
            }}
        ]
    }}

    Return ONLY valid JSON. No explanation.

    Answer key text:
    {raw_text}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    structured_text = response.text.strip()

    # Remove markdown formatting if present
    if structured_text.startswith("```"):
        structured_text = structured_text.strip("```json").strip("```")

    data = json.loads(structured_text)

    # Save to file
    with open(output_file, "w") as f:
        json.dump(data, f, indent=4)

    print("Answer key saved to", output_file)
    return data