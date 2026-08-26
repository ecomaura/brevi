import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json({ limit: "32kb" }));
app.use(express.static("public"));

const BASE = process.env.BREVISTAY_BASE || "https://session-ms.brevistay.com";

function headers() {
  const h = {
    accept: "application/json",
    "content-type": "application/json",
    "user-agent": "Brevistay-Web-Test/1.0"
  };
  if (process.env.BREVI_CHANNEL) h["brevi-channel"] = process.env.BREVI_CHANNEL;
  if (process.env.BREVI_CHANNEL_VERSION) h["brevi-channel-version"] = process.env.BREVI_CHANNEL_VERSION;
  if (process.env.BREVI_AUTH_HEADER && process.env.BREVI_AUTH_VALUE)
    h[process.env.BREVI_AUTH_HEADER] = process.env.BREVI_AUTH_VALUE;
  return h;
}

async function call(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
    redirect: "manual"
  });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text.slice(0, 5000) }; }
  return { status: r.status, ok: r.ok, data };
}

function mobile(v) {
  const d = String(v || "").replace(/\D/g, "");
  if (d.length === 10) return d;
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  throw new Error("Enter a valid 10-digit Indian mobile number.");
}

app.post("/api/send-otp", async (req, res) => {
  try {
    const body = {
      mobile: mobile(req.body.mobile),
      otp: "",
      is_otp: true,
      is_password: false,
      password: "",
      delivery_channel: "sms"
    };
    const result = await call("/userLogin", body);
    res.status(result.status || 502).json({ ok: result.ok, stage: "otp", response: result.data });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.post("/api/verify", async (req, res) => {
  try {
    const m = mobile(req.body.mobile);
    const otp = String(req.body.otp || "").trim();
    const ref_code = String(req.body.ref_code || "").trim();
    const name = String(req.body.name || "").trim();
    if (!otp) throw new Error("OTP is required.");
    if (!ref_code) throw new Error("Referral code is required.");
    if (!name) throw new Error("Name is required.");

    const body = {
      email: String(req.body.email || "").trim(),
      is_otp: true,
      is_password: false,
      mobile: m,
      name,
      otp,
      password: "",
      ref_code,
      channel: "android",
      lastName: String(req.body.lastName || "").trim()
    };
    const result = await call("/verify-user", body);
    res.status(result.status || 502).json({ ok: result.ok, stage: "verify", response: result.data });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

// Vercel's Express integration can use the exported app as the server entrypoint.
export default app;
