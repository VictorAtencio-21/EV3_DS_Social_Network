const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        email: {type: String,  
            required: true, 
            trim: true, 
            unique: true},
        password: {
            type: String, 
            required: true},
        isAdmin: {
            type: Boolean,
            default: false,
          },
        followers: {
            type: Array,
            default: [],
          },
        followings: {
            type: Array,
            default: [],
          } 
    }
)

module.exports = mongoose.model('User', UserSchema);