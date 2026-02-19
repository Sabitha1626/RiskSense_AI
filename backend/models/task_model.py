from datetime import datetime, timezone
from bson import ObjectId


class TaskModel:
    def __init__(self, db):
        self.collection = db['tasks']
        self.collection.create_index('project_id')
        self.collection.create_index('assignee_id')

    def create(self, data):
        doc = {
            'title': data['title'],
            'project_id': data['project_id'],
            'assignee_id': data.get('assignee_id'),
            'status': data.get('status', 'pending'),   # pending|in_progress|completed
            'priority': data.get('priority', 'medium'), # low|medium|high|critical
            'progress': data.get('progress', 0),
            'deadline': data['deadline'],
            'estimated_hours': data.get('estimated_hours', 0),
            'description': data.get('description', ''),
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc),
        }
        result = self.collection.insert_one(doc)
        doc['_id'] = str(result.inserted_id)
        return doc

    def get_by_project(self, project_id):
        return list(self.collection.find({'project_id': project_id}))

    def get_by_assignee(self, assignee_id):
        return list(self.collection.find({'assignee_id': assignee_id}))

    def find_by_id(self, task_id):
        try:
            return self.collection.find_one({'_id': ObjectId(task_id)})
        except Exception:
            return None

    def update(self, task_id, updates):
        updates['updated_at'] = datetime.now(timezone.utc)
        self.collection.update_one({'_id': ObjectId(task_id)}, {'$set': updates})
        return self.find_by_id(task_id)

    def delete(self, task_id):
        return self.collection.delete_one({'_id': ObjectId(task_id)})

    def delete_by_project(self, project_id):
        return self.collection.delete_many({'project_id': project_id})

    @staticmethod
    def serialize(task):
        if task is None:
            return None
        t = dict(task)
        t['_id'] = str(t['_id'])
        for key in ('created_at', 'updated_at', 'deadline'):
            if t.get(key) and not isinstance(t[key], str):
                t[key] = str(t[key])
        return t
