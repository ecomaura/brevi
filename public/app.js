const $ = id => document.getElementById(id);
const status = $("status");

function show(obj, good=false) {
  status.className = good ? "ok" : "err";
  status.textContent = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
}

async function post(url, body) {
  const r = await fetch(url, {
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify(body)
  });
  const data = await r.json().catch(()=>({}));
  if (!r.ok) throw data;
  return data;
}

$("send").onclick = async () => {
  $("send").disabled = true;
  show("Requesting the real Brevistay OTP...");
  try {
    const data = await post("/api/send-otp", {mobile:$("mobile").value});
    $("otpBox").classList.remove("hidden");
    show(data, true);
  } catch(e) {
    show(e);
  } finally {
    $("send").disabled = false;
  }
};

$("verify").onclick = async () => {
  $("verify").disabled = true;
  show("Verifying OTP and submitting referral registration...");
  try {
    const data = await post("/api/verify", {
      mobile:$("mobile").value,
      otp:$("otp").value,
      ref_code:$("ref").value,
      name:$("name").value,
      lastName:$("last").value,
      email:$("email").value
    });
    show(data, true);
  } catch(e) {
    show(e);
  } finally {
    $("verify").disabled = false;
  }
};