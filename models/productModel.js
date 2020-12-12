const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    shop :  {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Shop'
    },
    image : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true,
        default : 0
    },
    brand : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true,
        default : 0
    },
    countInStock : {
        type : Number,
        required : true,
        default : 0
    }
}, {
    timestamps : true
})

module.exports = mongoose.model('Product', productSchema);