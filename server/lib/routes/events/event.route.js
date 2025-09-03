import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  updateEvent,
} from "../../handlers/events/event.handler.js";
import auth from "../../middleware/auth.middleware.js";
import { isValidObjectId } from "../../helpers/isValidObjectId.js";
import { upload } from "../../helpers/multerUpload.js";
import mongoose from "mongoose";

const eventRouter = express.Router();

// CREATE EVENT
eventRouter.post("/", upload.none(), async (req, res) => {
  try {
    const { event, description, presentation, exam, date, time, file } =
      req.body;

    if (!event) {
      return res.status(400).json({
        status: "error",
        message: "Please provide all required fields",
      });
    }
    const eventData = {
      event,
      description,
      presentation,
      exam,
      date,
      time,
      file,
    };

    const result = await createEvent(eventData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to add event",
      });
    }

    return res.status(201).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Error adding event:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// UPDATE EVENT
eventRouter.put("/:id", auth, upload.single("file"), async (req, res) => {
  try {
    const { event, description, presentation, exam, date, time } = req.body;
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or missing ID",
      });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    let file = req.file ? req.file.filename : null;

    const updateData = {
      event,
      description,
      presentation,
      exam,
      date,
      time,
      file,
    };

    const result = await updateEvent(objectId, updateData);

    if (!result || result.status !== "ok") {
      return res.status(500).json({
        status: "error",
        message: result.message || "Failed to update event",
      });
    }

    return res.status(200).json({ status: "ok", data: result });
  } catch (error) {
    console.error("Fejl i updateEvent:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// DELETE EVENT
eventRouter.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "No ID provided",
        data: {},
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await deleteEvent(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

// GET EVENT BY ID
eventRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: "error",
        message: "Event ID is required",
        data: [],
      });
    }

    if (!isValidObjectId(id)) return;

    const result = await getEventById(id);

    if (result.status === "not_found") {
      return res.status(404).send(result);
    }

    if (result.status === "error") {
      return res.status(500).send(result);
    }

    return res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default eventRouter;
