const multer = require("multer");
const path = require("path");

// Upload folder set
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // সব image যাবে এই নির্দিষ্ট ফোল্ডারে
    cb(null, "uploads/teamProfile/");
  },
  filename: function (req, file, cb) {
  const fileName = `${req.body.name.replace(/\s+/g, "_")}-${Date.now()}${path.extname(file.originalname)}`;
  cb(null, fileName);
},
});

const upload = multer({ storage: storage });

module.exports = upload;



// const multer = require("multer");
// const path = require("path");

// // Upload folder set
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/teamProfile/");
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${req.body.id}-${req.body.name.replace(/\s+/g, "_")}-${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, fileName);
//   },
// });

// // File type filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/; // allowed extensions
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true); // accept file
//   } else {
//     cb(new Error("Only image files (jpg, jpeg, png, gif) are allowed!")); // reject file
//   }
// };

// // Combine storage + filter
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// module.exports = upload;
