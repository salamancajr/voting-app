const express = require("express");
const newPollRouter = express.Router();
const {User} = require("./../models/users");
const {Poll} = require("./../models/polls");
const {authenticate} = require("./../middleware/authenticate");

newPollRouter.get("/newpoll", authenticate, (req, res) => {
    
  
    res.render("project.hbs", {
        paragraph: `Enter your poll question and answers then submit`,
        quessubmit: true,
        method: "post",
        action: "/newpoll",
        ques: true
    })
})



newPollRouter.post("/newpoll", authenticate, (req, res) => {

    var b = [];
    var a = req.body.answer.forEach((ans) => {
        b.push(0)
    })

    var poll = new Poll({

        question: req.body.question,
        answers: {
            answer: req.body.answer,
            tally: b
             
        },
        _creator:req.user._id
    })
    poll.save().then(() => {
         
        
        res.render("project.hbs", {
            paragraph: `Poll submitted!`,
            two: true,
            button1: "Home",
            button2: "See your polls",
            link1: "/account",
            link2: "/yourpolls",
            pie:true
        })
        
    })

})

module.exports = {newPollRouter}