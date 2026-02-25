import os
from PIL import Image
from google import genai

print("STEP 1 — Gemini OCR starting")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_text(image_path):
    print("STEP 2 — Loading image")
    img = Image.open(image_path)

    print("STEP 3 — Sending to Gemini Vision")

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            "Extract all handwritten text from this image. "
            "Fix spelling mistakes. Arrange sentences in correct reading order. "
            "Return clean formatted text only.",
            img
        ]
    )

    print("STEP 4 — Response received")
    return response.text


if __name__ == "__main__":
    text = extract_text("test2.png")
    print("\n===== CLEANED TEXT =====\n")
    print(text)