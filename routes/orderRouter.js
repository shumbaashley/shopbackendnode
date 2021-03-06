const express = require('express');
const router = express.Router()
const Order = require('../models/orderModel')
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth')


// @desc    Create a new order
// @route   /api/orders
// @access  Public
router.post('/', 
    [   
        body('firstname').not().isEmpty().trim().withMessage('First name must not be empty'),
        body('lastname').not().isEmpty().trim().withMessage('Last name must not be empty'),
        body('orderItems').not().isEmpty().trim().withMessage('Order Items must not be empty'),
        body('shippingAddress').not().isEmpty().trim().withMessage('Shipping address must not be empty'),
        body('totalPrice').not().isEmpty().trim().withMessage('Postal Code must not be empty'),
        body('shippingPrice').not().isEmpty().trim().withMessage('Shipping Price must not be empty')
    ], 

    async (req , res) => {

        // Validate order data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
    try {

        const {firstname, lastname, shippingAddress, shippingPrice, totalPrice, orderItems} = req.body

        console.log(firstname, lastname, shippingAddress, shippingPrice, totalPrice, orderItems)

        const orderDetails = new Order({
            firstname,
            lastname,
            shippingAddress,
            shippingPrice,
            totalPrice,
            orderItems
        })

        const order = await orderDetails.save() 
        return res.status(201).send({
            "msg" : "Order created",
            "order" : order
        })
    } catch (error) {
        return res.status(500).send({"msg" : "Server error", "error" : error})       
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

