AI Mission Schema
=================
Purpose: keep AI work in sync with the Missions module. Each Codex reply returns a mission_update JSON payload that the app can ingest.

Status values: planned | in_progress | blocked | done
Priority: P0 (critical), P1 (high), P2 (normal), P3 (low)
Domain tags: frontend, backend, qa, infra, security, data
Agent roles: orchestrator, agent-frontend, agent-backend, agent-qa, agent-infra, agent-security, agent-data

Create/update payload (return at end of each Codex reply):
{
  "mission_update": {
    "id": "MISSION-YYYYMMDD-<slug>",
    "title": "Concise task name",
    "description": "1-2 sentence summary",
    "domains": ["frontend", "qa"],
    "priority": "P2",
    "status": "planned",
    "assignee": "agent-frontend",
    "acceptance": ["..."],
    "tests_planned": ["npm run lint", "npm run test"],
    "tests_ran": [],
    "repo_paths": ["src/features/auth/..."],
    "links": [],
    "notes": "assumptions/risks",
    "updated_at": "<timestamp>"
  }
}

Update payload for completion:
{
  "mission_update": {
    "id": "MISSION-YYYYMMDD-<slug>",
    "status": "done",  // or blocked/in_progress
    "assignee": "agent-frontend",
    "tests_ran": ["npm run lint", "npm run test"],
    "notes": "summary, blockers, risks",
    "links": ["PR/commit if any"],
    "updated_at": "<timestamp>"
  }
}

Conventions:
- Orchestrator auto-assigns based on domain tags.
- Keep titles/acceptance concise; avoid fluff.
- repo_paths are relative to repo root.
- Always wrap the payload in a code block so it can be ingested easily.
