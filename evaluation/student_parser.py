import re

def split_student_answers(text):
    """
    Splits student answer text into dictionary:
    {
        1: "answer...",
        2: "answer...",
    }
    Assumes answers are written like:
    1. answer...
    2. answer...
    """

    answers = {}

    pattern = r"(\d+)[\).\s]+(.*?)(?=\n\d+[\).\s]+|$)"
    matches = re.findall(pattern, text, re.DOTALL)

    for num, ans in matches:
        answers[int(num)] = ans.strip()

    return answers