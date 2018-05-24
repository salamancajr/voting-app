const express = require("express");
const loginRouter = express.Router();
const {User} = require("./../models/users")
const {Poll} = require("./../models/polls")

const {authenticate} = require("./../middleware/authenticate");

loginRouter.get("/login", (req, res) => {

    if (typeof req.cookies["msg"] == "string") {
        var paragraph = req.cookies["msg"];
        res.clearCookie("msg")
    } else {
        var paragraph = "Enter your user name and password";
    }

    res.render("project.hbs", {
        paragraph,
        login: true,
        one: true,
        method: "post",
        action: "/account",
        home: true
    })
})

loginRouter.get("/delete/:id", authenticate, (req, res) => {


    Poll.findOneAndRemove({
        question: req.params.id
    }).then((poll) => {

        res.render("project.hbs", {
            paragraph: req.params.id + " was successfully deleted!",
            two: true,
            button1: "Home",
            button2: "See your polls",
            link1: "/account",
            link2: "/yourpolls",
            pie: true
        })
    }, (e) => {
        console.log(e);
    })
})

loginRouter.get("/logout", authenticate, (req, res) => {
    res.clearCookie("x-auth");

    var token = req.token;
    User.findOneAndUpdate({
        email: req.user.email
    }, {
        $pull: {
            tokens: {
                token
            }
        }
    }).then((user) => {

    }, (err) => {
        console.log(err);
    })
    res.redirect('/')
})

module.exports = {loginRouter}