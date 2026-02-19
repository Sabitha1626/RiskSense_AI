from datetime import datetime, timezone
from bson import ObjectId


class AlertModel:
    def __init__(self, db):
        self.collection = db['alerts']
        self.collection.create_index('timestamp')

    def create(self, alert_type, severity, title, message,
               project_id=None, task_id=None, employee_id=None, report_id=None):
        doc = {
            'type': alert_type,       # deadline_risk|fraud_detection|productivity|milestone
            'severity': severity,     # critical|warning|info|success
            'title': title,
            'message': message,
            'project_id': project_id,
            'task_id': task_id,
            'employee_id': employee_id,
            'report_id': report_id,
            'read': False,
            'timestamp': datetime.now(timezone.utc),
        }
        result = self.collection.insert_one(doc)
        doc['_id'] = str(result.inserted_id)
        return doc

    def get_all(self, severity=None, alert_type=None, unread_only=False):
        query = {}
        if severity:
            query['severity'] = severity
        if alert_type:
            query['type'] = alert_type
        if unread_only:
            query['read'] = False
        return list(self.collection.find(query).sort('timestamp', -1))

    def get_unread_count(self):
        return self.collection.count_documents({'read': False})

    def mark_as_read(self, alert_id):
        self.collection.update_one(
            {'_id': ObjectId(alert_id)},
            {'$set': {'read': True}}
        )

    def mark_all_as_read(self):
        self.collection.update_many({}, {'$set': {'read': True}})

    @staticmethod
    def serialize(alert):
        if alert is None:
            return None
        a = dict(alert)
        a['_id'] = str(a['_id'])
        if a.get('timestamp') and not isinstance(a['timestamp'], str):
            a['timestamp'] = str(a['timestamp'])
        return a
