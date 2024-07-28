const mongoose = require("mongoose")

const {Schema, model} = mongoose 


const TodoSchema =new Schema({
    todo:{
        type:String,
        minlength:[1,"write something useful bruv"],
        maxlength:[30,"stopr yapping this much"]
    }
})

const TodoModel = model('Todos',TodoSchema)
module.exports = TodoModel