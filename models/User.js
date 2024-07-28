const mongoose = require("mongoose")
const {Schema, model} = mongoose 

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:[true,"username must be unique"],
        minlength:[4,"must be atleast 4 character"],
        maxlength:[15,"must not be more than 15 characters"],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9]+$/.test(v);
            },
            message: props => `${props.value} contains special characters. Only letters and numbers are allowed.`
        }
    },
    password:{
        type:String,
        required:true,
        minlength:[4,"password must be atleast 4 characters"],
        //match: /^[a-zA-Z0-9@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/

    }
})


const UserModel = model('User',UserSchema)
module.exports = UserModel