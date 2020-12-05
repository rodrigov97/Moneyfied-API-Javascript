const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "dist/Moneyfied-Web/assets/media/images/profile-pictures");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploads = multer({ storage: storage });

module.exports = uploads;