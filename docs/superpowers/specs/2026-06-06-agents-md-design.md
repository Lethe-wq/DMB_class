# AGENTS.md Design

## Goal

Create a repository-level `AGENTS.md` that lets Codex understand and modify
this PHP membership management project without repeatedly rediscovering its
structure, runtime requirements, API contracts, and safety constraints.

## Audience and Language

The document is primarily for coding agents. It will use concise English for
technical instructions while retaining Chinese business terms where they help
identify visible UI behavior.

## Scope

The guide will describe:

- The vanilla HTML/CSS/JavaScript frontend and PHP/MySQL backend.
- The registration page and the member-list CRUD workflow.
- All current API files: `config.php`, `register.php`, `members.php`,
  `add.php`, `edit.php`, and `delete.php`.
- Local startup, database configuration, and the required `user` columns.
- Existing response, SQL, frontend rendering, and security conventions.
- Practical validation steps for PHP, JavaScript, API behavior, and browser
  workflows.
- UTF-8 precautions because the repository contains Chinese source text and
  currently displays signs of encoding corruption in some environments.

## Agent Rules

The final guide will instruct agents to:

- Preserve frontend-backend separation and existing relative endpoint paths.
- Keep API responses as JSON with the existing `success` plus `message` or
  `data` shape.
- Use prepared statements for user-controlled SQL values.
- Escape values rendered through HTML and prefer DOM text APIs where possible.
- Validate request methods and input before database operations.
- Avoid silently changing database credentials, schema fields, or API
  contracts.
- Keep changes focused and avoid adding frameworks or build tooling unless a
  task requires them.
- Preserve UTF-8 and avoid broad rewrites of files containing Chinese text.

## Verification

The document will recommend syntax checks with `php -l`, manual API checks
against a configured MySQL database, and browser verification of registration,
listing, adding, editing, deleting, error states, and Chinese text rendering.

## Deliverable

Replace the current incomplete `AGENTS.md` with a concise, source-accurate
repository guide of roughly 80 to 120 lines. No application behavior will be
changed.
