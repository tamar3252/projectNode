const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const {UserModel,validUser,validLogin,createToken} =require('../models/userModel')
const { authUser, authAdmin } = require('../middleware/auth');


router.get('/',(req,res)=>{
    res.json({msg:"Rest api work!"})
})


//sign up
router.post('/', async (req, res) => {
    let validateUser = validUser(req.body);
    if (validateUser.error) {
        return res.status(400).json(validateUser.error.details);
    }
    try {
        let user = new UserModel(req.body)
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "***";
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already in system, try log in" })
        }
        res.status(500).json({ msg: "err", err })
    }
})

//log in
router.post('/login', async (req, res) => {
    let validateLogin = validLogin(req.body);
    if (validateLogin.error) {
        return res.status(400).json(validateLogin.error.details[0].message);
    }
    try {
        let user = await UserModel.findOne({email:req.body.email})
        if (!user) {
            return res.status(401).json({ msg: "Password or email is worng" })
        }
        let authPassword = await bcrypt.compare(req.body.password,user.password)
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is worng" })
        }
        let token = createToken(user._id, user.role);
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ msg: "err", err })
    }
})


router.get('/myDetails',authUser,async(req,res)=>{
    try {
        let userDetails=await UserModel.findOne({_id:req.tokenData._id},{password:0})
        res.json(userDetails)
    } 
    catch (err) {
        res.status(500).json(err)
    }
})

//for admin
router.get('/allUsersDetails',authAdmin,async(req,res)=>{
    try {
        let allUsersDetails=await UserModel.find({},{password:0})
        res.json(allUsersDetails)
    } 
    catch (err) {
        res.status(500).json(err)
    }
})
router.put('/', authUser, async (req, res) => {
    let validateUser = validUser(req.body);
    if (validateUser.error) {
        return res.status(400).json(validateUser.error.details);
    }
    try {
        let user = await UserModel.updateOne({ _id: req.tokenData._id }, req.body);
        if (user.modifiedCount == 0) {
            res.status(500).send({ msg: "you cant edit this user" });
        }
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).json({ msg: "err", err })
    }
})

router.delete('/:delId', authAdmin, async (req, res) => {
    let userId = req.params.delId;
    try {
        let user = await UserModel.deleteOne({ _id: userId });
        if (user.deletedCount == 0) {
            res.status(500).send({ msg: "you cant delete user" });
        }
        res.status(200).send(user);
    }
    catch (err) {
        res.status(500).json({ msg: "err", err })
    }
})

module.exports = router;