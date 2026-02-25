from paddleocr import PaddleOCR
import os

# disable internet check (speeds startup)
os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"

print("Loading PaddleOCR model (first run takes time)...")

# ⚠️ remove show_log — not supported in your version
ocr = PaddleOCR(
    use_angle_cls=True,
    lang='en'
)

print("PaddleOCR loaded successfully")


def extract_text(image_path):
    print("Running OCR on:", image_path)

    # New PaddleOCR pipeline output format
    result = ocr.ocr(image_path)

    lines = []

    # result structure in new versions:
    # result[0]['rec_texts'] → list of text lines
    if result and len(result) > 0:
        lines = result[0]['rec_texts']

    final_text = "\n".join(lines)
    return final_text