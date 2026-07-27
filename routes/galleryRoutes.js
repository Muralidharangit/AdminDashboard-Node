const express = require("express");
const upload = require("../middleware/upload");

const router = express.Router();

const {
    createGallery,
    getGallery
} = require("../controllers/galleryController");


router.post("/", upload.single("image"), createGallery);

router.get("/", getGallery);


module.exports = router;