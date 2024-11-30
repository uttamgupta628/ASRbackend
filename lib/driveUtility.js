const {google} = require('googleapis') ;

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });
  const drive = google.drive({ version: "v3", auth: oauth2Client });

function shareFileToAnyone(fileId){
    // drive.permissions.create({
    //     fileId: fileId ,
    //     auth : oauth2Client ,
    //     requestBody :{
    //         type : 'anyone',
    //         role: 'reader',
    //     }
    // },)
    drive.permissions.list({fileId : fileId},(err,res)=>{
        if(res)
    })
}

module.exports = {shareFileToAnyone} ;