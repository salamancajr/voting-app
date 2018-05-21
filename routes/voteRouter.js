const express = require("express");
const voteRouter = express.Router();
const {User} = require("./../models/users");
const {Poll} = require("./../models/polls");
const {authenticate} = require("./../middleware/authenticate");

voteRouter.get("/vote/:id", authenticate, (req, res) => {

 
    Poll.find({
        question: req.params.id
    }).then((poll) => {
 
        var ans = poll[0].answers[0].answer;
        res.render("project.hbs", {
            paragraph: req.params.id,
            radio: true,
            ans,
            path: req.params.id,
        })
    }, (e) => {
        console.log("could not find poll");
    })
})

voteRouter.post("/vote/:id", authenticate, (req, res) => {

    Poll.findOneAndUpdate({
        question: req.params.id
    }, {
        $inc: {
            ["answers.0.tally." + req.body.answer]: +1
        },
        $push:{
            voters: req.user._id
        }
    }).then((poll) => {

 
        var ans = poll.answers[0].answer;
        res.render("project.hbs", {
            paragraph: "Your vote was submitted!",
            two: true,
            button1: "Home",
            button2: "See your polls",
            link1: "/account",
            link2: "/yourpolls",
            pie:true,
            share:true,
            shareP:req.params.id
        })
    })
    }, (e) => {
        console.log(e.message);
    })
 

module.exports = {voteRouter}