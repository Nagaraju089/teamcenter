const nodemailer = require('nodemailer');

async function sendEmail(emailData) {
  if(emailData){
    //console.log(emailData)
  
  const transporter = nodemailer.createTransport({
   // host: process.env.EMAIL_HOST,
   service: 'gmail',
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    
    },
  });

  await transporter.sendMail(emailData);
}
else{
  console.log("No proper data");
}
}

module.exports = { sendEmail };
