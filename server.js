const express = require("express");
const { google } = require("googleapis");
const dontenv = require("dotenv");
const generateCertificate = require("./lib/pdfGenarator");
const stream = require("stream");
const cors = require("cors")
const fs = require('fs') ;
dontenv.config();

const PORT = process.env.PORT || 7000 ;

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

app.use(cors()) ;

const drive = google.drive({ version: "v3", auth: oauth2Client });
app.post("/generate", async (req, res) => {
  try {
    const { name, date } = req.body;
    
    console.log(req.body) ;
      const fileMetadata = {
        name: `${name}-${new Date().toISOString()}.pdf`, 
        mimeType: "application/pdf", 
      };
      const filePath = generateCertificate(name,date)
      await new Promise((r)=>{
        setTimeout(()=>{r()},100)
      }) ;
      const media = {
        mimeType: "application/pdf",
        body: fs.createReadStream(filePath), 
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });

      res.status(200).send({ fileId: response.data.id, pdfLink : `https://drive.google.com/file/d/${response.data.id}/view?usp=drive_link` });
      setTimeout(()=>{
        console.log(filePath," File is trying to remove")
        fs.unlink(filePath,(err)=>{
          if(err){
            console.log(filePath , " Failed To Delete")
          }
          else {
            console.log("Success fully Deleted the ", filePath) ;
          }
        }) ;
      },5000)
  } catch (err) {
    console.error("Error generating certificate:", err);
    res.status(500).send({ error: "Failed to generate certificate" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:"+PORT);
});
