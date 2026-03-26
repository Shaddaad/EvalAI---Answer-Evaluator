import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_text(image_path):

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    image_part = types.Part.from_bytes(
        data=image_bytes,
        mime_type="image/jpeg"
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text="Extract all handwritten and printed text from this exam answer sheet."
                    ),
                    image_part
                ]
            )
        ]
    )

    return response.text