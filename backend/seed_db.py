"""
Seed the database with demo users so the login page demo credentials work.
Run:  python seed_db.py
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask import Flask
from datetime import datetime, timezone

load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/risk_predictions')
client = MongoClient(MONGO_URI)
db = client.get_default_database()

DEMO_USERS = [
    {
        'name': 'Ravi Kumar',
        'email': 'ravi@company.com',
        'password': 'password123',
        'role': 'manager',
    },
    {
        'name': 'Priya Sharma',
        'email': 'priya@company.com',
        'password': 'password123',
        'role': 'employee',
    },
    {
        'name': 'Sabitha',
        'email': 'sabithabtech16@gmail.com',
        'password': 'password123',
        'role': 'manager',
    },
]


def seed_users():
    users_col = db['users']
    created = 0
    skipped = 0

    for u in DEMO_USERS:
        if users_col.find_one({'email': u['email']}):
            print(f"  ⏭  {u['email']} already exists — skipped")
            skipped += 1
            continue

        hashed = bcrypt.generate_password_hash(u['password']).decode('utf-8')
        doc = {
            'name': u['name'],
            'email': u['email'],
            'password_hash': hashed,
            'role': u['role'],
            'trust_score': 100.0,
            'avatar': None,
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc),
        }
        users_col.insert_one(doc)
        print(f"  ✅  Created {u['role']}: {u['email']}")
        created += 1

    print(f"\nDone! Created {created}, skipped {skipped}.")


if __name__ == '__main__':
    print("Seeding demo users...")
    seed_users()
