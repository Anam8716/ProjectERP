const mongoose = require('mongoose');
const config = require('../config/database');
var bcrypt =require('bcryptjs');

const UserSchema = mongoose.Schema({
    
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

const User = mongoose.model('User',UserSchema);

module.exports = User.getUserByUsername = function(uname,callback){
    User.findOne({
        username: uname
    },callback);
}

module.exports = User.createUser= function(newUser,callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err){
                res.status(500).json({success: false, msg: err});
            }else{
                newUser.password=hash;
                newUser.save(callback);
            }
        })
    })
}

module.exports=User.comparePassword = function(myPassword,hash,callback){
    bcrypt.compare(myPassword,hash,(err,isMatch)=>{
        if(err){
            res.status(500).json({success: false, msg: err});
        }else{
            callback(null,isMatch);
        }

    });
    
}

module.exports=User.getUserById = function(id,callback){
    User.findById(id,callback);
    
}

module.exports = User;