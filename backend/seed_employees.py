"""
Add demo employee users to the database.
Run:  python seed_employees.py
"""
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask import Flask
from dotenv import load_dotenv
from datetime import datetime, timezone
import os

load_dotenv()
app = Flask(__name__)
bcrypt = Bcrypt(app)

client = MongoClient(os.getenv('MONGO_URI'))
db = client.get_default_database()
col = db['users']

EMPLOYEES = [
    {'name': 'Anita Desai',    'email': 'anita@company.com'},
    {'name': 'Vikram Singh',   'email': 'vikram@company.com'},
    {'name': 'Meena Patel',    'email': 'meena@company.com'},
    {'name': 'Arjun Reddy',    'email': 'arjun@company.com'},
    {'name': 'Deepa Nair',     'email': 'deepa@company.com'},
]

created = 0
for u in EMPLOYEES:
    if col.find_one({'email': u['email']}):
        print(f"  Skip: {u['email']} already exists")
        continue
    hashed = bcrypt.generate_password_hash('password123').decode('utf-8')
    col.insert_one({
        'name': u['name'],
        'email': u['email'],
        'password_hash': hashed,
        'role': 'employee',
        'trust_score': 100.0,
        'avatar': None,
        'created_at': datetime.now(timezone.utc),
        'updated_at': datetime.now(timezone.utc),
    })
    print(f"  Created employee: {u['email']}")
    created += 1

print(f"\nDone! Created {created} employee accounts. Password: password123")
