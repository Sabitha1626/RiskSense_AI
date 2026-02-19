from datetime import datetime, timezone
from bson import ObjectId


class UserModel:
    def __init__(self, db):
        self.collection = db['users']
        # Indexes
        self.collection.create_index('email', unique=True)

    def create(self, name, email, password_hash, role='employee'):
        doc = {
            'name': name,
            'email': email,
            'password_hash': password_hash,
            'role': role,           # 'manager' | 'employee'
            'trust_score': 100.0,
            'avatar': None,
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc),
        }
        result = self.collection.insert_one(doc)
        doc['_id'] = str(result.inserted_id)
        return doc

    def find_by_email(self, email):
        return self.collection.find_one({'email': email})

    def find_by_id(self, user_id):
        try:
            return self.collection.find_one({'_id': ObjectId(user_id)})
        except Exception:
            return None

    def get_all(self):
        return list(self.collection.find({}, {'password_hash': 0}))

    def get_all_employees(self):
        return list(self.collection.find({'role': 'employee'}, {'password_hash': 0}))

    def update_trust_score(self, user_id, score):
        self.collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'trust_score': score, 'updated_at': datetime.now(timezone.utc)}}
        )

    @staticmethod
    def serialize(user):
        """Convert a MongoDB doc to a JSON-safe dict."""
        if user is None:
            return None
        user = dict(user)
        user['_id'] = str(user['_id'])
        user.pop('password_hash', None)
        if user.get('created_at'):
            user['created_at'] = str(user['created_at'])
        if user.get('updated_at'):
            user['updated_at'] = str(user['updated_at'])
        return user
