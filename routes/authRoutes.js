const express = require('express')
const router = express.Router()
const {register, login, logout, forgotPassword, resetPassword, changePassword} = require('../controller/authController')
const protect = require('../middleware/protect')
const {PERMISSIONS} = require('../config/roles')
const authorizationPermission = require('../middleware/authorizationPermission')
router.post('/register',register)
router.post('/login',login)
router.post('/logout', logout)

router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

router.post('/change-password', protect, changePassword)

router.get('/profile',protect,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Profile fetched successfully"
    })
})

router.get('/admin',protect,authorizationPermission(PERMISSIONS.VIEW_USERS),(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Access granted"
    })
})

module.exports=router