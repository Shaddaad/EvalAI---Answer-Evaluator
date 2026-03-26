from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["eval_ai"]

users = db["users"]
classes = db["classes"]
exams = db["exams"]
submissions = db["submissions"]