# Brevistay APK-flow web signup test

This is a server-side proof-of-concept that reproduces the signup contract identified by
static inspection of the supplied Brevistay APK. It does NOT intercept network traffic
and does NOT bypass OTP/authentication.

## Run

1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Adjust `BREVI_CHANNEL` / `BREVI_CHANNEL_VERSION` if the authorized Brevistay test
   environment requires specific values.
4. Run:
   npm install
   npm start
5. Open http://localhost:3000

## Flow

POST /userLogin
{
  mobile,
  otp: "",
  is_otp: true,
  is_password: false,
  password: "",
  delivery_channel: "sms"
}

Then:

POST /verify-user
{
  email,
  is_otp: true,
  is_password: false,
  mobile,
  name,
  otp,
  password: "",
  ref_code,
  channel: "android",
  lastName
}

The APK's exact runtime header values are intentionally configurable instead of
invented. If Brevistay's backend rejects the request, the returned response is shown
in the page so the test can identify which remaining APK-specific requirement must
be recovered from static analysis.

Use only with Brevistay's authorization and test numbers/accounts.
