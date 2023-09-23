// MessageScheduling.js
import React, { useState } from "react";
import axios from "axios";
const MessageScheduling = () => {
  const [message, setMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      message,
      scheduledTime,
    };
    try {
      await axios.post("/api/messages/schedule", data);
      setMessage("");
      setScheduledTime("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <h1>Message Scheduling</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
        />
        <button type="submit">Schedule</button>
      </form>
    </div>
  );
};
export default MessageScheduling;