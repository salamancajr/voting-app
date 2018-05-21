const {User} = require("./../models/users")

var authenticate = (req, res, next) => {

    var token = req.cookies["x-auth"];
 
    
    User.findByToken(token).then((user) => {

        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(console.log(e));

    })

}

module.exports = {authenticate};