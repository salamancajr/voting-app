const express = require("express");
const editRouter = express.Router();
const {User} = require("./../models/users")
const {Poll} = require("./../models/polls")
const {authenticate} = require("./../middleware/authenticate");


editRouter.get("/edit/:id", authenticate, (req, res) => {

    var sup = req.params.id
    sup = sup.replace(/\s/g, "%20")
    Poll.find({
        question: req.params.id
    }).then((poll) => {


        var ans = poll[0].answers[0].answer;
        res.render("project.hbs", {
            paragraph: req.params.id,
            quessubmit: true,
            method: "post",
            action: "/edit/" + sup
        })
    }, (e) => {
        console.log(e.message);
    })
})

editRouter.post("/edit/:id", authenticate, (req, res) => {
 
    Poll.findOneAndUpdate({question: req.params.id}, {$addToSet: {["answers.0.answer"]: req.body.answer}
    }).then((poll) => {
 

        res.render("project.hbs", {
            paragraph: "Your edit was submitted!",
            two: true,
            button1: "Home",
            button2: "See your polls",
            link1: "/account",
            link2: "/yourpolls",
            pie:true,
            share:true,
            shareP:req.params.id,
            site:req.params.id.replace(/\s/g, "%2520")

        })
    }, (e) => {
        console.log(e);
    })
})

module.exports = {editRouter};