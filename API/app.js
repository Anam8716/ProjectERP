const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser=require('body-parser');
const database = require('./config/database');
const passport = require("passport");

const app = express();
app.use(cors({credentials: true, origin: true})); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Initializ passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Connect To Database
mongoose.connect(database.db,{ useNewUrlParser: true });

// On connection
mongoose.connection.on('connected', ()=>{
    console.log('connected to database '+ database);
});

const users = require('./routes/users');

app.use('/users',users);

// On error
mongoose.connection.on('error', (err)=>{
    console.log('database error :  '+err);
});

// Set Static Folder
app.use(express.static(path.join(__dirname,'/client')));


app.listen(3000,function () {
    console.log("Server is listning on port" + 3000);
});