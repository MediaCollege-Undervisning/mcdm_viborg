import express from "express";
import { getEvents } from "../../handlers/events/events.handler.js";

const eventsRouter = express.Router();

// Get events
eventsRouter.get("/", async (req, res) => {
  try {
    const data = await getEvents();

    if (data.status === "ok") {
      return res.status(200).send({ message: data.message, data: data.data });
    }

    return res.status(500).send({ message: data.message, data: [] });
  } catch (error) {
    console.error("Error in GET /events:", error);
    return res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default eventsRouter;
