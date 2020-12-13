const router = require('express').Router();
const User = require('../models/userModel');
const auth = require('../middleware/auth')


// @desc    Get all users
// @route   /api/users
// @access  Private
router.get('/', auth , async (req, res) => {
    const users = await User.find().select('-password')

    res.send(users)
})

// 
// @desc    Get my user details
// @route   /api/users/me
// @access  Private
router.get('/me', auth , async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')

    res.send(user)
})

// @desc    GET a specific user by id
// @route   /api/users/:userId
// @access  Private
router.get('/:userId', auth , async (req, res) => {
    try {
        const user = await User.findOne({_id : req.params.userId}).select('-password')        
        res.json(user)
    } catch (error) {
        res.status(500).send(error)
    }

})

// @desc    Update existing user information
// @route   /api/users/:userId
// @access  Private
router.put('/:userId', auth , async (req, res) => {
    try {
        const user = await User.updateOne({_id : req.params.userId}, {$set : { name : req.body.name  }})
        res.json("User updated successfully")        
    } catch (error) {
        res.status(500).json(error)
    }
})

// @desc    Delete a user
// @route   /api/users/me
// @access  Private 
router.delete('/me', auth , async (req, res) => {
    try {
        await Profile.deleteOne({ user : req.user.id })
        await User.deleteOne({_id : req.user.id })
        res.json({message : "User Account successfully deleted"})
    } catch (error) {
        res.status(500).send({message : "Server error"})
    } 

})



module.exports = router