const multer = require('multer');
const path = require('path');
// Set Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/uploads/' + 'contactUs');
    },
    filename: (req, file, callback) => {
        callback(null, + Date.now() +
            path.extname(file.originalname));
    }
});
// Check File Type
function checkFileType(file, callback) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif|txt|doc|mp4|docx|pdf/;
    // Test extension
    const extname =
        filetypes.test(path.extname(file.originalname).toLowerCase());
    // Test mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return callback(null, true);
    }
    else {
        callback({ message: 'File not supported.' });
    }
}
// Define Upload Function
const fileUpload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
}).single('fileUpload'); // Must be the name as the HTML file upload input

module.exports = fileUpload;