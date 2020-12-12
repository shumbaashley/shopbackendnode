const express = require('express');
const router = express.Router()
const Shop = require('../models/shopModel')
const User = require('../models/userModel')
const { body, validationResult } = require('express-validator');
const auth = require('../utils/verifyToken')


// @desc    Create a new shop
// @route   /api/shops
// @access  Private
router.post('/', 
    [   
        body('name').not().isEmpty().trim().withMessage('must not be empty'),
        body('image').not().isEmpty().trim().withMessage('must not be empty'),
        body('location').not().isEmpty().trim().withMessage('must not be empty'),
        body('description').not().isEmpty().trim().withMessage('must not be empty'),
        body('phone').not().isEmpty().trim().isLength({ min: 8 }).withMessage('must be at least 8 chars long')
    ],

    async (req , res) => {
        console.log(req.user)

        // Validate shop data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
    try {
        // const user = await User.findById(req.user._id)

        // console.log(user)

        const shopDetails = new Shop({
            user : "5fd484559f21002a7fa97f08",
            name : req.body.name,
            image : req.body.image,
            location : req.body.location,
            description : req.body.description,
            phone : req.body.phone,
        })

        console.log(shopDetails)

        const shop = await shopDetails.save() 
        return res.status(201).send({
            "msg" : "Shop created"
        })
    } catch (error) {
        return res.status(500).send({"msg" : "Server error"})       
    }


})



// @desc    Get all shops
// @route   /api/shops
// @access  Public
router.get('/', async (req , res) => {
    try {
        const shops = await Shop.find().sort({date : -1})
        return res.json(shops) 
    } catch (error) {
        return res.status(500).send({"msg" : "Server error"})       
    }
 
})


// @desc    Get shops by id
// @route   /api/shops/:id
// @access  Public
router.get('/:id', async (req , res) => {
    try {
        const shop = await Shop.findById(req.params.id)
        if(!shop)  return res.status(404).send({"msg" : "This shop does not exist"})
    
        return res.json(shop)
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send({"msg" : "This shop does not exist"})
        }
        return res.status(500).send({"msg" : "Server error"})       

    }
 
})


// @desc    Update a single shop
// @route   /api/shops/:id
// @access  Public



// @desc    Delete a single shop
// @route   /api/shop/:id
// @access  Private
router.delete('/:id', async (req , res) => {

    try {
        const shop = await Shop.findById(req.params.id)
        if(!shop) return res.status(404).send({"msg"  : "This shop does not exist"})
    
        // check if user deleting the shop owns the shop
    
        if(shop.owner.toString() !== req.user.id) return res.status(401).send({"msg" : "You are not allowed to delete this shop"})
    
        await shop.remove()
        return res.json({"msg" : "Shop deleted successfully"}) 
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send({"msg" : "This shop does not exist"})
        }
        return res.status(500).send({ "msg" : "Server error"}) 
    }

})




module.exports = router

