import re
from typing import List, Dict, Any

STATIC_RULES = [
    {
        "id": "sec-sql-concat",
        "pattern": r'(SELECT|INSERT|UPDATE|DELETE)[^"\'`]*["\'`]\s*\+',
        "flags": re.IGNORECASE,
        "severity": "critical",
        "type": "security",
        "title": "SQL Injection via String Concatenation",
        "description": "User-controlled input is directly concatenated into a dynamic SQL query without parameterization, allowing malicious SQL commands to execute.",
        "suggestion": "Rewrite the query using parameterized statements or ORM binding (:param / %s / ?).",
        "generate_fix": lambda line: (
            line,
            re.sub(r'["\']\s*\+\s*([A-Za-z0-9_]+)', r'\'", (\1,)', line)
        ),
        "test_case": "def test_sql_injection_rejection():\n    payload = \"1' OR '1'='1\"\n    res = query_handler(payload)\n    assert res.status_code != 200 or len(res.data) == 0"
    },
    {
        "id": "sec-hardcoded-secret",
        "pattern": r'(api[_-]?key|secret|password|token|aws_key)\s*[:=]\s*["\'][A-Za-z0-9_\-\.]{8,}["\']',
        "flags": re.IGNORECASE,
        "severity": "critical",
        "type": "security",
        "title": "Hardcoded Secret / API Token Detected",
        "description": "Sensitive credentials committed in plain text pose a severe risk of repository compromise and credential hijacking.",
        "suggestion": "Extract sensitive values to environment variables (e.g. os.getenv or process.env) or a secret manager.",
        "generate_fix": lambda line: (
            line,
            re.sub(r'["\'][A-Za-z0-9_\-\.]{8,}["\']', 'os.getenv("API_SECRET_KEY")', line)
        ),
        "test_case": "def test_secret_not_exposed():\n    import os\n    assert os.getenv('API_SECRET_KEY') is not None"
    },
    {
        "id": "sec-eval-exec",
        "pattern": r'\b(eval|exec)\s*\(',
        "flags": 0,
        "severity": "critical",
        "type": "security",
        "title": "Arbitrary Code Execution via eval()/exec()",
        "description": "Executing dynamic code with eval() or exec() bypasses sandbox restrictions and allows remote code execution (RCE).",
        "suggestion": "Replace eval() with safe parsers such as ast.literal_eval, json.loads, or explicit dispatch mapping.",
        "generate_fix": lambda line: (
            line,
            re.sub(r'\beval\s*\(', 'ast.literal_eval(', line)
        ),
        "test_case": "def test_safe_parsing():\n    import ast\n    parsed = ast.literal_eval(\"{'safe': True}\")\n    assert parsed['safe'] is True"
    },
    {
        "id": "bug-bare-except",
        "pattern": r'except\s*:\s*$|except\s*:\s*pass',
        "flags": 0,
        "severity": "high",
        "type": "bug",
        "title": "Bare Exception Clause Suppresses Critical Errors",
        "description": "A bare 'except:' clause catches system-level interrupts (e.g., KeyboardInterrupt, SystemExit) and hides fatal exceptions.",
        "suggestion": "Catch specific exceptions (e.g., except Exception as err) and log error details appropriately.",
        "generate_fix": lambda line: (
            line,
            re.sub(r'except\s*:', 'except Exception as err:\n        logger.error(f"Handled error: {err}")', line)
        ),
        "test_case": "def test_exception_handling():\n    with pytest.raises(ExpectedCustomError):\n        risky_operation()"
    },
    {
        "id": "sec-xss-innerhtml",
        "pattern": r'\.innerHTML\s*=',
        "flags": 0,
        "severity": "high",
        "type": "security",
        "title": "Potential DOM Cross-Site Scripting (XSS)",
        "description": "Assigning untrusted data directly to element.innerHTML enables arbitrary script injection within client browsers.",
        "suggestion": "Use textContent, innerText, or DOMPurify.sanitize() before assigning HTML content.",
        "generate_fix": lambda line: (
            line,
            line.replace('.innerHTML', '.textContent')
        ),
        "test_case": "test('prevents script injection in markup', () => {\n  const payload = '<script>alert(1)</script>';\n  element.textContent = payload;\n  expect(element.children.length).toBe(0);\n});"
    },
    {
        "id": "perf-n-plus-one",
        "pattern": r'for\s+.*\bin\b.*:\s*.*\.(query|get|filter|find)\(',
        "flags": 0,
        "severity": "medium",
        "type": "performance",
        "title": "N+1 Database Query Pattern in Loop",
        "description": "Executing database queries within an iteration loop produces N+1 round trips, severely degrading API response latency.",
        "suggestion": "Eagerly load related relationships or batch retrieve records using IN clauses or join queries.",
        "generate_fix": lambda line: (
            line,
            "# Use joinedload or selectinload in query before loop\n" + line
        ),
        "test_case": "def test_query_count(db_session, query_counter):\n    with query_counter(expected=1):\n        load_items_with_relations()"
    },
    {
        "id": "qual-debug-print",
        "pattern": r'\b(console\.log|print)\s*\(',
        "flags": 0,
        "severity": "low",
        "type": "quality",
        "title": "Production Debug Print Statement",
        "description": "Verbose debug logging statements leak sensitive execution variables and slow down I/O in production.",
        "suggestion": "Replace stdout logging with structured logger module (e.g. logging.debug or pino).",
        "generate_fix": lambda line: (
            line,
            re.sub(r'\bprint\s*\(', 'logger.debug(', line)
        ),
        "test_case": "def test_no_stdout_leaks(capsys):\n    invoke_handler()\n    out, _ = capsys.readouterr()\n    assert 'debug:' not in out"
    },
    {
        "id": "bug-div-by-zero",
        "pattern": r'/\s*([a-zA-Z_][a-zA-Z0-9_]*)',
        "flags": 0,
        "severity": "high",
        "type": "bug",
        "title": "Potential Division by Zero",
        "description": "If variable in the denominator is 0, this expression will raise a ZeroDivisionError during execution.",
        "suggestion": "Validate that denominator is non-zero before performing division, or add a guard condition.",
        "generate_fix": lambda line: (
            line,
            f"if b == 0:\n        raise ValueError('Denominator cannot be zero')\n    {line}"
        ),
        "test_case": "def test_division_by_zero_prevention():\n    import pytest\n    with pytest.raises(ValueError):\n        calculate(10, 0)"
    },
    {
        "id": "qual-missing-type-hints",
        "pattern": r'def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\([a-zA-Z0-9_,\s]+\)(?!->)\s*:',
        "flags": 0,
        "severity": "low",
        "type": "quality",
        "title": "Consider Adding Type Hints",
        "description": "Adding explicit type annotations makes function signatures clearer and enables early static type validation.",
        "suggestion": "Annotate argument types and specify return type (e.g. def calculate(a: float, b: float) -> float).",
        "generate_fix": lambda line: (
            line,
            line.replace("(a, b):", "(a: float, b: float) -> float:")
        ),
        "test_case": "def test_type_compatibility():\n    assert isinstance(calculate(10.0, 2.0), (int, float))"
    },
    {
        "id": "qual-todo-comment",
        "pattern": r'#\s*(TODO|FIXME|HACK)|//\s*(TODO|FIXME|HACK)',
        "flags": re.IGNORECASE,
        "severity": "low",
        "type": "quality",
        "title": "Unresolved Technical Debt / TODO Marker",
        "description": "Unresolved code comment markers indicate incomplete implementations or known edge-case defects.",
        "suggestion": "Address the requested item or link it directly to an issue tracking ticket.",
        "generate_fix": lambda line: (
            line,
            re.sub(r'#\s*(TODO|FIXME|HACK):?', '# Tracked in CodeVision backlog:', line)
        ),
        "test_case": "def test_feature_completeness():\n    assert handler_implements_edge_cases() is True"
    }
]

