const express = require('express');
const router = express.Router()
const product = require('../models/productModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const { body, validationResult } = require('express-validator');
const auth = require('../utils/verifyToken')


// @desc    Create a new product
// @route   /api/products
// @access  Private
router.post('/', 
    [   
        body('name').not().isEmpty().trim().withMessage('must not be empty'),
        body('image').not().isEmpty().trim().withMessage('must not be empty'),
        body('price').not().isEmpty().trim().withMessage('must not be empty'),
        body('brand').not().isEmpty().trim().withMessage('must not be empty'),
        body('description').not().isEmpty().trim().withMessage('must not be empty'),
        body('category').not().isEmpty().trim().withMessage('must not be empty')
    ],

    async (req , res) => {
        console.log(req.user)

        // Validate product data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
    try {
        // const user = await User.findById(req.user._id)

        // console.log(user)

        const productDetails = new Product({
            shop : "5fd4a09f71c0e21bfe0ecea2",
            name : req.body.name,
            image : req.body.image,
            price : req.body.price,
            description : req.body.description,
            brand : req.body.brand,
            category : req.body.category,
        })

        console.log(productDetails)

        const product = await productDetails.save() 
        return res.status(201).send({
            "msg" : "Product created",
            "product" : product
        })
    } catch (error) {
        return res.status(500).send({"msg" : "Server error"})       
    }


})



// @desc    Get all products
// @route   /api/products
// @access  Public
router.get('/', async (req , res) => {
    try {
        const products = await Product.find().sort({date : -1})
        return res.json(products) 
    } catch (error) {
        return res.status(500).send({"msg" : "Server error"})       
    }
 
})


// @desc    Get products by id
// @route   /api/products/:id
// @access  Public
router.get('/:id', async (req , res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product)  return res.status(404).send({"msg" : "This product does not exist"})
    
        return res.json(product)
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send({"msg" : "This product does not exist"})
        }
        return res.status(500).send({"msg" : "Server error"})       

    }
 
})


// @desc    Update a single product
// @route   /api/products/:id
// @access  Public



// @desc    Delete a single product
// @route   /api/product/:id
// @access  Private
router.delete('/:id', async (req , res) => {

    try {
        const product = await Product.findById(req.params.id)
        if(!product) return res.status(404).send({"msg"  : "This product does not exist"})
    
        // check if user deleting the product owns the product
    
        // if(product.shop.toString() !== req.user.id) return res.status(401).send({"msg" : "You are not allowed to delete this product"})
    
        await product.remove()
        return res.json({"msg" : "Product deleted successfully"}) 
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).send({"msg" : "This product does not exist"})
        }
        return res.status(500).send({ "msg" : "Server error"}) 
    }

})




module.exports = router

