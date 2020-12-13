const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    orderItems : [
        {
            name : {type : String, required : true},
            quantity : {type : Number, required : true},
            image : {type : String, required : true },
            price : { type : String, required : true },
            product : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'Product'},
        }
    ],
    shippingAddress : {
        address : {type : String, required : true},
        city : {type : String, required : true},
        postalCode : {type : String, required : true},
        country : {type : String, required : true},
    },
    totalPrice : {
        type : Number,
        required : true,
        default : 0
    },
    shippingPrice : {
        type : Number,
        required : true,
        default : 0
    },
    // paymentMethod : {
    //     type : String,
    //     required : true
    // },
    // paymentResult : {
    //     id : {type : String, required : true},
    //     status : {type : String, required : true},
    //     update_time : {type : String, required : true},
    //     email_address : {type : String, required : true},
    // },
    isPaid : {
        type : Boolean,
        required : true,
        default : false
    },
    isDelivered : {
        type : Boolean,
        required : true,
        default : false
    }
    // paidAt : {
    //     type : Date
    // },
    // deliveredAt : {
    //     type : Date
    // },
}, {
    timestamps : true
})

module.exports = mongoose.model('Order', OrderSchema);