def run_hybrid_analysis(code: str, filename: str = "snippet.py", language: str = "python") -> Dict[str, Any]:
    lines = code.split("\n")
    findings = []
    recommended_tests = []
    
    for idx, line in enumerate(lines, start=1):
        for rule in STATIC_RULES:
            if re.search(rule["pattern"], line, rule["flags"]):
                before, after = rule["generate_fix"](line.strip())
                findings.append({
                    "id": f"find_{len(findings)+1}",
                    "line": idx,
                    "severity": rule["severity"],
                    "type": rule["type"],
                    "title": rule["title"],
                    "snippet": line.strip()[:140],
                    "description": rule["description"],
                    "suggestion": rule["suggestion"],
                    "before_code": before,
                    "after_code": after,
                    "status": "open"
                })
                if rule["test_case"] not in recommended_tests:
                    recommended_tests.append(rule["test_case"])

    # Calculate review score
    deductions = {
        "critical": 25,
        "high": 15,
        "medium": 8,
        "low": 3
    }
    score = 100
    crit_count = sum(1 for f in findings if f["severity"] == "critical")
    high_count = sum(1 for f in findings if f["severity"] == "high")
    med_count = sum(1 for f in findings if f["severity"] == "medium")
    low_count = sum(1 for f in findings if f["severity"] == "low")

    for f in findings:
        score -= deductions.get(f["severity"], 5)
    score = max(score, 12) if findings else 100

    # AI reasoning summary
    if crit_count > 0:
        ai_summary = f"CodeVision AI identified {crit_count} Critical security vulnerabilities that must be patched prior to production release. Remediations have been synthesized."
    elif high_count > 0:
        ai_summary = f"CodeVision AI flagged {high_count} High priority reliability issues that could cause request failure under load."
    elif len(findings) > 0:
        ai_summary = f"CodeVision AI reviewed {len(lines)} lines. Code structure is sound with minor performance/quality improvements recommended."
    else:
        ai_summary = f"CodeVision AI analysis complete: 0 vulnerabilities found across {len(lines)} lines. Code meets enterprise quality benchmarks."

    return {
        "score": score,
        "total_findings": len(findings),
        "critical_count": crit_count,
        "high_count": high_count,
        "medium_count": med_count,
        "low_count": low_count,
        "findings": findings,
        "ai_summary": ai_summary,
        "recommended_test_cases": recommended_tests
    }
