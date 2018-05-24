const express = require("express");
const accountRouter = express.Router();
const {User} = require("./../models/users")
const {authenticate} = require("./../middleware/authenticate");

accountRouter.get("/account", authenticate, (req, res) => {

    res.render("project.hbs", {
        paragraph: `What would you like to do?`,
        button1: "New poll",
        button2: "See your polls",
        all: true,
        link1: "/newpoll",
        link2: "/yourpolls",
        pie: true,
        two: true
    })

})

accountRouter.post("/account", (req, res) => {
    var email;

    User.findByCredentials(
        req.body.usremail,
        req.body.password
    ).then((user) => {

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
            all: true,
            pie: true,
            two: true
        })


    }).catch((err) => {
        res.cookie("msg", "Username or password incorrect.")
        res.redirect("/login");
    })
})

module.exports = {accountRouter};