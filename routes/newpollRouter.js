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

    var tally = [];
    var answer = [];
    req.body.answer.forEach((ans) => {
        answer.push(ans.replace(/[^A-Z, a-z, 0-9]/g, ""))
        tally.push(0)
    })


var question = req.body.question.replace(/[^A-Z, a-z, 0-9]/g, "")
    var poll = new Poll({

        question,
        answers: {
            answer,
            tally
             
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
        
    }, (e)=>{console.log('not valid input');
    })

})

module.exports = {newPollRouter}