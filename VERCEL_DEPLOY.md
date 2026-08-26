# Brevistay Web Signup — Vercel deployment

## 1. GitHub

Create a new GitHub repository and push the contents of this folder.

Do NOT commit `.env` or any real credentials.

## 2. Vercel

Import the GitHub repository into Vercel. Vercel supports Express applications and
server-side functions, so the Express entrypoint can run as the backend. See:
https://vercel.com/kb/express

## 3. Environment variables

In Vercel → Project → Settings → Environment Variables, add:

BREVISTAY_BASE=https://session-ms.brevistay.com
BREVI_CHANNEL=android
BREVI_CHANNEL_VERSION=<only if confirmed from the APK>
BREVI_AUTH_HEADER=<only if required>
BREVI_AUTH_VALUE=<only if required>

Do not put secrets in public/app.js.

## 4. Deploy

Push to GitHub or use Vercel's Deploy button/import flow. The site and `/api/*`
routes are served by the same deployment.

## 5. Test

Open the generated Vercel URL, enter an authorized test mobile number and referral
code, request the real OTP, enter the OTP, and submit registration.

If the Brevistay backend returns a 4xx/5xx, the page shows the response. That usually
means an additional APK-specific header, field, or channel value still needs to be
recovered by static analysis.

## Important

This project does not intercept or bypass OTP verification. It forwards the normal
signup flow to the Brevistay authentication service. Use only with the authorization
and test accounts/numbers supplied for the challenge.
