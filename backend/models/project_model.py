from datetime import datetime, timezone
from bson import ObjectId


class ProjectModel:
    def __init__(self, db):
        self.collection = db['projects']

    def create(self, data, manager_id):
        doc = {
            'name': data['name'],
            'description': data.get('description', ''),
            'status': data.get('status', 'planning'),
            'start_date': data.get('start_date', datetime.now(timezone.utc).isoformat()),
            'deadline': data['deadline'],
            'progress': 0,
            'risk_score': 0,
            'manager_id': manager_id,
            'team_members': data.get('team_members', []),
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc),
        }
        result = self.collection.insert_one(doc)
        doc['_id'] = str(result.inserted_id)
        return doc

    def get_all(self):
        return list(self.collection.find())

    def get_by_manager(self, manager_id):
        return list(self.collection.find({'manager_id': manager_id}))

    def get_by_member(self, user_id):
        return list(self.collection.find({'team_members': user_id}))

    def find_by_id(self, project_id):
        try:
            return self.collection.find_one({'_id': ObjectId(project_id)})
        except Exception:
            return None

    def update(self, project_id, updates):
        updates['updated_at'] = datetime.now(timezone.utc)
        self.collection.update_one({'_id': ObjectId(project_id)}, {'$set': updates})
        return self.find_by_id(project_id)

    def update_risk_score(self, project_id, risk_score, status=None):
        updates = {'risk_score': risk_score, 'updated_at': datetime.now(timezone.utc)}
        if status:
            updates['status'] = status
        self.collection.update_one({'_id': ObjectId(project_id)}, {'$set': updates})

    def delete(self, project_id):
        return self.collection.delete_one({'_id': ObjectId(project_id)})

    def get_in_progress(self):
        return list(self.collection.find({'status': {'$in': ['in_progress', 'at_risk']}}))

    @staticmethod
    def serialize(project):
        if project is None:
            return None
        p = dict(project)
        p['_id'] = str(p['_id'])
        for key in ('created_at', 'updated_at', 'start_date', 'deadline'):
            if p.get(key) and not isinstance(p[key], str):
                p[key] = str(p[key])
        return p
