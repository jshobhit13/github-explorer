const express = require("express");
const fetch = require("node-fetch");
const cache = require("../db/cache");

const router = express.Router();

const GITHUB_API = "https://api.github.com";
const HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

// Helper — fetch from GitHub, handle errors uniformly
async function ghFetch(url) {
  const res = await fetch(url, { headers: HEADERS });

  if (res.status === 404) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    const err = new Error(
      reset
        ? `GitHub rate limit hit. Resets at ${new Date(reset * 1000).toLocaleTimeString()}`
        : "GitHub rate limit hit. Please try again shortly."
    );
    err.status = 429;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`GitHub API error: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// GET /github/:username — user profile
router.get("/:username", async (req, res, next) => {
  const { username } = req.params;
  const cacheKey = `user:${username.toLowerCase()}`;

  try {
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    const data = await ghFetch(`${GITHUB_API}/users/${username}`);

    const profile = {
      login: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      bio: data.bio,
      location: data.location,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
    };

    cache.set(cacheKey, profile);
    res.json({ ...profile, fromCache: false });
  } catch (err) {
    next(err);
  }
});

// GET /github/:username/repos?page=1&sort=stars
router.get("/:username/repos", async (req, res, next) => {
  const { username } = req.params;
  const page = parseInt(req.query.page) || 1;
  const sort = ["stars", "updated", "full_name"].includes(req.query.sort)
    ? req.query.sort
    : "updated";

  const cacheKey = `repos:${username.toLowerCase()}:${sort}:${page}`;

  try {
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, fromCache: true });

    const data = await ghFetch(
      `${GITHUB_API}/users/${username}/repos?sort=${sort}&per_page=30&page=${page}`
    );

    const repos = data.map((r) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      html_url: r.html_url,
      description: r.description,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      open_issues_count: r.open_issues_count,
      default_branch: r.default_branch,
      updated_at: r.updated_at,
      topics: r.topics,
    }));

    const payload = { repos, page, hasMore: repos.length === 30 };
    cache.set(cacheKey, payload);
    res.json({ ...payload, fromCache: false });
  } catch (err) {
    next(err);
  }
});

// Central error handler for this router
router.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong" });
});

module.exports = router;
