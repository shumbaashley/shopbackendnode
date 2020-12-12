const express = require('express');
const router = express.Router()
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const { body, validationResult } = require('express-validator');
const auth = require('../utils/verifyToken')


// @desc    Create a new order
// @route   /api/orders
// @access  Private
router.post('/', 
    [   
        body('firstname').not().isEmpty().trim().withMessage('must not be empty'),
        body('lastname').not().isEmpty().trim().withMessage('must not be empty'),
        body('address').not().isEmpty().trim().withMessage('must not be empty'),
        body('city').not().isEmpty().trim().withMessage('must not be empty'),
        body('code').not().isEmpty().trim().withMessage('must not be empty'),
        body('country').not().isEmpty().trim().withMessage('must not be empty')
    ],

    async (req , res) => {
        // console.log(req.user)

        // Validate order data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
    try {
        // const user = await User.findById(req.user._id)

        // console.log(user)

        const orderDetails = new Order({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            shippingAddress : {
                address : req.body.address,
                city : req.body.city,
                postalCode : req.body.code,
                country : req.body.country,
            },
            shippingPrice : 20.00,
            orderItems : [
                {
                    name : "Demo Prod",
                    quantity : 2,
                    image : "https://product.image",
                    price : 120,
                    product : "5fd4a8a032c43f2c6f411f7d",
                },
                {
                    name : "Demo Prod 3",
                    quantity : 1,
                    image : "https://products.image",
                    price : 120,
                    product : "5fd4a8a032c43f2c6f411f7d",
                }
            ]
        })

        console.log(orderDetails)

        const order = await orderDetails.save() 
        return res.status(201).send({
            "msg" : "Order created",
            "order" : order
        })
    } catch (error) {
        return res.status(500).send({"msg" : "Server error"})       
    }


})



// @desc    Get all orders
// @route   /api/orders
// @access  Public
router.get('/', async (req , res) => {
    try {
        const orders = await Order.find().sort({date : -1})
        return res.json(orders) 
    } catch (error) {
        return res.status(500).send({"msg" : "Server error"})       
    }
 
})


// @desc    Get orders by id
// @route   /api/orders/:id
// @access  Public
router.get('/:id', async (req , res) => {
    try {
        const order = await Order.findById(req.params.id)
        if(!order)  return res.status(404).send({"msg" : "This order does not exist"})
    
        return res.json(order)
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send({"msg" : "This order does not exist"})
        }
        return res.status(500).send({"msg" : "Server error"})       

    }
 
})


// @desc    Update a single order
// @route   /api/orders/:id
// @access  Public



// @desc    Delete a single order
// @route   /api/order/:id
// @access  Private
router.delete('/:id', async (req , res) => {

    try {
        const order = await Order.findById(req.params.id)
        if(!order) return res.status(404).send({"msg"  : "This order does not exist"})
    
        // check if user deleting the order owns the order
    
        // if(order.shop.toString() !== req.user.id) return res.status(401).send({"msg" : "You are not allowed to delete this order"})
    
        await order.remove()
        return res.json({"msg" : "Order deleted successfully"}) 
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send({"msg" : "This order does not exist"})
        }
        return res.status(500).send({ "msg" : "Server error"}) 
    }

})




module.exports = router

