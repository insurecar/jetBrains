const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_RECAPTCHA_SCORE = 0.5;

async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    throw new Error("RECAPTCHA_SECRET_KEY is not defined");
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    return false;
  }

  const result = await response.json();

  return Boolean(result.success && result.score >= MIN_RECAPTCHA_SCORE);
}

module.exports = {
  verifyRecaptcha,
};
