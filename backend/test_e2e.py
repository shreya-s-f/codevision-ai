import urllib.request
import json

def run_tests():
    # 1. Register test
    user_data = {
        "email": "e2e_student@codevision.ai",
        "full_name": "E2E Student",
        "password": "strongPassword123",
        "role": "Security Engineer"
    }
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/auth/register",
        data=json.dumps(user_data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    try:
        res = urllib.request.urlopen(req)
        reg_result = json.loads(res.read().decode())
        print("[PASS] Registration successful! Token length:", len(reg_result["access_token"]))
    except urllib.error.HTTPError as e:
        print("[INFO] User might already exist:", e.code)

    # 2. Login test
    login_data = {"email": "e2e_student@codevision.ai", "password": "strongPassword123"}
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/auth/login",
        data=json.dumps(login_data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    log_result = json.loads(res.read().decode())
    token = log_result["access_token"]
    print("[PASS] Login successful! User:", log_result["user"]["full_name"])

    # 3. Analyze code test
    code_test = """
def authenticate_user(req):
    uid = req.params["id"]
    query = "SELECT * FROM users WHERE id = " + uid
    eval(req.payload)
    api_key = "sk_live_9a8b7c6d5e4f3a2b1c"
    return db.query(query)
"""
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/analyze",
        data=json.dumps({"code": code_test}).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    res = urllib.request.urlopen(req)
    an_result = json.loads(res.read().decode())
    print("[PASS] Hybrid Analysis successful!")
    print("       Score:", an_result["score"], "/ 100")
    print("       Total Findings:", an_result["total_findings"])
    print("       Critical Findings:", an_result["critical_count"])
    print("       Recommended Tests:", len(an_result["recommended_test_cases"]))

    # 4. Stats test
    res = urllib.request.urlopen("http://127.0.0.1:8000/api/stats")
    stats = json.loads(res.read().decode())
    print("[PASS] Dashboard Stats verified:", stats)

if __name__ == "__main__":
    run_tests()
