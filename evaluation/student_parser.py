import re


def split_answers_by_question(text):

    """
    Splits OCR extracted student answer text into question-wise answers.

    Expected format in answer sheet:
    1 ...
    2 ...
    3 ...
    """

    answers = {}

    # Split using Q1, Q2, Q3 pattern
    parts = re.split(r"(Q\d+)", text)

    current_q = None

    for part in parts:

        part = part.strip()

        if re.match(r"Q\d+", part):
            current_q = int(part[1:])
            answers[current_q] = ""

        elif current_q:
            answers[current_q] += part + " "

    return answers