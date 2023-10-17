const mongoose = require('mongoose');
const {add} = require("nodemon/lib/rules");

const addressSchema = new mongoose.Schema({
    number:String,
    street:String
})
const usersSchema = new mongoose.Schema({
    nome: String,
    eta: {
        type:Number,
        min:25,
        validate:{
            validator: v => v % 2 === 0,
            message: props => `${props.value} is not even`
        }
    },
    createdAt: {
        type:Date,
        immutable:true,
        default: () => Date.now(),
    },
    updateAd: {
        type:Date,
        default: () => Date.now(),
    },
    bestFriend: mongoose.SchemaTypes.ObjectId,
    hobbies: [String],
    address: addressSchema,
    email:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("utenti",usersSchema)