const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String
    },
    age:Number,
    email : {
        type: String
    }
});


module.exports = mongoose.model('User',userSchema);