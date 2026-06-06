# GitHub Explorer

A full-stack web app to search any GitHub user and browse their public repositories. Built as Exercise 3 of the Studio Graphene Full Stack Developer assessment.

The frontend never calls GitHub directly — all requests go through a Node.js/Express backend, which caches responses in memory (60-second TTL) to avoid hitting GitHub's rate limit on repeated searches.

---

## Live Demo

- Frontend: https://github-explorer-orcin.vercel.app
- Backend: https://github-explorer-api-14to.onrender.com

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 + Vite | Hooks-based, fast dev server |
| Backend | Node.js + Express | Minimal setup, easy middleware |
| Caching | In-memory Map | Simple TTL cache, no extra dependencies |
| HTTP Client | Axios | Consistent error handling |
| Charts | Recharts | Works well with React |
| Styling | CSS Modules | Scoped styles, no build config needed |

---

## How to Run Locally

Requires Node.js v18+.

```bash
git clone https://github.com/jshobhit13/github-explorer.git
cd github-explorer
npm run install:all

cp server/.env.example server/.env
# Optional: add a GitHub PAT in server/.env to increase rate limit to 5000 req/hr

npm run dev
```

React app: `http://localhost:5173`
Express API: `http://localhost:5000`

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

**Errors:**
- `404` — `{ "error": "User not found" }`
- `429` — `{ "error": "GitHub rate limit hit. Resets at HH:MM:SS" }`

---

### `GET /github/:username/repos?sort=updated&page=1`

| Param | Options | Default |
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

---

### `GET /health`

Returns `{ "status": "ok" }`.

---

## Project Structure

```
github-explorer/
├── package.json            # Root — runs both servers with concurrently
├── server/
│   ├── index.js            # Express entry, middleware setup
│   ├── .env.example
│   ├── routes/
│   │   └── github.js       # Proxy routes for user + repos
│   └── db/
│       └── cache.js        # In-memory cache, 60s TTL
└── client/
    ├── index.html
    ├── vite.config.js      # Proxies /github to localhost:5000 in dev
    └── src/
        ├── App.jsx          # Root component, search state
        ├── App.css          # Global design tokens + layout
        ├── services/
        │   └── githubService.js    # Axios base client
        ├── hooks/
        │   ├── useDebounce.js
        │   └── useRecentSearches.js
        ├── utils/
        │   └── formatDate.js
        └── components/
            ├── SearchBar/          # Debounced input + submit
            ├── UserProfile/        # Avatar, stat pills
            ├── RepoList/           # Sort controls + load more
            ├── RepoCard/           # Expandable repo detail
            ├── LangChart/          # Recharts pie for languages
            ├── RecentSearches/     # localStorage chip list
            └── Skeleton/           # Loading placeholders
```

---

## Next Steps

- URL-based pagination so specific pages can be bookmarked
- Client-side repo filter by name or language
- React ErrorBoundary for unexpected render failures
- Jest tests for cache TTL logic and route error handling
- GitHub OAuth so users can connect their own account for higher rate limits
- Accessibility improvements — focus management on search results, keyboard nav

What I skipped intentionally: authentication (not in the brief), drag-and-drop reorder (not relevant here).

I used AI tools during development. Every line of code has been reviewed and I can walk through it in detail.
