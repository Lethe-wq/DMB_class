# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A PHP membership management system (会员系统) with frontend-backend separation. PHP backend serves JSON APIs; frontend uses vanilla JavaScript `fetch()` to consume them.

## Running the Project

Requires a local PHP + MySQL stack (e.g., XAMPP, WAMP, phpStudy). Place the project in the web server's document root and access via browser.

- **Quick start**: `php -S localhost:8080` from the project root
- **Database config**: `api/config.php` — host `localhost`, user `root`, password `root`, database `test_11`
- **Required table `user`**: columns `id, username, age, sex, addr, married, salary, remark`

## Architecture

```
会员系统/
├── api/                  # Backend — PHP JSON APIs
│   ├── config.php        #   Shared DB connection (mysqli with exception mode)
│   ├── register.php      #   POST /api/register.php — insert user
│   └── members.php       #   GET  /api/members.php  — list users
├── css/
│   └── style.css         # Shared styles
├── js/
│   ├── register.js       # Form submit via fetch() to register API
│   └── members.js        # Load and render member table from API
├── index.html            # Registration form (entry page)
└── members.html          # Member list page
```

### Data Flow

1. `index.html` → user fills form → `js/register.js` intercepts submit → `POST api/register.php` → JSON response
2. `members.html` → page load → `js/members.js` → `GET api/members.php` → renders table rows

### Key Patterns

- All PHP responses return `Content-Type: application/json` with `{success, message/data}` shape
- Backend uses `mysqli` prepared statements for SQL injection prevention
- Frontend uses `escapeHtml()` in `members.js` to prevent XSS
- Database connection is centralized in `api/config.php` with `mysqli_report` exception mode
