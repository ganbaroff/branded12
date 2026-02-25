# Connect GitHub and Cursor Agents to This Project

## What’s already done

- **Git** is initialized in this project.
- **Initial commit** is created (all project files).
- **`.gitignore`** is set so `.env`, `.dev.vars`, and other secrets are not committed.

Your Cursor account already has **GitHub connected** as `ganbaroff`. Once this repo is on GitHub, Cursor Cloud Agents can use it.

---

## 1. Create the repo on GitHub

1. Go to [github.com/new](https://github.com/new).
2. Sign in as **ganbaroff** (or the account you use with Cursor).
3. Set **Repository name** (e.g. `branded1`).
4. Choose **Public** (or Private if you prefer).
5. Do **not** add a README, .gitignore, or license (we already have them).
6. Click **Create repository**.

---

## 2. Add GitHub as remote and push

In your project folder, run (replace `branded1` with your repo name if different):

```bash
git remote add origin https://github.com/ganbaroff/branded1.git
git branch -M main
git push -u origin main
```

If you use SSH:

```bash
git remote add origin git@github.com:ganbaroff/branded1.git
git branch -M main
git push -u origin main
```

---

## 3. Cursor Agents and this repo

- **Cloud Agents** in Cursor use your GitHub connection to access repos. After you push this project to a repo under `ganbaroff`, that repo is available to Cloud Agents.
- In Cursor: **Settings → Integrations** — GitHub should show “Connected as 'ganbaroff'”. If you created the repo under that account (or an org they can access), agents can work with it.
- To use an agent on this project: open the repo in Cursor (or ensure the workspace is this project), then use **Cloud Agents** or the Agent panel and refer to this codebase; they’ll use the linked GitHub context when needed.

---

## 4. Optional: Cursor API (User API Key)

For **Headless Cursor Agent CLI** or **Cloud Agent API** (beta), use your User API Key in env (never commit it):

```bash
# In .env or system env
CURSOR_API_KEY=your_key_here
```

Keep the key in `.env` (already in `.gitignore`) or in your system environment, not in code.

---

## Quick checklist

- [ ] Create repository on GitHub (e.g. `ganbaroff/branded1`).
- [ ] Run `git remote add origin ...` and `git push -u origin main`.
- [ ] Confirm Cursor → Settings → Integrations shows GitHub connected.
- [ ] Open this project in Cursor; Cloud Agents will use the GitHub-linked repo when available.
