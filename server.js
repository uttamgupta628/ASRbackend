const express = require("express");
const { google } = require("googleapis");
const dontenv = require("dotenv");
const generateCertificate = require("./lib/pdfGenarator");
const stream = require("stream");
const fs = require('fs') ;
const { shareFileToAnyone } = require("./lib/driveUtility");
dontenv.config();

const app = express();
app.use(express.json()); 
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });
shareFileToAnyone("1IhpVxsW3xXll5L7E6oeyo3WNu2FkjhLw") ;
app.post("/generate", async (req, res) => {
  try {
    const { name, date } = req.body;
    

      const fileMetadata = {
        name: `${name}-${new Date().toISOString()}.pdf`, 
        mimeType: "application/pdf", 
      };

      const media = {
        mimeType: "application/pdf",
        body: fs.createReadStream(generateCertificate(name,date)), 
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });

      res.status(200).send({ fileId: response.data.id });
  } catch (err) {
    console.error("Error generating certificate:", err);
    res.status(500).send({ error: "Failed to generate certificate" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
