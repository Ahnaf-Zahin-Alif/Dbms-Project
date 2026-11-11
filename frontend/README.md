# Cinefilm Frontend

Single Page Application (SPA) for the **Cinefilm** cinema management and ticket booking platform, built with **React 19**, **Vite**, and **Tailwind CSS**.

For full project architecture, backend configuration, database setup, and API documentation, see the root [README.md](../README.md).

## Available Scripts

Inside the `frontend` directory, you can run:

- `npm run dev`: Starts the local development server on `http://localhost:5173/`.
- `npm run build`: Bundles the production build to the `dist/` directory.
- `npm run lint`: Runs ESLint over project source files.
- `npm run preview`: Previews the production build locally.

## Environment Variables

Optionally configure `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```
*(Defaults to `http://127.0.0.1:8000` if omitted).*
