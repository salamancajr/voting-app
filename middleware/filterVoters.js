const {User} = require("./../models/users");
const {Poll} = require("./../models/polls");


var filterVoters = (req, res, next) => {
    
 try{   var id = req.user._id
    Poll.findOne({question: req.params.id}).then((poll)=>{
        if (poll.voters.indexOf(id)>-1){
            res.redirect("/allpolls")
        }
        else{next();}
    }, (e)=>{console.log(e);
    })
}catch(e){
    Poll.findOne({question: req.params.id}).then((poll)=>{
        if (poll.voters.indexOf(req.headers["x-forwarded-for"])>-1){
            res.redirect("/allpolls")
        }
        else{next();}
    }, (e)=>{console.log(e);
    })
}
}
module.exports = {filterVoters};