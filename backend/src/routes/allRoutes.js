const express=require('express')
const router=express.Router()
const { registerUser, loginUser, getAllUsers ,updateUser,deleteUser} = require("../controllers/auth");

router.post('/registerUser',registerUser)
router.post('/loginUser',loginUser)
router.get('/getAllUsers',getAllUsers)
router.put('/updateUser/:id',updateUser)
router.delete('/deleteUser/:id',deleteUser)
module.exports=router