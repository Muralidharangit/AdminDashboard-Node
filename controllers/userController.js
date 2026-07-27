const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER ADMIN

const createUser = async (req, res) => {

   try {

      const {
         name,
         email,
         password
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
         password: hashedPassword

      });


      res.status(201).json({

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
            email: user.email
         }

      });


   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }


};


module.exports = {
   createUser,
   loginUser
};