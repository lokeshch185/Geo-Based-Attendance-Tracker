const express = require("express");
const multer = require("multer");
const axios = require("axios");

const router = express.Router();

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload-image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64Image = req.file.buffer.toString("base64");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCE5BugFHROVuwsXixeoYdUhgqVAXfJs7M",
      {
        contents: [
          {
            parts: [
              { text: "Analyze this room image and as a designer suggest 3 main ways to optimise space." },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }
    );
    if (response.data.candidates && response.data.candidates.length > 0) {
        console.log("Generated Content:", response.data.candidates[0].content.parts[0].text);
        res.json({ message: "Image processed successfully", data: response.data.candidates[0].content.parts[0].text });
      } else {
        res.status(500).json({ message: "No response from Gemini" });
      }    
} catch (error) {
    console.error("Error processing image:", error.response?.data || error.message);
    res.status(500).json({ message: "Image processing failed", error: error.response?.data });
  }
});

module.exports = router;
