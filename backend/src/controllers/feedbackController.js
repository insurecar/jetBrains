const { getDB } = require("../config/db");

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
    const result = await getDB().collection("feedback").insertOne(req.body);

    res.status(201).json({
      insertedId: result.insertedId,
      feedback: {
        _id: result.insertedId,
        ...req.body,
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
