const User = require('../models/user');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');



    router.get('/',(req,res)=>{
        res.json('Welcome');
    });

    router.post('/signup',(req,res)=>{
        var newUser= new User({
            username:req.body.username,
            password:req.body.password
        });
        User.createUser(newUser,(err,user)=>{
            if(err){
                res.status(500).json({success: false, msg: 'Not registered'});
            }else{
                res.status(200).json({success: true, user: user});
            }
        })
    })



router.post('/login',(req,res)=>{
    const uname = req.body.username;
    const pass = req.body.password;

    User.getUserByUsername(uname,(err,user)=>{
        if(err){
            res.status(500).json({success:false , msg: 'Internal Server Error'});
        }
        if(!user){
            return res.json({success:false, msg: "user not found"});
        } else {
            User.comparePassword(pass,user.password,(err,isMatch)=>{
                if(err){
                    res.status(500).json({success:false , msg: 'Internal Server Error'});
                } else {
                    if(isMatch){
                        var t_user = {
                            id:user._id,
                            username:user.username
                        }
                        var token = jwt.sign(t_user,config.secret,{expiresIn:600000});
                        res.json({success: true, token:'JWT '+token, user:{
                            id:user._id,
                            username:user.username
                        } });
                    }else{
                        return res.json({success:false, msg: 'password does not match'});
                    }

                }
            });

        }
               
        
    });
});

router.get('/getProfile',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({success:true,msg:'you are logged in'});
});




 module.exports = router;