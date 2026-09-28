# ChatApplication

ChatApplication is a responsive React chat frontend built with React, TypeScript, and Vite. It supports login and registration through a separate backend, with sample conversation data displayed in the chat interface.

## Features

- Separate login and registration pages (`#/login` and `#/register`).
- API connection status and cookie-backed session restoration.
- Inbox, starred, and archived conversation views.
- Conversation search, unread counts, and new conversation creation.
- Responsive conversation list, thread, and mobile navigation.
- Optional real-time messages through Socket.IO.
- Sample conversations are currently stored in frontend source; they are not loaded from or saved to the backend.

## Requirements

- Node.js 20 or newer recommended.
- npm.
- The ChatApplication backend running separately for login, registration, session, and real-time features.

## Setup

1. Open a terminal in the frontend project directory.
2. Install frontend dependencies:

   ```sh
   npm install
   ```

3. Create a local environment file. In PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS or Linux:

   ```sh
   cp .env.example .env
   ```

4. Set the backend addresses in `.env`:

   ```dotenv
   VITE_API_URL=http://localhost:3001
   VITE_SOCKET_URL=http://localhost:3001
   ```

   Change the host or port to match your backend. The frontend and backend are separate projects; start the backend from its own directory using its documented command.

5. Start the frontend:

   ```sh
   npm run dev
   ```

6. Open the local URL printed by Vite, normally `http://localhost:5173`.

Vite proxies API requests to `VITE_API_URL` during development. Restart the Vite server after changing environment variables.

## API Routes

The frontend calls these backend routes through the Axios client in `src/api/axiosInstance.ts` and `src/api/authApi.ts`:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/connection` | Check that the API is reachable. |
| `POST` | `/api/user/login` | Sign in with email and password. |
| `POST` | `/api/user/register` | Register with name, email, and password. |
| `GET` | `/api/users/getuser` | Restore the signed-in user from the session cookie. |
| `POST` | `/api/users/logout` | End the server session. |

The Axios client uses `withCredentials: true`. The backend must support credentialed requests and configure CORS for the frontend origin. For credentialed cross-origin production requests, the backend must return the exact allowed frontend origin and `Access-Control-Allow-Credentials: true`; wildcard `Access-Control-Allow-Origin: *` is not valid with credentials.

The auth response types are defined in `src/types/auth.ts`. Login responses may include `user`, `token` or `accessToken`, or those fields inside `data`. The user object should include an email and ideally a name or username.

## Authentication Flow

1. `useAuth` calls `/api/connection` and checks for an existing session on startup.
2. `authRepository` coordinates login, registration, logout, and session restoration.
3. `userRepository` unwraps Axios responses and converts request failures into user-facing messages.
4. `authApi` defines the HTTP methods and paths.
5. Login stores the returned user in React state. Registration returns to the login page after success. Logout calls the backend and clears the local session.

## Real-Time Messaging

If `VITE_SOCKET_URL` is set, the app connects to that Socket.IO server after login. It emits `message:send` with `{ id, conversationId, text, time, sender }` and listens for `message:receive` with the same message shape. Without this variable, the chat interface still loads, but messages are only updated locally in the current session.

## Project Structure

```text
src/
  api/           Axios client and endpoint functions
  components/    Auth, inbox, navigation, and thread UI
  hooks/         React auth/session hook
  repository/    Auth and user data coordination
  types/         Shared auth types
  App.tsx        App shell, sample conversations, and chat state
  App.css        Chat and auth styling
  chatTypes.ts   Conversation and message types
  main.tsx       React application entry point
  index.css      Global styles and theme variables
```

## Available Commands

```sh
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build in dist/
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

There is currently no automated test script configured.

## Troubleshooting

- **API connection unavailable:** Confirm the backend is running and `VITE_API_URL` has the correct address and port.
- **CORS or cookie errors:** Configure the backend to allow the frontend origin with credentials. Restart both servers after configuration changes.
- **Socket remains disconnected:** Confirm the backend Socket.IO server is running and `VITE_SOCKET_URL` is correct.
- **Environment changes do not apply:** Restart Vite after editing `.env`.
- **Localhost does not work across devices:** Use the backend machine's reachable LAN address instead of `localhost`.

Vite environment variables are included in the browser bundle. Do not put private secrets in `VITE_*` variables.
