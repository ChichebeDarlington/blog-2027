# Chichebe.dev — MERN Developer Blog

Responsive personal developer blog and portfolio with an administrator CMS.

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas database

## Setup
1. Copy `server/.env.example` to `server/.env` and set the values.
2. Copy `client/.env.example` to `client/.env`.
3. From this folder run `npm install`.
4. Create the first administrator using the seed command below.
5. Run `npm run dev`.

### Create the first administrator
From the project root:

```bash
npm run seed:admin -w server -- --email admin@example.com --password 'Use-A-Long-Unique-Password'
```

The seed command refuses to overwrite an existing account with that email. Keep the password private.

- Client: http://localhost:5173
- API: http://localhost:5000/api/v1

## Notes
- All async request code uses `async/await` and `try/catch`; no `.then()`/`.catch()` chains.
- Admin authentication uses a JWT in an HTTP-only cookie. In production, deploy over HTTPS and set `CLIENT_ORIGIN` to the exact frontend origin.
- Configure `COOKIE_SAME_SITE` according to deployment topology. If frontend and API are cross-site, `SameSite=None` requires `Secure=true` and CSRF protection should be added before launch.
- This is a production-oriented starter, not a substitute for deployment-specific security review. Add CSRF protection for cookie-authenticated mutations, email-based password reset, media object storage, monitoring, and backups before public launch.
