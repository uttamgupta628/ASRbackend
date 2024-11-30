const PDFDocument = require("pdfkit");
const fs = require("fs");

// Create a document
function generateCertificate(name, date) {
  const doc = new PDFDocument({
    size: [495, 350],
    margin: 0,
  });

  // Set the path where the PDF will be saved
  // const outputFilePath = 'certificate.pdf';
//   const filePath = `./genarate`
  const filePath = `./genarate/${name}_${(new Date()).getTime()}.pdf`
  // Save the PDF to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Add the background image
  doc.image("./lib/template.png", 0, 0, { width: 495, height: 350 }); // A4 dimensions in points

  // Add text for the certificate

  doc
    .fontSize(25)
    .font("./fonts/Charm-Regular.ttf")
    .fillColor("blue")
    .text(name, 350, 140);

  doc.fontSize(12).fillColor("black").text(date, 250, 300);

  // Finalize the PDF and write to file
  doc.end();
  return filePath ;
}

module.exports = generateCertificate;
