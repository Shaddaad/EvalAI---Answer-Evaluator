def clean_text(text: str) -> str:
    """
    Basic cleanup for OCR output.
    We keep this lightweight because Gemini already returns cleaned text.
    """
    if not text:
        return ""

    # remove extra spaces and weird line breaks
    text = text.replace("\n", " ")
    text = " ".join(text.split())

    return text.strip()