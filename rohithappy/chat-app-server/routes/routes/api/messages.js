const express = require("express");
const router = express.Router();
const MessageSchedulingController = require("./MessageSchedulingController");
// Schedule a message
router.post("/schedule", MessageSchedulingController.scheduleMessage);
module.exports = router;