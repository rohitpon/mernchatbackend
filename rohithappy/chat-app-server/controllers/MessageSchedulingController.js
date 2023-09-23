// MessageSchedulingController.js
const MessageSchedulingController = require("./MessageSchedulingModel");
const scheduleMessage = async (req, res) => {
  try {
    const { message, scheduledTime } = req.body;
    const scheduledMessage = await MessageSchedulingController.create({
      message,
      scheduledTime,
    });
    res.status(201).json({
      success: true,
      data: scheduledMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
module.exports = {
  scheduleMessage,
};