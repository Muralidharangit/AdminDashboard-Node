const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");


const galleryRoutes = require("./routes/galleryRoutes");


dotenv.config();

connectDB();


const app = express();


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "dist")));


// Routes

app.use("/api/users",userRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/blogs", require("./routes/blogRoutes"));


const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server running ${PORT}`);
});