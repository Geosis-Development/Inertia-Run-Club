# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```

2. Fill in your actual values:
   - Firebase config: Get from Firebase Console > Project Settings > General > Your apps
   - `IMGBB_API_KEY`: Get from [imgbb.com](https://imgbb.com) API settings

## Deployment to Vercel

1. Push your code to GitHub.

2. Connect your repo to Vercel.

3. In Vercel dashboard, go to your project > Settings > Environment Variables.

4. Add these environment variables:
   - `IMGBB_API_KEY` (your imgbb API key)
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

5. Deploy!

Note: The `VITE_` prefixed vars are exposed to the client, but Firebase config is safe. The `IMGBB_API_KEY` is used server-side only.
