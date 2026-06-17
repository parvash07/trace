# Trace

Trace  is a minimal, AI-powered stack trace analyzer and personal error diary. Paste a stack trace, get a structured explanation (root cause, fix, prevention, severity), and automatically build a searchable knowledge base of every error you've encountered.

Built with **Spring Boot 3 + React 18 + PostgreSQL + Groq AI**.

---

## Quick start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Groq API key](https://console.groq.com)

### 1. Set your API key

```bash
echo 'GROQ_API_KEY="gsk_your-actual-key-here"' > backend/.env
```

The `.env` file is already `.gitignore`-safe and pre-configured for local development.

### 2. Start everything

```bash
docker compose up -d
```

Open **http://localhost:5173** — paste a stack trace and hit Analyze.

### 3. Stop

```bash
docker compose down
```

---

## Usage

### Analyze an error

1. Paste a stack trace and optional code context
2. Select the language and add tags
3. Click **Analyze Error**
4. View the AI-generated root cause, fix, prevention, and severity

### Error diary

Every analyzed error is automatically saved. Browse past entries via the **Diary** tab, or search across all entries using the search bar at the top.

### Similar errors

Before saving a new error, the system checks past entries of the same type + language. Over time, analyzing a `NullPointerException` automatically shows "here's what fixed it last time" — zero extra AI calls.

### Search

Full-text search across all diary entries (error type, root cause, fix, prevention, and tags) using PostgreSQL `tsvector`.

---

## Project structure

```
error-explainer/
├── backend/                    # Spring Boot 3.2 / Java 21
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/errorexplainer/
│       ├── ErrorExplainerApplication.java
│       ├── config/
│       │   ├── GroqConfig.java
│       │   └── GlobalExceptionHandler.java
│       ├── controller/
│       │   └── ErrorController.java
│       ├── dto/
│       │   ├── AnalyzeRequest.java
│       │   ├── AnalyzeResponse.java
│       │   └── ErrorDiaryEntry.java
│       ├── entity/
│       │   └── ErrorEntry.java
│       ├── repository/
│       │   └── ErrorRepository.java
│       └── service/
│           ├── ErrorAnalysisService.java
│           └── GroqService.java
├── frontend/                   # React 18 + Vite + Tailwind
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── api/
│       │   └── errorApi.js
│       ├── components/
│       │   ├── AnalyzeForm.jsx
│       │   ├── ResultCard.jsx
│       │   ├── SimilarErrors.jsx
│       │   ├── DiaryList.jsx
│       │   ├── DiaryEntry.jsx
│       │   └── SearchBar.jsx
│       └── App.jsx
├── db/
│   ├── Dockerfile              # Bakes migration into PostgreSQL image
│   └── migration.sql           # Schema: tsvector, GIN index, auto-trigger
├── docker-compose.yml          # Full stack (postgres + backend + frontend)
├── start-backend.sh            # Dev mode: hot-reload backend
└── start-frontend.sh           # Dev mode: HMR frontend
```

---

## API endpoints

All endpoints are under `http://localhost:8080/api/errors` (or proxied through the frontend at `/api/errors`).

| Method | Path | Description |
|---|---|---|
| `POST` | `/analyze` | Analyze a stack trace via Groq AI, persist result, return similar past errors |
| `GET` | `/diary` | Paginated list of all past errors (supports `page`, `size`, `tag`, `language`) |
| `GET` | `/diary/{id}` | Full detail for one entry |
| `GET` | `/search?q=...&language=...` | Full-text search across all entries |
| `DELETE` | `/diary/{id}` | Delete an entry |

### Example: analyze an error

```bash
curl -X POST http://localhost:8080/api/errors/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "stackTrace": "java.lang.NullPointerException\n\tat com.example.Foo.bar(Foo.java:42)",
    "codeContext": "String s = null; s.length();",
    "language": "java",
    "tags": ["null-pointer"]
  }'
```

Response:

```json
{
  "errorType": "NullPointerException",
  "rootCause": "Attempted to call length() on a null string reference",
  "fix": "Initialize the variable or add a null check before calling methods on it",
  "prevention": "Always validate object references before method calls",
  "severity": "HIGH",
  "similarErrors": [...]
}
```

---

## Development

For active development with hot-reload:

```bash
# Terminal 1 — PostgreSQL only
docker compose up -d postgres

# Terminal 2 — Backend (Spring Boot devtools)
./start-backend.sh

# Terminal 3 — Frontend (Vite HMR)
./start-frontend.sh
```

The backend auto-restarts on Java file changes. The frontend reflects changes instantly via Vite's HMR.

### Environment variables

**Backend** (`backend/.env`):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | JDBC URL for PostgreSQL |
| `GROQ_API_KEY` | Yes | Groq API key |
| `FRONTEND_URL` | No | CORS origin (default: `http://localhost:5173`) |

**Frontend** (`frontend/.env`):

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | Backend URL for dev mode (default: `http://localhost:8080`). In Docker, nginx proxies `/api/` so this isn't needed. |

---

## Database

PostgreSQL with full-text search. The `errors` table has a `tsvector` column with a GIN index, auto-updated by a trigger on insert/update. The migration runs automatically when PostgreSQL initializes (via `db/Dockerfile`).

```
Schema:
  id            UUID PRIMARY KEY
  error_type    VARCHAR(255)
  stack_trace   TEXT
  code_context  TEXT
  root_cause    TEXT
  fix           TEXT
  prevention    TEXT
  severity      VARCHAR(10)  CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL'))
  language      VARCHAR(50)
  tags          TEXT[]
  search_vector TSVECTOR     ← auto-populated, GIN-indexed
  created_at    TIMESTAMPTZ  DEFAULT now()
```

---

## Deployment

- **Backend** → Railway (set env vars: `DATABASE_URL`, `GROQ_API_KEY`, `FRONTEND_URL`)
- **Frontend** → Vercel (set env var: `VITE_API_URL`)
- **Database** → Railway PostgreSQL or any PostgreSQL host

The `spring.jpa.hibernate.ddl-auto=none` config means the migration must be applied manually in production (`db/migration.sql`).

---

## Built with

- [Spring Boot 3](https://spring.io/projects/spring-boot) — backend framework
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) — frontend
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [PostgreSQL](https://www.postgresql.org/) — database with full-text search
- [Groq](https://groq.com/) — AI inference (llama-3.3-70b-versatile)
- [Docker](https://www.docker.com/) — containerization
