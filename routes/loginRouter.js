const express = require("express");
const loginRouter = express.Router();
var flash = require('connect-flash');
const {User} = require("./../models/users")
const {Poll} = require("./../models/polls")
var session = require("express-session")

const {authenticate} = require("./../middleware/authenticate");
loginRouter.use(flash());
loginRouter.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));


loginRouter.get("/login", (req, res) => {
    var message =req.flash("eLogin")
    var paragraph = "Enter your user name and password";
 console.log(typeof message[0]);
 
    if(typeof message[0]== "string")
    {var paragraph = message[0]; }
 else{
    var paragraph = "Enter your user name and password";
 }
    res.render("project.hbs", {
        paragraph,
        login: true,
        one: true,
        method: "post",
        action: "/account",
        home:true
    })
})

loginRouter.get("/account", authenticate, (req, res) => {

    res.render("project.hbs", {
        paragraph: `What would you like to do?`,
        button1: "New poll",
        button2: "See your polls",
        all:true,
        link1: "/newpoll",
        link2: "/yourpolls",
        pie: true,
        two: true
    })

})

loginRouter.post("/account", (req, res) => {
var email;
 
    User.findByCredentials(
        req.body.usremail,
        req.body.password
    ).then((user)=>{
         
        email = user.email;
        
        return user.generateAuthToken();
        
        
    }).then((token) => {
        res.clearCookie("x-auth");
        res.cookie('x-auth', token); 
        res.render("project.hbs", {
            paragraph: `Welcome back ${email}. What would you like to do?`,
            button1: "New poll",
            button2: "See your polls",
            link1: "/newpoll",
            link2: "/yourpolls",
            all:true,
            pie: true,
            two: true
        })
    
        
    }).catch((err)=>{
        req.flash("eLogin", "Username or password is not correct.");
        res.redirect("/login");
    })
})


loginRouter.get("/delete/:id", authenticate, (req, res) => {


    Poll.findOneAndRemove({
        question: req.params.id
    }).then((poll) => {



        res.render("project.hbs", {
            paragraph: req.params.id+" was successfully deleted!",
            two: true,
            button1: "Home",
            button2: "See your polls",
            link1: "/account",
            link2: "/yourpolls",
            pie:true
        })
    }, (e) => {
        console.log(e);
    })
})

loginRouter.get("/logout", authenticate, (req, res)=>{
    res.clearCookie("x-auth");  
     
    var token = req.token;
    User.findOneAndUpdate({email:req.user.email}, {$pull:{tokens:{token}}}).then((user)=>{

    }, (err)=>{console.log(err);
    })
    res.redirect('/')
})

module.exports = {loginRouter}