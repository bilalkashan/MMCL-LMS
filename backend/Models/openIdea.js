const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OpenIdeaSchema = new Schema({
    topic:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    caseStudy:{
        type:String,
        required:true
    },
    technology:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    
})
const OpenIdeaModel= mongoose.model("OpenIdea", OpenIdeaSchema);
module.exports = OpenIdeaModel;