import express from "express";
import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { mdcPath } from "../helpers/mdcPath";

dotenv.config(); // Indlæs miljøvariabler fra .env-filen

const uploadRouter = express.Router();

// Opret forbindelse til DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: "https://medieskolerne.ams3.digitaloceanspaces.com",
  region: "ams3",
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY,
    secretAccessKey: process.env.DO_SECRET_KEY,
  },
});

// Multer middleware til at håndtere filupload i hukommelsen
const upload = multer({ storage: multer.memoryStorage() });

const uploadFileToS3 = async (file, folder) => {
  if (!file) return null;

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = `mediacollege/${folder}/${fileName}`;

  const params = {
    Bucket: "mediacollege",
    Key: filePath,
    Body: file.buffer,
    ACL: "public",
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://medieskolerne.ams3.digitaloceanspaces.com/${filePath}`;
  } catch (error) {
    console.error("Fejl ved upload til S3:", error);
    return null;
  }
};

uploadRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Ingen fil modtaget" });
    }

    const fileUrl = await uploadFileToS3(req.file, ...mdcPath("pdfs"));

    if (!fileUrl) {
      return res.status(500).json({ message: "Upload fejlede" });
    }

    res.json({ message: "Fil gemt!", filePath: fileUrl });
  } catch (error) {
    console.error("Fejl ved upload:", error);
    res.status(500).json({ message: "Serverfejl" });
  }
});

export default uploadRouter;
