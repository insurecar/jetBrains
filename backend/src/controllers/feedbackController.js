const { getDB } = require("../config/db");
const { verifyRecaptcha } = require("../services/recaptchaService");

function getCaptchaToken(body) {
  return (
    body.captchaToken ||
    body.recaptchaToken ||
    body.recaptcha ||
    body["g-recaptcha-response"] ||
    body.publicKey
  );
}

function getFeedbackData(body) {
  const {
    captchaToken,
    recaptchaToken,
    recaptcha,
    publicKey,
    ...feedbackData
  } = body;

  delete feedbackData["g-recaptcha-response"];

  return feedbackData;
}

async function getFeedback(req, res) {
  try {
    const feedback = await getDB().collection("feedback").find().toArray();

    res.status(200).json({
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch feedback",
    });
  }
}

async function createFeedback(req, res) {
  try {
    const captchaToken = getCaptchaToken(req.body);

    if (!captchaToken) {
      return res.status(400).json({
        message: "Captcha token is required",
      });
    }

    const isCaptchaValid = await verifyRecaptcha(captchaToken);

    if (!isCaptchaValid) {
      return res.status(403).json({
        message: "Captcha verification failed",
      });
    }

    const feedbackData = getFeedbackData(req.body);
    const result = await getDB().collection("feedback").insertOne(feedbackData);

    res.status(201).json({
      insertedId: result.insertedId,
      feedback: {
        _id: result.insertedId,
        ...feedbackData,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create feedback",
    });
  }
}

module.exports = {
  createFeedback,
  getFeedback,
};
