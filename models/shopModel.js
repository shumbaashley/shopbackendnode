
const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true,
    },
    phone : {
        type : String,
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
}, {
    timestamps : true
})

module.exports = mongoose.model('Shop', shopSchema);