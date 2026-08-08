# Make “Login With…?” a PHP full-stack portfolio demo

## Summary

Use **PHP 8.3 + Laravel 13 + Livewire 4 + Blade**. It keeps PHP central, gives you real database-backed behavior and tests, while avoiding an unnecessary React frontend. Laravel 13 requires PHP 8.3+, and Livewire 4 supports Laravel 10+ with PHP 8.1+. [Laravel release notes](https://laravel.com/docs/13.x/releases), [Livewire installation](https://livewire.laravel.com/docs/4.x/installation)

## Key changes

- Convert the current static pages into a Laravel app with Blade layouts and Livewire components; preserve the current visual personality, dark mode, signup, login-options, and reset-password paths.
- Use Laravel’s built-in session authentication for **clearly fictional demo accounts**. Never implement real OAuth, payments, or collection of third-party credentials.
- Store users, login/reset option definitions, and a timestamped activity history in PostgreSQL. Each absurd choice produces a server-recorded outcome: success, failure, cooldown, random gacha roll, or “admin pending.”
- Make `/login-options` and `/forgot-password` interactive Livewire screens with loading/error/success states instead of browser alerts. Add a profile/activity page where users can see their past terrible authentication decisions.
- Keep all current jokes and labels as requested, but replace remote image hotlinks with committed, license-appropriate local assets or generic parody icons so the site remains reliable when deployed.
- Add a concise README with setup, demo-account policy, technology choices, screenshots, and a visible disclaimer that the project is satire—not an authentication service.

## Test plan

- Feature-test registration, login, logout, session protection, and password-reset simulator flows.
- Livewire-test each option outcome, including random-result boundaries, cooldown enforcement, history persistence, and unauthorized access handling.
- Browser-check responsive layouts, keyboard navigation, dark-mode persistence, and form validation.
- Run PHP formatting/static checks and the Laravel test suite in CI before pushes.

## Assumptions

- This is a Laravel monolith: no public REST API and no React frontend.
- PostgreSQL is the target database; deployment-host selection is deferred, but the app will be portable to any PHP 8.3+/PostgreSQL host.
- Existing unstaged `index.html` and untracked `signup/` work are retained and migrated rather than discarded.
