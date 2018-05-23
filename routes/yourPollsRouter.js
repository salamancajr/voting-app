const express = require("express");
const yourPollsRouter = express.Router();
const {User} = require("./../models/users")
const {Poll} = require("./../models/polls")
const {authenticate} = require("./../middleware/authenticate");


yourPollsRouter.get("/yourpolls", authenticate, (req, res) => {
    
    
    Poll.find({
        _creator:req.user._id
    }).then((polls) => {
 
        var a = [];
        polls.forEach(function (poll) {
            a.push("<a href='/polls/" + poll.question + "'>" + poll.question + "</a><br><br>")


        })
        a = a.join().replace(/\,/g, "")
 
        res.render("project.hbs", {
            paragraph: `These are all your polls:`,
            two: true,
            button1: "Home",
            button2: "See all polls",
            link1: "/account",
            link2: "/allpolls",
            poll: "<ul>" + a + "</ul>"

        })
    }, (e)=>{console.log(e);
    })

})

yourPollsRouter.get("/polls/:id", authenticate, (req, res) => {
    var sup = req.params.id
     
    sup = sup.replace(/\s/g, "%2520");
    sup2 = req.params.id.replace(/\s/g, "%20")
    Poll.findOne({
        question: req.params.id
    }).then((poll) => {
         
          
        var num = poll.answers[0].tally
        var ans = poll.answers[0].answer
        
        if(req.user._id.equals(poll._creator)){
            var button2 = "Add Answer";
            var link2 = "/edit/" + sup2;
            var button4 = "Delete";
            var link4 = "/delete/" + sup2;

        }
        else{
            var button2 = false;
            var link2 = false;
            var button4 = false;
            var link4 = false;
            
        }




        
        if(poll.voters.indexOf(req.user._id)>-1){
            var link3 = null;
            var button3=null;
            var paragraph= req.params.id +": Your vote is in the ballot box!";
        }
        else{
             var link3 = "/vote/" + sup2; 
            var button3="Vote";
            var paragraph= req.params.id
        }
        
        
        if(num.every(n=>n==0)){
    res.render("project.hbs", {
                paragraph,
                button1: "See all polls",
                button2,
                button3,
                button4,
                link1: "/allpolls",
                link2,
                link3,
                link4,
                tooltip: "No votes yet for "+req.params.id, 
                graph: true,
                share:true,
                shareP:req.params.id,
                site:sup
           })


        }
        else{
 
            res.render("project.hbs", {
                paragraph,
                button1: "See all polls",
                button2,
                button3,
                button4,
                link1: "/allpolls",
                link2,
                link3,
                link4,
                graph: true,
                tooltip:"Hover over the pie chart to find out more",
                num,
                ans: ans,
                share:true,
                shareP:req.params.id,
                site: sup
                    })
        }
    }, (e) => {
        console.log(e);
    });

});

module.exports = {yourPollsRouter}