const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads/gallery");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null, uploadDir)
    },


    filename:(req,file,cb)=>{

        cb(
            null,
            Date.now()+"-"+file.originalname
        )

    }

});


const upload = multer({
    storage:storage,

    limits:{
        fileSize:2*1024*1024
    }

});


module.exports = upload;