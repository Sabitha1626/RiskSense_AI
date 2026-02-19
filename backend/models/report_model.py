from datetime import datetime, timezone
from bson import ObjectId


class ReportModel:
    def __init__(self, db):
        self.collection = db['reports']
        self.collection.create_index('project_id')

    def create(self, project_id, generated_by, pdf_path, summary_data):
        doc = {
            'project_id': project_id,
            'generated_by': generated_by,
            'pdf_path': pdf_path,
            'summary_data': summary_data,
            'created_at': datetime.now(timezone.utc),
        }
        result = self.collection.insert_one(doc)
        doc['_id'] = str(result.inserted_id)
        return doc

    def get_all(self):
        return list(self.collection.find().sort('created_at', -1))

    def get_by_project(self, project_id):
        return list(self.collection.find({'project_id': project_id}).sort('created_at', -1))

    def find_by_id(self, report_id):
        try:
            return self.collection.find_one({'_id': ObjectId(report_id)})
        except Exception:
            return None

    @staticmethod
    def serialize(report):
        if report is None:
            return None
        r = dict(report)
        r['_id'] = str(r['_id'])
        if r.get('created_at') and not isinstance(r['created_at'], str):
            r['created_at'] = str(r['created_at'])
        return r
