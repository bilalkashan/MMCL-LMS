const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoticeBoardSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    },
})
const NoticeBoardModel= mongoose.model("NoticeBoard", NoticeBoardSchema);
module.exports=NoticeBoardModel;