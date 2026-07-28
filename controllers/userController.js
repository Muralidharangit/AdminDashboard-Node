const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER ADMIN

const createUser = async (req, res) => {

   try {

      const {
         name,
         email,
         password,
         role,
         category
      } = req.body;


      // check existing user

      const existingUser = await User.findOne({
         email
      });

      if (existingUser) {

         return res.status(400).json({
            message: "User already exists"
         });

      }


      // password encrypt

      const hashedPassword = await bcrypt.hash(password, 10);


      // create user

      const user = await User.create({

         name,
         email,
         password: hashedPassword,
         role: role || "Viewer",
         category: category || "General"

      });


      res.status(201).json({

         success: true,
         message: "Admin Created Successfully",
         user

      });


   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }

};


// LOGIN ADMIN

const loginUser = async (req, res) => {


   try {

      const {
         email,
         password
      } = req.body;


      // find user

      const user = await User.findOne({
         email
      });


      if (!user) {

         return res.status(404).json({
            message: "User not found"
         });

      }


      // Compare password

      const checkPassword = await bcrypt.compare(
         password,
         user.password
      );


      if (!checkPassword) {

         return res.status(400).json({
            message: "Invalid Password"
         });

      }


      // create token

      const token = jwt.sign(

         {
            id: user._id
         },

         process.env.JWT_SECRET,

         {
            expiresIn: "1d"
         }

      );


      res.json({

         message: "Login Successful",

         token,

         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            category: user.category
         }

      });


   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }


};


// GET ALL USERS
const getUsers = async (req, res) => {
   try {
      const users = await User.find().select("-password").sort({ createdAt: -1 });
      res.status(200).json({
         success: true,
         count: users.length,
         users
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};

// DELETE USER
const deleteUser = async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found"
         });
      }
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
         success: true,
         message: "User deleted successfully"
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};


// UPDATE USER ROLE & CATEGORY
const updateUser = async (req, res) => {
   try {
      const { role, category } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found"
         });
      }
      
      if (role !== undefined) user.role = role;
      if (category !== undefined) user.category = category;
      
      await user.save();
      
      res.status(200).json({
         success: true,
         message: "User updated successfully",
         user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            category: user.category
         }
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};


module.exports = {
   createUser,
   loginUser,
   getUsers,
   deleteUser,
   updateUser
};