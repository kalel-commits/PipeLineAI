import requests
import json
import time

API_URL = "http://127.0.0.1:8000/api/v1/gitlab/webhook"

payload = {
    "object_kind": "merge_request",
    "event_type": "merge_request",
    "object_attributes": {
        "iid": 42,
        "target_project_id": 101,
        "source_branch": "feature/anti-gravity-core",
        "last_commit": {
            "id": "abc123def456",
            "message": "fix: resolve anti-gravity calculation error in late night session",
            "timestamp": "2026-03-21T23:45:00Z"
        }
    }
}

headers = {
    "Content-Type": "application/json",
    "X-Gitlab-Event": "Merge Request Hook"
}

print(f"Sending mock MR event to {API_URL}...")
response = requests.post(API_URL, headers=headers, json=payload)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 200:
    print("\nSUCCESS: Webhook accepted. Processing in background...")
else:
    print("\nFAILED: Webhook rejected.")
