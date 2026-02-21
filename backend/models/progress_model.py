from datetime import datetime, timezone, date
from bson import ObjectId


class ProgressModel:
    def __init__(self, db):
        self.collection = db['daily_progress']
        self.collection.create_index([('task_id', 1), ('employee_id', 1), ('date', 1)])

    def submit(self, data, employee_id, is_anomaly=False):
        today_str = date.today().isoformat()
        doc = {
            'task_id': data['task_id'],
            'employee_id': employee_id,
            'project_id': data.get('project_id', ''),
            'date': today_str,
            'hours_worked': float(data.get('hours_worked', 0)),
            'completion_percent': float(data.get('completion_percent', 0)),
            'issues_faced': data.get('issues_faced', ''),
            'status': data.get('status', 'In Progress'),
            'blocker_desc': data.get('blocker_desc', ''),
            'notes': data.get('notes', ''),
            'proof_file': data.get('proof_file'),
            'anomaly_flag': is_anomaly,
            'submitted_at': datetime.now(timezone.utc),
        }
        # Upsert: one report per (task, employee, date)
        result = self.collection.update_one(
            {'task_id': data['task_id'], 'employee_id': employee_id, 'date': today_str},
            {'$set': doc},
            upsert=True
        )
        if result.upserted_id:
            doc['_id'] = result.upserted_id
        else:
            existing = self.collection.find_one(
                {'task_id': data['task_id'], 'employee_id': employee_id, 'date': today_str},
                {'_id': 1}
            )
            if existing:
                doc['_id'] = existing['_id']
        return doc

    def get_today(self, task_id, employee_id):
        today_str = date.today().isoformat()
        return self.collection.find_one(
            {'task_id': task_id, 'employee_id': employee_id, 'date': today_str}
        )

    def get_all_today_for_employee(self, employee_id):
        today_str = date.today().isoformat()
        return list(self.collection.find({'employee_id': employee_id, 'date': today_str}))

    def get_history_by_task(self, task_id):
        return list(self.collection.find({'task_id': task_id}).sort('date', 1))

    def get_history_by_employee(self, employee_id, days=30):
        return list(self.collection.find({'employee_id': employee_id}).sort('date', -1).limit(days))

    def get_all_by_task(self, task_id):
        return list(self.collection.find({'task_id': task_id}).sort('date', 1))

    @staticmethod
    def serialize(doc):
        if doc is None:
            return None
        d = dict(doc)
        d['_id'] = str(d['_id'])
        if d.get('submitted_at') and not isinstance(d['submitted_at'], str):
            d['submitted_at'] = str(d['submitted_at'])
        return d
