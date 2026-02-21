"""
Reset a user's password.
Run:  python reset_password.py
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask import Flask

load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/risk_predictions')
client = MongoClient(MONGO_URI)
db = client.get_default_database()

EMAIL = 'sabithabtech16@gmail.com'
NEW_PASSWORD = 'password123'

users_col = db['users']
user = users_col.find_one({'email': EMAIL})

if not user:
    print(f"❌ User {EMAIL} not found!")
else:
    hashed = bcrypt.generate_password_hash(NEW_PASSWORD).decode('utf-8')
    users_col.update_one({'email': EMAIL}, {'$set': {'password_hash': hashed}})
    print(f"✅ Password for {EMAIL} has been reset to: {NEW_PASSWORD}")
