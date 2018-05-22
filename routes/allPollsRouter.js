const express = require("express");
const allPollsRouter = express.Router();
const {User} = require("./../models/users")
const {Poll} = require("./../models/polls")
const {authenticate} = require("./../middleware/authenticate");

allPollsRouter.get("/allpolls", (req, res) => {
     
    Poll.find({}).then((polls) => {
        
        if(req.cookies["x-auth"]){
            var loggedOut=false,
            button1= "Home",
            link1= "/account"
            link = "polls"
        }
        else{
            var loggedOut=true,
            link1="/",
            button1="Sign Up/Log In",
            link = "allpolls"
        }
        
        var a = [];
        polls.forEach(function (poll) {
            a.push("<a href='/"+link+"/" + poll.question + "'>" + poll.question + "</a><br><br>")


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
            loggedOut

        })
    })

})

allPollsRouter.get("/allpolls/:id", (req, res) => {
    var sup = req.params.id
    sup = sup.replace(/\s/g, "%20")
    Poll.findOne({
        question: req.params.id
    }).then((poll) => {
         
          
        var num = poll.answers[0].tally
        var ans = poll.answers[0].answer
        
 



        
 
        
        if(num.every(n=>n==0)){
    res.render("project.hbs", {
                paragraph:`These are the polls of all users:`,
                button1: "See all polls",
 
                link1: "/allpolls",
     
                tooltip: "No votes yet for "+req.params.id, 
                graph: true,
                share:true,
                shareP:req.params.id
           })


        }
        else{
 
            res.render("project.hbs", {
                paragraph:`These are the polls of all users:`,
                button1: "See all polls",
  
                link1: "/allpolls",
 
                graph: true,
                tooltip:"Hover over the pie chart to find out more",
                num,
                ans: ans,
                share:true,
                shareP:req.params.id
                    })
        }
    }, (e) => {
        console.log(e);;
    });

});

module.exports = {allPollsRouter};