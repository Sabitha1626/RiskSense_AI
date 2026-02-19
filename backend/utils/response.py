from datetime import datetime, timezone


def success_response(data=None, message="Success", status_code=200):
    """Standard success response wrapper."""
    return {
        "status": "success",
        "message": message,
        "data": data,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }, status_code


def error_response(message="An error occurred", status_code=400):
    """Standard error response wrapper."""
    return {
        "status": "error",
        "message": message,
        "data": None,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }, status_code
