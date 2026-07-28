const express = require("express");

const router = express.Router();

const {
createUser,
loginUser,
getUsers,
deleteUser,
updateUser
}=require("../controllers/userController");


router.post("/",createUser);
router.post("/login",loginUser);
router.get("/",getUsers);
router.delete("/:id",deleteUser);
router.put("/:id",updateUser);



module.exports = router;