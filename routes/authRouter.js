const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/userModel.js')


// @desc    Register a user
// @route   /api/auth/register
// @access  Public
router.post('/register',
    [   
        check('firstname', "First name cannot be empty").not().isEmpty().trim(),
        check('lastname', "Last name cannot be empty").not().isEmpty().trim(),
        check('username', "Username cannot be empty").not().isEmpty().trim(),
        check('email', "Please provide a valid email").isEmail(),
        check('password', "Please enter a password with 8 or more characters").isLength({ min: 8 })
    ],

    async (req,res)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        // Check if email already exists
        const emailExist = await User.findOne({email : req.body.email})
        if(emailExist) return res.status(400).send({"msg": "Email already exists"})


        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        const user = new User({
            lastname : req.body.lastname,
            firstname : req.body.firstname,
            username : req.body.username,
            email :req.body.email,
            password : hashedPassword
        })

        try {
            await user.save()
            res.send({"msg" : "User registered successfully"})
        } catch (err) {
            res.status(500).send({"msg" : "Server error"})
        }
})


// @desc    Login User
// @route   /api/auth/login
// @access  Public
router.post('/login',
    [
        check('email', "Please provide a valid email").isEmail(),
        check('password', "Please enter a password with 8 or more characters").isLength({ min: 8 })
    ],

    async (req,res)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // Check if user exists
        const user = await User.findOne({email : req.body.email})
        if(!user) return res.status(400).send({"msg" : "Incorrect email. Please use your valid credentials"})

        // Check Password Validity
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword) return res.status(400).send({"msg" : "Incorrect password. Please use your valid credentials."})
    
        // Create JWT Token
        const token = await jwt.sign({
            id : user.id,
            firstname : user.firstname,
            lastname : user.lastname,
            username : user.username,
            email : user.email,
            isAdmin : user.isAdmin
        }, process.env.TOKEN_SECRET)

        res.send({"token" : token})
})


// @desc    Register an admin user
// @route   /api/auth/superuser
// @access  Public
router.post('/superuser',
    [   
        check('firstname', "First name cannot be empty").not().isEmpty().trim(),
        check('lastname', "Last name cannot be empty").not().isEmpty().trim(),
        check('username', "Username cannot be empty").not().isEmpty().trim(),
        check('email', "Please provide a valid email").isEmail(),
        check('password', "Please enter a password with 8 or more characters").isLength({ min: 8 })
    ],

    async (req,res)=>{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        // Check if email already exists
        const emailExist = await User.findOne({email : req.body.email})
        if(emailExist) return res.status(400).send({"msg": "Email already exists"})


        // Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        const user = new User({
            lastname : req.body.lastname,
            firstname : req.body.firstname,
            username : req.body.username,
            email :req.body.email,
            password : hashedPassword,
            isAdmin : true,
        })

        try {
            await user.save()
            res.send({"msg" : "User registered successfully"})
        } catch (err) {
            res.status(500).send({"msg" : "Server error"})
        }
})

module.exports = router