require("./config/config")
const express = require("express");
const hbs = require("hbs");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const {User} = require("./models/users");
const cookieParser = require('cookie-parser');
const port = process.env.PORT;
var app = express();
const authenticate = require("./middleware/authenticate")


const {loginRouter} = require("./routes/loginRouter");
const {newPollRouter} = require("./routes/newpollRouter");
const {voteRouter} = require("./routes/voteRouter");
const {editRouter} = require("./routes/editRouter");
const {yourPollsRouter} = require("./routes/yourPollsRouter");
const {allPollsRouter} = require("./routes/allPollsRouter");


mongoose.connect(process.env.MONGODB_URI, (e) => {
    if (!e)
   ('Now connected to mongo server');

}).catch((e) => {
    console.log(e.message);

});

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use("/", editRouter)
app.use("/", allPollsRouter)
app.use("/", loginRouter);
app.use("/", newPollRouter);
app.use("/", voteRouter);
app.use("/", yourPollsRouter);


app.get("/", (req, res) => {
    if(req.cookies["x-auth"]){
        res.redirect("/account")
    }

    res.render("project.hbs", {
        paragraph: "Create an account or login to start up your very own poll",
        button1: "Login",
        button2: "Sign Up",
        link1: "/login",
        link2: "/signup",
        three:true,
        button3:"see all polls",
        link3:"/allpolls",
        pie: true,
        two: true,
        home:true
    });
});

app.get("/signup", (req, res) => {
    
    res.render("project.hbs", {
        paragraph: "Enter a user name and password",
        login: true,
        method: "post",
        action: "/signup",
        home:true
    })
})

app.post("/signup", (req, res) => {
    let email = req.body.usremail;
    let password = req.body.password;


    var user = new User({
        email,
        password
    })
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token)=>{
        res.clearCookie("x-auth");
        res.cookie('x-auth', token); 
        
         res.render("project.hbs", {
            paragraph: `Welcome ${email}. What would you like to do?`,
            button1: "New poll",
            button2: "See your polls",
            button3: "See all polls",
            link1: "/newpoll",
            link2: "/yourpolls",
            link3: "/allpolls",
            pie: true,
            two: true
        })
    }, (e) => {
        console.log(e.message);
    })

})



app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})