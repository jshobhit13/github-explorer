# GitHub Explorer

A full-stack web app that lets you search any GitHub username and explore their public profile and repositories — built as Exercise 3 of the Studio Graphene Full Stack Developer assessment.

The frontend never calls GitHub directly. All requests are proxied through a Node.js/Express backend, which also handles server-side caching with SQLite (60-second TTL) so repeated searches don't re-hit GitHub's API.

---

## Live Demo

- **Frontend:** [https://github-explorer.vercel.app](https://github-explorer.vercel.app) *(update after deploy)*
- **Backend:** [https://github-explorer-api.onrender.com](https://github-explorer-api.onrender.com) *(update after deploy)*

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite | Functional components + hooks, fast dev server |
| Backend | Node.js + Express | Lightweight, easy to add middleware |
| Caching | SQLite via `better-sqlite3` | Structured, persistent across server restarts, zero external service needed |
| HTTP Client | Axios | Cleaner error handling than raw fetch |
| Charts | Recharts | Composable, good React integration |
| Styling | CSS Modules | Scoped, no build-time dependencies |

---

## How to Run Locally

Assumes only Node.js (v18+) is installed.

```bash
# 1. Clone and install all dependencies
git clone https://github.com/jshobhit13/github-explorer.git
cd github-explorer
npm run install:all

# 2. Set up server environment
cp server/.env.example server/.env
# Optional: add your GitHub PAT in server/.env to raise rate limit from 60 to 5000 req/hr

# 3. Start both servers simultaneously
npm run dev
```

The React app will be at `http://localhost:5173`  
The Express API will be at `http://localhost:5000`

---

## API Documentation

Base URL: `http://localhost:5000`

### `GET /github/:username`
Returns a user's public profile.

**Response `200`:**
```json
{
  "login": "torvalds",
  "name": "Linus Torvalds",
  "avatar_url": "https://avatars.githubusercontent.com/...",
  "bio": "...",
  "location": "Portland, OR",
  "public_repos": 7,
  "followers": 218000,
  "following": 0,
  "created_at": "2011-09-04T...",
  "fromCache": false
}
```

**Error responses:**
- `404` — `{ "error": "User not found" }`
- `429` — `{ "error": "GitHub rate limit hit. Resets at HH:MM:SS" }`

---

### `GET /github/:username/repos?sort=updated&page=1`

Returns paginated repositories for a user.

| Query param | Values | Default |
|---|---|---|
| `sort` | `updated`, `stars`, `full_name` | `updated` |
| `page` | integer | `1` |

**Response `200`:**
```json
{
  "repos": [
    {
      "id": 123456,
      "name": "linux",
      "html_url": "https://github.com/torvalds/linux",
      "description": "Linux kernel source tree",
      "language": "C",
      "stargazers_count": 183000,
      "forks_count": 55000,
      "open_issues_count": 412,
      "default_branch": "master",
      "updated_at": "2024-06-01T...",
      "topics": ["linux", "kernel"]
    }
  ],
  "page": 1,
  "hasMore": false,
  "fromCache": false
}
```

### `GET /health`
Returns `{ "status": "ok" }` — useful for deployment health checks.

---

## Project Structure

```
github-explorer/
├── package.json            # Root — concurrently runs both servers
├── server/
│   ├── index.js            # Express entry point, middleware setup
│   ├── .env.example
│   ├── routes/
│   │   └── github.js       # Proxy routes: /:user and /:user/repos
│   └── db/
│       └── cache.js        # SQLite cache with 60s TTL
└── client/
    ├── index.html
    ├── vite.config.js      # Proxy /github → localhost:5000 in dev
    └── src/
        ├── App.jsx          # Root component, search state
        ├── App.css          # Global design tokens + layout
        ├── services/
        │   └── githubService.js  # Axios base client
        ├── hooks/
        │   ├── useDebounce.js
        │   └── useRecentSearches.js  # localStorage persistence
        ├── utils/
        │   └── formatDate.js
        └── components/
            ├── SearchBar/      # Debounced input + submit
            ├── UserProfile/    # Avatar, stats pills
            ├── RepoList/       # Sort controls + load more
            ├── RepoCard/       # Expandable repo with detail
            ├── LangChart/      # Recharts pie for languages
            ├── RecentSearches/ # Chip list of past searches
            └── Skeleton/       # ProfileSkeleton + RepoSkeleton
```

---

## Next Steps

Given more time, I would:

1. **Pagination refinement** — implement URL-based pagination so users can share/bookmark a specific page
2. **GitHub token OAuth** — let users connect their own GitHub account via OAuth for authenticated requests (5000 req/hr)
3. **Repo search/filter** — client-side filter by name or language within the loaded repos
4. **Error boundary** — React ErrorBoundary component to catch unexpected render failures
5. **Jest tests** — unit tests for the cache module (`get`/`set`/TTL expiry) and the GitHub route error-handling logic
6. **Accessibility audit** — ARIA labels, focus management on search results arrival, keyboard nav in repo list

What I chose not to do within the time budget:
- Drag-and-drop reorder (not relevant to the brief)
- Full authentication (not required, no auth in brief)

---

*Built by Shobhit Jain — jshobhit8172@gmail.com — github.com/jshobhit13*
