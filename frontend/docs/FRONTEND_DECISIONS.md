# Frontend Decisions

## Product Name

Use `Smart Job Portal` everywhere. Shared code should import `PRODUCT_NAME` from `src/utils/constants.js` instead of repeating the product name in components.

## Language and i18n

- The current UI remains English only.
- `i18next` and `react-i18next` are configured in `src/i18n/index.js`.
- English is the default and fallback language.
- English strings live in `src/locales/en.json`.
- Arabic translations are intentionally not added yet.
- Shared labels, navigation items, button text, statuses, form labels, validation messages, page titles, empty states, and common errors should use translation keys.
- Long page-specific marketing or help content may stay English during early implementation, but repeated UI text should not be hardcoded in JSX.
- RTL readiness is handled by setting `document.documentElement.dir` from `i18n.dir(...)`; future Arabic support should add an `ar.json` file and include `ar` in `supportedLngs`.

## Theme

- The current UI is light mode only.
- Full dark mode is intentionally not implemented yet.
- Theme values are centralized as semantic CSS tokens in `src/index.css`.
- Token names mirror Tailwind's color scale where practical, then expose app-level semantic tokens such as `--surface-page`, `--text-strong`, `--brand-primary`, `--success`, and `--danger`.
- Components should consume semantic tokens rather than hardcoded one-off colors.
- Reusable components such as `Button`, `Navbar`, and `StatusBadge` should be extended before creating repeated ad hoc UI patterns.
- `tailwind.config.js` maps Tailwind theme extensions to the same CSS variables so future utility-class work uses the existing token system instead of inventing a second palette.

## API

- API services should follow the backend routes and `backend/postman` documentation.
- Do not assume endpoint paths when a route exists in the backend route list or Postman guide.
- `VITE_API_BASE_URL` controls the API base URL; local development defaults to `http://127.0.0.1:8000/api`.
- Requests use `fetch` through `src/api/httpClient.js`.
- Authentication is session-based with cookies and `credentials: include`.
- Login expects the real collection response shape: `{ message, data }`, where `data` is the authenticated user.
- `AuthContext` stores the normalized user object from `response.data`.
- Backend roles are `job_seeker`, `company`, and `admin`. UI aliases are mapped in `src/utils/constants.js`.

## UI Source

- The React app is the source of truth for UI implementation.
- Old static design-reference HTML was removed from the tracked project to keep the repository focused on runnable source code.
- Pages that cannot be connected to a real backend endpoint yet should use clearly marked mock or static data and be listed in `docs/API_ENDPOINTS.md`.
