var mongoose = require("mongoose");
var Poll = mongoose.model("Poll", {
    question:{
        type:"string",
        required:true,
        minlength:5,
        trim:true
    },
    answers:[{
        answer:{
            type:Array,
            required:true,
            minlength:5,
            trim:true
        },
        tally:{
            type:Array,
            required:true,
            default:null
        }
    }],
    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    voters:{
        type:Array,
        default:null
    }
})
module.exports ={Poll}