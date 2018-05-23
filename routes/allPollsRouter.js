const express = require("express");
const allPollsRouter = express.Router();
const {User} = require("./../models/users")
const {Poll} = require("./../models/polls")
const {authenticate} = require("./../middleware/authenticate");
const {filterVoters} = require("./../middleware/filterVoters");

allPollsRouter.get("/allpolls", (req, res) => {

    Poll.find({}).then((polls) => {

        if (req.cookies["x-auth"]) {
            var loggedOut = false,
                button1 = "Home",
                link1 = "/account",
                link = "polls",
                home = false
        } else {
            var loggedOut = true,
                link1 = "/",
                button1 = "Sign Up/Log In",
                link = "allpolls",
                home = true
        }

        var a = [];
        polls.forEach(function (poll) {
            a.push("<a href='/" + link + "/" + poll.question + "'>" + poll.question + "</a><br><br>")
        })
        a = a.join().replace(/\,/g, "")
        res.render("project.hbs", {
            paragraph: `These are the polls of all users:`,
            two: true,
            button1,
            button2: "See your polls",
            link1,
            link2: "/yourpolls",
            poll: "<ul>" + a + "</ul>",
            loggedOut,
            home

        })
    })

})

allPollsRouter.get("/allpolls/:id", (req, res) => {
    var sup = req.params.id;
    sup = sup.replace(/\s/g, "%2520")
    sup2 = req.params.id.replace(/\s/g, "%20")

    Poll.findOne({
        question: req.params.id
    }).then((poll) => {
        if(req.cookies["x-auth"]){
            var home = false
        }
        else{
            var home = true
        }
        var num = poll.answers[0].tally
        var ans = poll.answers[0].answer

        if(poll.voters.indexOf(req.headers["x-forwarded-for"])>-1){
            var button2 =false,
            link2=false
            
        }else{
            var button2 ="Vote"
            link2="/allpoll/"+encodeURI(req.params.id)
        }

        if (num.every(n => n == 0)) {
            res.render("project.hbs", {
                paragraph: req.params.id,
                button1: "See all polls",
                link1: "/allpolls",
                link2,
                button2,
                tooltip: "No votes yet for " + req.params.id,
                graph: true,
                share: true,
                shareP: req.params.id,
                site: sup,
                home
            })
        } else {

            res.render("project.hbs", {
                paragraph: req.params.id,
                button1: "See all polls",
                link1: "/allpolls",
                link2,
                button2,
                graph: true,
                tooltip: "Hover over the pie chart to find out more",
                num,
                ans: ans,
                share: true,
                shareP: req.params.id,
                site: sup,
                home
            })
        }
    }, (e) => {
        console.log(e);;
    });

});
////////////////////////////////////////////////////////////////////////////////////

allPollsRouter.get("/allpoll/:id", filterVoters, (req, res) => {
    sup2 = req.params.id.replace(/\s/g, "%20")

 
    Poll.find({
        question: req.params.id
    }).then((poll) => {
 
        var ans = poll[0].answers[0].answer;
        res.render("project.hbs", {
            paragraph: req.params.id,
            radio: true,
            ans,
            path: "/allpoll/"+sup2,
            home:true
        })
    }, (e) => {
        console.log("could not find poll");
    })
})

allPollsRouter.post("/allpoll/:id", (req, res) => {


    Poll.findOneAndUpdate({
        question: req.params.id
    }, {
        $inc: {
            ["answers.0.tally." + req.body.answer]: +1
        },
        $push:{
            voters: req.headers["x-forwarded-for"]
        }
    }).then((poll) => {

 
            var button1= "Home",
            button2= "See all polls",
            link1= "/",
            link2= "/allpolls"; 
        
        var ans = poll.answers[0].answer;
        res.render("project.hbs", {
            paragraph: "Your vote was submitted!",
            two: true,
            button1,
            button2,
            link1,
            link2,
            pie:true,
            share:true,
            shareP:req.params.id,
            home:true
        })
    })
    }, (e) => {
        console.log(e.message);
    })




module.exports = {allPollsRouter};