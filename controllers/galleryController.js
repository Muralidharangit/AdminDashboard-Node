const Gallery = require("../models/Gallery");


// CREATE

const createGallery = async(req,res)=>{

    try{
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image file" });
        }

        const gallery = await Gallery.create({
            title: req.body.title,
            image: req.file.filename,
            images: [req.file.filename]
        });

        res.status(201).json({
            message:"Gallery created successfully",
            gallery
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// GET ALL

const getGallery = async(req,res)=>{

    try{

        const galleries = await Gallery.find();

        res.status(200).json(galleries);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



module.exports = {
    createGallery,
    getGallery
};